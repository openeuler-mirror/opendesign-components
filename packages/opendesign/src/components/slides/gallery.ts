interface SlideItemT {
  el: HTMLElement;
  width: number;
  left: number;
}
interface ContainerT {
  el: HTMLElement;
  width: number;
}
type AlignT = 'center' | 'left';

export interface GallerySlidesT {
  active: (slideIndex: number) => Promise<null | number>;
  loopRange: () => void;
  transformX: (value: number, animate: boolean) => Promise<null | number>;
}
export interface GallerySlidesOptionT {
  alignType: 'center' | 'left';
  onChange?: () => void;
}

let resolveArr: ((value: null | number) => void)[] = [];
export default class GallerySlides {
  container: ContainerT;
  slideList: SlideItemT[];
  total: number;
  alignType: AlignT;
  moveValue: number;
  currentIndex: number;
  isChanging: boolean;
  waitAnimation: (() => void) | null;
  constructor(slideElList: HTMLElement[], slideContainer: HTMLElement, activeIndex: number, options?: GallerySlidesOptionT) {
    const { alignType = 'center' } = options || {};
    this.total = slideElList.length;
    this.waitAnimation = null;

    slideContainer.addEventListener('transitionend', () => {
      slideContainer.style.willChange = '';
      slideContainer.classList.remove('is-animating');
      console.log('animate end');

      this.loopRange();
      this.isChanging = false;

      if (resolveArr.length > 1) {
        resolveArr.forEach((fn) => fn(null));
        resolveArr = [];
      }
    });
    slideContainer.addEventListener('transitionstart', () => {
      slideContainer.style.willChange = 'transform';
    });

    let s = 0;
    this.slideList = slideElList.map((el) => {
      const w = el.clientWidth;
      const l = s;
      el.style.left = `${l}px`;

      s += w;
      return {
        el,
        width: el.clientWidth,
        left: l,
      };
    });

    this.container = {
      el: slideContainer,
      width: slideContainer.clientWidth,
    };

    this.alignType = alignType;
    this.moveValue = 0;
    this.currentIndex = -1;
    this.isChanging = false;

    this.active(activeIndex, false);
    this.loopRange();
  }
  active(slideIndex: number, animate = true): Promise<null | number> {
    if (this.total === 0 || this.isChanging || this.currentIndex === slideIndex) {
      return Promise.resolve(null);
    }
    this.isChanging = animate;
    this.currentIndex = slideIndex;
    const slide = this.slideList[slideIndex];
    if (!slide) {
      return Promise.resolve(null);
    }
    const { width: cw } = this.container;
    const { width: sw, left: sl } = slide;
    if (this.alignType === 'center') {
      return this.transformX((cw - sw) / 2 - sl, animate);
    }
    return Promise.resolve(slideIndex);
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

      const { el } = this.container;

      if (animate === true) {
        el.classList.add('is-animating');
      }

      el.style.transform = `translate3d(${value}px,0,0)`;
      if (animate) {
        resolveArr.push(resolve);
      } else {
        resolve(null);
      }
    });
  }
}
