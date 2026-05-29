interface PaginationProps {
  page:        number;
  total_pages: number;
  total:       number;
  page_size:   number;
  onPage:      (page: number) => void;
}

function PageButton({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex h-8 items-center rounded-lg px-3 text-[13px] font-medium transition-all duration-150',
        'border border-black/[0.1] bg-white text-[#1d1d1f]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        'hover:bg-[#f5f5f7] active:scale-[0.97]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export function Pagination({ page, total_pages, total, page_size, onPage }: PaginationProps) {
  if (total_pages <= 1) return null;

  const from = (page - 1) * page_size + 1;
  const to   = Math.min(page * page_size, total);

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-[13px] text-[#6e6e73]">
        <span className="font-medium text-[#1d1d1f]">{from}–{to}</span>{' '}
        de <span className="font-medium text-[#1d1d1f]">{total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <PageButton disabled={page <= 1} onClick={() => onPage(page - 1)}>
          ← Anterior
        </PageButton>
        <span className="px-2 text-[13px] text-[#6e6e73]">
          {page} / {total_pages}
        </span>
        <PageButton disabled={page >= total_pages} onClick={() => onPage(page + 1)}>
          Siguiente →
        </PageButton>
      </div>
    </div>
  );
}
