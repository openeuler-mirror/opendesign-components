function getItem(index: number) {
  return {
    no: index,
    key: index,
    name: `William Smith ${index}`,
    salary: 27000 + index,
    address: `${index} Park Road, London`,
    email: `william.smith${index}@example.com`,
    other: `other info ${index}`,
  };
}

export function getTableData(total: number, idx = 0) {
  const rlt = [];
  for (let i = idx; i <= idx + total; i++) {
    rlt.push(getItem(i + 1));
  }
  return rlt;
}

export function requestTableData(cursor: number, length: number): Promise<{ total: number, list: any[] }> {
  const total = 100;
  return new Promise((resolve) => {
    const list = getTableData(length, cursor);
    setTimeout(() => {
      resolve({
        total,
        list
      });
    }, 1000);
  });
}