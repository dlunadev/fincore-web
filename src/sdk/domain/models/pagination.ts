export interface PagedResult<T> {
  data:        T[];
  total:       number;
  page:        number;
  page_size:   number;
  total_pages: number;
}

export interface PageParams {
  page?:      number;
  page_size?: number;
}
