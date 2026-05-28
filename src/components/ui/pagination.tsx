import { Button } from './button';

interface PaginationProps {
  page: number;
  total_pages: number;
  total: number;
  page_size: number;
  onPage: (page: number) => void;
}

export function Pagination({ page, total_pages, total, page_size, onPage }: PaginationProps) {
  if (total_pages <= 1) return null;

  const from = (page - 1) * page_size + 1;
  const to   = Math.min(page * page_size, total);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
      <p className="text-sm text-gray-500">
        Mostrando <span className="font-medium">{from}–{to}</span> de{' '}
        <span className="font-medium">{total}</span> resultados
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Anterior
        </Button>
        <span className="text-sm text-gray-600">
          {page} / {total_pages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= total_pages}
          onClick={() => onPage(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
