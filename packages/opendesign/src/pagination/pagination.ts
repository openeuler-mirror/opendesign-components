function getNumbers(min: number, max: number) {
  const arr = [];
  for (let i = min; i <= max; i++) {
    arr.push(i);
  }
  return arr;
}
export function getPagerList(totalPage: number, currentPage = 1, showPageCount = 9) {
  const activePage = currentPage > totalPage ? totalPage : currentPage;

  const maxCount = showPageCount > 3 ? showPageCount : 3;
  let pages: Array<{ value: number | 'left' | 'right'; isMore?: boolean; list?: number[] }> = [];

  /**
   * 如果页码小于最大显示页码数，直接显示全部
   */
  if (totalPage <= maxCount) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push({ value: i });
    }
    return pages;
  }

  /**
   * 如果页码大于最大显示页码数，需要处理页码隐藏
   */
  // 先设置首尾页码
  pages[0] = { value: 1 };
  pages[maxCount - 1] = { value: totalPage };

  if (maxCount === 3) {
    // 如果只显示3个，则中间全部隐藏
    pages[1] = {
      isMore: true,
      value: 'left',
      list: getNumbers(2, totalPage - 1),
    };
  } else {
    const d = (maxCount - 3) / 2;

    let min = activePage - Math.floor(d);
    let max = activePage + Math.ceil(d);

    // 处理边缘问题
    if (max > totalPage - 1) {
      min -= max - totalPage + 1;
      max = totalPage - 1;
    }
    if (min < 2) {
      max += 2 - min;
      min = 2;
    }

    // 判断第二个页码是否隐藏
    if (min < 3) {
      pages[1] = { value: 2 };
      min = 2;
    } else {
      pages[1] = {
        isMore: true,
        value: 'left',
        list: getNumbers(2, min),
      };
    }

    // 判断倒数第二个页码是否隐藏
    if (max > totalPage - 2) {
      pages[maxCount - 2] = { value: totalPage - 1 };
      max = totalPage - 1;
    } else {
      pages[maxCount - 2] = {
        isMore: true,
        value: 'right',
        list: getNumbers(max, totalPage - 1),
      };
    }

    // 处理中间显示的页码
    getNumbers(min + 1, max - 1).forEach((item, idx) => {
      pages[2 + idx] = { value: item };
    });
  }

  return pages;
}

export type PagerListT = ReturnType<typeof getPagerList>;
export type PagerItemT = PagerListT[0];

export function getSizeOptions(pageSizes: number[], sufix: string, currentPageSize?: number) {
  return pageSizes.map((item) => ({
    label: item + sufix,
    value: item,
    active: currentPageSize === item,
  }));
}
