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

export function getTableData(total: number) {
  const rlt = [];
  for (let i = 1; i <= total; i++) {
    rlt.push(getItem(i));
  }
  return rlt;
}