import { isFunction } from '../_shared/is';
import { PointMoveT } from '../_shared/pointer';
import Effect, { EffectOptionT } from './effect';
interface ItemT {
  index: number;
  el: HTMLElement;
}
enum ToggleClass {
  IN = 'o-carousel-toggle-in',
  OUT = 'o-carousel-toggle-out',
  CURRENT = 'o-carousel-toggle-current',
}
export default class Toggle extends Effect {
  private slideList: ItemT[];
  private isChanging: boolean;
  private resolveArr:((value: null | number) => void)[];
  constructor(slideElList: HTMLElement[], slideContainer: HTMLElement, activeIndex: number, options?: EffectOptionT) {
    super(slideElList, slideContainer, activeIndex, options);

    this.isChanging = false;
    this.resolveArr = []

    this.slideList = slideElList.map((el, idx) => {
      el.addEventListener('animationend', () => {
        el.classList.remove(ToggleClass.IN, ToggleClass.OUT);

        this.isChanging = false;

        if (idx === this.currentIndex) {
          this.resolveArr.forEach((fn) => fn(null));
          this.resolveArr = [];
        }
      });

      return {
        index: idx,
        el,
      };
    });

    this.active(activeIndex, false, false);
  }
  handleTouchStart() {}
  handleTouchMove() {}
  handleTouchEnd(pos: PointMoveT) {
    if (this.isChanging) {
      return;
    }
    const { dx, dy } = pos;

    let toIdx = this.currentIndex;

    if (Math.abs(dy) < Math.abs(dx) && Math.abs(dx) > 20) {
      toIdx += dx < 0 ? 1 : -1;
      return toIdx;
    }

    return;
  }

  active(toIndex: number, animate = true, force: boolean = false): Promise<null | number> {
    return new Promise((resolve) => {
      if (this.total === 0 || this.isChanging || (!force && this.currentIndex === toIndex)) {
        return resolve(null);
      }

      if (this.currentIndex !== toIndex && isFunction(this.onBeforeChange) && this.onBeforeChange(toIndex, this.currentIndex) === false) {
        Promise.resolve(null);
      }

      this.isChanging = animate;
      const toSlide = this.slideList[toIndex];
      const fromSlide = this.slideList[this.currentIndex];

      if (!toSlide) {
        return resolve(null);
      }

      fromSlide?.el.classList.remove(ToggleClass.CURRENT);
      toSlide.el.classList.add(ToggleClass.CURRENT);
      if (animate) {
        toSlide.el.classList.add(ToggleClass.IN);
        fromSlide.el.classList.add(ToggleClass.OUT);
        this.resolveArr.push(resolve);
      } else {
        return resolve(toIndex);
      }
    }).then(() => {
      if (isFunction(this.onChanged) && this.currentIndex !== toIndex) {
        this.onChanged(toIndex, this.currentIndex);
      }
      this.currentIndex = toIndex;
      return toIndex;
    });
  }
  destroyed() {}
}
