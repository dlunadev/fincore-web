import type { PagedResult } from '../../domain/models/pagination';

// C# serializes PascalCase → camelCase by default
interface BackendPagedResult<T> {
  items:      T[];
  totalCount: number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export function mapPagedResult<T>(raw: unknown): PagedResult<T> {
  const r = raw as BackendPagedResult<T>;
  return {
    data:        r.items      ?? [],
    total:       r.totalCount ?? 0,
    page:        r.page       ?? 1,
    page_size:   r.pageSize   ?? 10,
    total_pages: r.totalPages ?? 1,
  };
}
