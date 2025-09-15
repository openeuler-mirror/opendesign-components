import { getCurrentInstance, onUnmounted } from 'vue';

const links = new Set<string>();

export const usePrefetch = (urls: Array<{ url: string; as: string; type?: string }>) => {
  if (!urls?.length) return;
  const addedLinks: [string, HTMLLinkElement][] = [];

  urls.forEach((item) => {
    // 如果已经存在，跳过添加
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
  });

  if (getCurrentInstance() && addedLinks.length) {
    onUnmounted(() => {
      addedLinks.forEach(([url, link]) => {
        link.remove();
        links.delete(url);
      });
    });
  }
};
