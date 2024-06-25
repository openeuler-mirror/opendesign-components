export interface LanguageT {
  locale: string;
  common?: {
    empty: string;
    loading: string;
  };
  pagination?: {
    goto: string;
    page: string;
    countPerPage: string;
    total: string;
  };
  upload?: {
    buttonLabel: string;
    drag: string;
    dragHover: string;
    retry: string;
    delete: string;
    preview: string;
    edit: string;
  };
  select?: {
    cancel: string;
    confirm: string;
  };
  input?: {
    limit: string;
  };
}
export type i18nLanguages = Record<string, LanguageT>;
