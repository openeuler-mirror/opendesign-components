export function getLangByFileName(_fileName: string) {
  const fileName = _fileName.slice(_fileName.lastIndexOf('/') + 1);
  const [name, lang, ext] = fileName.split('.');
  if (!ext) {
    return { name, lang: '', ext: lang };
  }
  return { name, lang, ext };
}
