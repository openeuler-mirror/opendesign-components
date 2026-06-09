import { getCurrentInstance, onUnmounted } from 'vue';

const links = new Set<string>();

/**
 * 为单个 URL 创建 prefetch link 并添加到文档
 * @param item - URL 配置对象
 * @param addedLinks - 已添加的 link 元素记录数组
 */
function addPrefetchLink(item: { url: string; as: string; type?: string }, addedLinks: [string, HTMLLinkElement][]): void {
  if (links.has(item.url)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[prefetch] ${item.url} has been added.`);
    }
    return;
  }
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = item.as;
  if (item.type) {
    link.type = item.type;
  }
  link.href = item.url;
  document.head.appendChild(link);
  links.add(item.url);
  addedLinks.push([item.url, link]);
}

/**
 * 清理已添加的 prefetch link 元素
 * @param addedLinks - 已添加的 link 元素记录数组
 */
function cleanupPrefetchLinks(addedLinks: [string, HTMLLinkElement][]): void {
  addedLinks.forEach(([url, link]) => {
    link.remove();
    links.delete(url);
  });
}

export const usePrefetch = (urls: Array<{ url: string; as: string; type?: string }>) => {
  if (!urls?.length) return;
  const addedLinks: [string, HTMLLinkElement][] = [];
  urls.forEach((item) => addPrefetchLink(item, addedLinks));

  if (getCurrentInstance() && addedLinks.length) {
    onUnmounted(() => cleanupPrefetchLinks(addedLinks));
  }
};
