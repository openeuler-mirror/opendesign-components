import { isFunction } from '../_shared/is';
import { PointMoveT } from '../_shared/pointer';
import Effect, { EffectOptionT } from './effect';
import { useResizeObserver } from '../hooks';
import { debounceRAF } from '../_shared/utils';

interface GalleryItemT {
  index: number;
  el: HTMLElement;
  width: number;
  left: number;
}
interface ContainerT {
  el: HTMLElement;
  width: number;
}
type AlignT = 'center' | 'left';
enum GalleryClass {
  CURRENT = 'o-carousel-toggle-current',
}
export interface GalleryT {
  active: (slideIndex: number) => Promise<null | number>;
  loopRange: () => void;
  transformX: (value: number, animate: boolean) => Promise<null | number>;
}
export interface GalleryOptionT extends EffectOptionT {
  alignType?: 'center' | 'left';
  onChanged?: (from: number, to: number) => void;
}

export default class Gallery extends Effect {
  private container: ContainerT;
  private slideList: GalleryItemT[];
  private alignType: AlignT;
  private moveValue: number;
  private isChanging: boolean;
  private isSliding: boolean; // 是否在切换
  private oldMoveValue: number;
  private destroyObserver: () => void;
  private resolveArr: ((value: null | number) => void)[];
  constructor(slideElList: HTMLElement[], slideContainer: HTMLElement, activeIndex: number, options?: GalleryOptionT) {
    super(slideElList, slideContainer, activeIndex, options);

    const { alignType = 'center' } = options || {};
    this.total = slideElList.length;

    this.resolveArr = [];

    slideContainer.addEventListener('transitionend', () => {
      slideContainer.style.willChange = '';
      slideContainer.classList.remove('is-animating');

      this.isChanging = false;

      if (this.resolveArr.length > 0) {
        this.resolveArr.forEach((fn) => fn(null));
        this.resolveArr = [];
      }
    });

    this.alignType = alignType;
    this.moveValue = 0;
    // this.currentIndex = activeIndex;
    this.isChanging = false;

    // handle touch
    this.isSliding = false;
    this.oldMoveValue = 0;

    this.slideList = [];

    this.container = {
      el: slideContainer,
      width: 0,
    };

    const or = useResizeObserver();
    const listener = debounceRAF(() => {
      this.update(slideElList, slideContainer);
      this.active(activeIndex, false, true);
    });
    or.observe(slideContainer, listener);
    this.destroyObserver = () => {
      or.unobserve(slideContainer, listener);
    };
  }
  update(slideElList: HTMLElement[], slideContainer: HTMLElement) {
    let s = 0;
    this.slideList = slideElList.map((el, idx) => {
      const w = el.clientWidth;
      const l = s;
      el.style.left = `${l}px`;

      s += w;

      return {
        index: idx,
        el,
        width: el.clientWidth,
        left: l,
      };
    });

    this.container = {
      el: slideContainer,
      width: slideContainer.clientWidth,
    };
  }
  handleTouchStart() {
    this.oldMoveValue = this.moveValue;
    this.isSliding = true;
  }
  handleTouchMove(pos: PointMoveT, e: TouchEvent) {
    if (!this.isSliding) {
      return;
    }
    const { dx, dy } = pos;

    // 判断是否为横向滑动
    if (Math.abs(dx) > Math.abs(dy)) {
      this.isSliding = true;
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();
      this.transformX(this.oldMoveValue + dx, false);
    } else {
      this.isSliding = false;
    }
  }
  handleTouchEnd(pos: PointMoveT) {
    this.isSliding = false;
    const { width: sw } = this.slideList[this.currentIndex];

    // TODO 处理slide宽度不一致问题，一次滚动多个
    const step = Math.abs(pos.dx) / sw > 0.2 ? 1 : 0;

    const toIdx = this.currentIndex + (pos.dx < 0 ? step : -1 * step);
    return toIdx;
  }

  active(toIndex: number, animate = true, force: boolean = false): Promise<null | number> {
    if (this.total === 0 || this.isChanging || (!force && this.currentIndex === toIndex)) {
      return Promise.resolve(null);
    }

    if (this.currentIndex !== toIndex && isFunction(this.onBeforeChange) && this.onBeforeChange(toIndex, this.currentIndex) === false) {
      Promise.resolve(null);
    }

    this.isChanging = animate;
    const toSlide = this.slideList[toIndex];
    const fromSlide = this.slideList[this.currentIndex];

    toSlide.el.classList.add(GalleryClass.CURRENT);
    fromSlide?.el.classList.remove(GalleryClass.CURRENT);

    if (this.activeClass) {
      toSlide.el.classList.add(this.activeClass);
      fromSlide?.el.classList.remove(this.activeClass);
    }

    if (!toSlide) {
      return Promise.resolve(null);
    }
    const { width: cw } = this.container;
    const { width: sw, left: sl } = toSlide;
    if (this.alignType === 'center') {
      return this.transformX((cw - sw) / 2 - sl, animate).then(() => {
        if (isFunction(this.onChanged) && this.currentIndex !== toIndex) {
          this.onChanged(toIndex, this.currentIndex);
        }
        this.currentIndex = toIndex;
        this.loopRange();
        return toIndex;
      });
    }
    return Promise.resolve(toIndex);
  }
  loopRange() {
    const cidx = this.currentIndex;
    const half = (this.total - 1) / 2;

    const orderSlideList = [];
    const tm = [];
    for (let i = cidx; i <= cidx + Math.ceil(half); i++) {
      if (i < this.total) {
        orderSlideList.push(this.slideList[i]);
        tm.push(i);
      } else {
        orderSlideList.push(this.slideList[i - this.total]);
        tm.push(i - this.total);
      }
    }
    for (let i = cidx - 1; i >= cidx - Math.floor(half); i--) {
      if (i >= 0) {
        orderSlideList.unshift(this.slideList[i]);
        tm.unshift(i);
      } else {
        orderSlideList.unshift(this.slideList[this.total + i]);
        tm.unshift(this.total + i);
      }
    }
    let s = 0;
    const { left: oldLeft } = this.slideList[cidx];

    orderSlideList.forEach((item) => {
      const { el, width } = item;

      el.style.left = `${s}px`;
      item.left = s;
      s += width;
    });

    const { left: newLeft } = this.slideList[cidx];
    const d = newLeft - oldLeft;

    this.transformX(this.moveValue - d, false);
  }
  transformX(value: number, animate: boolean = true): Promise<null | number> {
    return new Promise((resolve) => {
      this.moveValue = value;
      this.isChanging = false;

      const { el } = this.container;

      if (animate === true) {
        el.classList.add('is-animating');
      }

      el.style.transform = `translate3d(${value}px,0,0)`;
      if (animate) {
        this.resolveArr.push(resolve);
      } else {
        resolve(null);
      }
    });
  }
  destroyed() {
    if (isFunction(this.destroyObserver)) {
      this.destroyObserver();
    }
  }
}
