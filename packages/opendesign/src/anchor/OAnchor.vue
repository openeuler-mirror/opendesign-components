<script setup lang="ts">
import { CSSProperties, nextTick, onMounted, onUnmounted, provide, ref } from 'vue';
import { anchorProps, type AnchorContainerT } from './types';
import { anchorInjectKey } from './provide';
import { isString, isUndefined, isWindow, isCurrentPageLink } from '../_utils/is';
import { getScroll, scrollTo } from '../_utils/dom';

const props = defineProps(anchorProps);

const emits = defineEmits<{
  /**
   * @deprecated 兼容旧版本，计划1.2.0移除
   */
  (e: 'click', ev: MouseEvent, link?: string): void;
  (e: 'change', link: string): void;
}>();

const ANCHOR_REGX = /#([\S ]+)$/;

const anchorRef = ref();

const isScrolling = ref(false);

const links = ref<Set<string>>(new Set());
const activeLink = ref('');

const indicatorStyle = ref<CSSProperties>({});

const scrollContainer = ref<AnchorContainerT>();

const getContainer = (container: string | AnchorContainerT = window) => {
  if (isString(container)) {
    const dom = document.querySelector(container) as HTMLElement;
    return dom ? dom : window;
  }
  return container;
};

const updateIndicatorPosition = () => {
  const el = anchorRef.value?.querySelector('.o-anchor-item-link.is-active');

  if (!el) {
    indicatorStyle.value = {};
  } else {
    const { offsetTop, offsetHeight } = el;
    const depth = el.getAttribute('data-depth');
    indicatorStyle.value.top = `${offsetTop}px`;
    indicatorStyle.value.height = `${offsetHeight}px`;
    indicatorStyle.value.opacity = depth === '0' ? 0 : 1;
  }
};

const setActiveLink = async (link: string) => {
  if (activeLink.value === link) {
    return;
  }

  activeLink.value = link;

  emits('change', activeLink.value);

  await nextTick();
  updateIndicatorPosition();
};

const getAnchorTarget = (link: string) => {
  const anchorMatches = ANCHOR_REGX.exec(link);

  if (!anchorMatches) {
    return;
  }

  const target = document.getElementById(anchorMatches[1]);

  return target;
};

const getOffsetTop = (el: HTMLElement, container: AnchorContainerT) => {
  const { top } = el.getBoundingClientRect();
  if (isWindow(container)) {
    return top - document.documentElement.clientTop;
  }

  return top - container.getBoundingClientRect().top;
};

/**
 * 滚动至指定锚点位置
 */
const scrollIntoView = async (link: string) => {
  if (!isCurrentPageLink(link)) {
    return;
  }
  setActiveLink(link);

  const target = getAnchorTarget(link);

  if (!target) {
    return;
  }

  isScrolling.value = true;

  const { scrollTop } = getScroll(scrollContainer.value as HTMLElement);
  const offsetTop = getOffsetTop(target, scrollContainer.value as HTMLElement);

  const y = scrollTop + offsetTop - props.targetOffset;

  await scrollTo(y, {
    container: scrollContainer.value,
  });

  isScrolling.value = false;
};

const activeNearest = () => {
  const distances: Array<{ link: string; top: number }> = [];
  const { targetOffset, bounds } = props;

  let active = '';

  links.value.forEach((link) => {
    const target = getAnchorTarget(link);
    if (target) {
      const top = getOffsetTop(target, scrollContainer.value as AnchorContainerT);

      if (top < targetOffset + bounds) {
        distances.push({
          link,
          top,
        });
      }
    }
  });

  if (distances.length) {
    const max = distances.reduce((prev, cur) => (prev.top > cur.top ? prev : cur));
    active = max.link;
  }

  setActiveLink(active);
}

// 滚动事件
const onScroll = () => {
  if (isScrolling.value) {
    return;
  }
  activeNearest();
};

const bindEvent = () => {
  if (isUndefined(scrollContainer.value)) {
    return;
  }

  scrollContainer.value.addEventListener('scroll', onScroll, { passive: true });
};

const unbindEvent = () => {
  if (isUndefined(scrollContainer.value)) {
    return;
  }

  scrollContainer.value.removeEventListener('scroll', onScroll);
};

const addLink = (link: string) => {
  if (!ANCHOR_REGX.test(link) || links.value.has(link)) {
    return;
  }

  links.value.add(link);
};

const removeLink = (link: string) => {
  links.value.add(link);
};


/**
 * @deprecated 兼容旧版本，计划1.2.0移除
 */
const onItemClick = (options: { event: MouseEvent, link?: string }) => {
  const { event, link } = options;
  emits('click', event, link);
};

provide(anchorInjectKey, {
  addLink,
  removeLink,
  onItemClick,
  activeLink,
  scrollIntoView,
  getChangeHash: () => props.changeHash,
});

onMounted(() => {
  scrollContainer.value = getContainer(props.container);
  const hash = decodeURIComponent(window.location.hash);
  if (hash) {
    scrollIntoView(hash);
  } else {
    activeNearest();
  }
  nextTick(() => {
    bindEvent();
  });
});

onUnmounted(() => {
  unbindEvent();
});
</script>

<template>
  <div ref="anchorRef" :class="['o-anchor', `o-anchor-${props.size}`]">
    <div class="o-anchor-line">
      <div class="o-anchor-indicator" :style="indicatorStyle"></div>
    </div>
    <div class="o-anchor-items">
      <slot></slot>
    </div>
  </div>
</template>
