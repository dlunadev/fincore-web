import type { PagedResult } from '../../domain/models/pagination';

// C# serializes PascalCase → camelCase by default
interface BackendPagedResult<T> {
  items:      T[];
  totalCount: number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export function mapPagedResult<T>(raw: BackendPagedResult<T>): PagedResult<T> {
  return {
    data:        raw.items      ?? [],
    total:       raw.totalCount ?? 0,
    page:        raw.page       ?? 1,
    page_size:   raw.pageSize   ?? 10,
    total_pages: raw.totalPages ?? 1,
  };
}
