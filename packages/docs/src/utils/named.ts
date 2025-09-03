const hyphenateRE = /\B([A-Z])/g;
export function hyphenate(str: string) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
}
const camelizeRE = /-(\w)/g;
export function camelize(str: string) {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
}
