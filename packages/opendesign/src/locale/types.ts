export interface LanguageT {
  locale: string;
  pagination: {
    goto: string;
    page: string;
    countPerPage: string;
    total: string;
  };
}
export type i18nLanguages = Record<string, LanguageT>;
