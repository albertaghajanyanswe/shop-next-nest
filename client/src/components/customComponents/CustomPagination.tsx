'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/Pagination';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/Select';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface CustomPaginationProps {
  total: number;
  limit: number;
  skip: number;
  onPageChange: (p: number) => void;
  onLimitChange: (limit: number) => void;
}

function PageButtons({
  page,
  totalPages,
  siblings,
  getHrefForPage,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  siblings: number;
  getHrefForPage: (p: number) => string;
  onPageChange: (p: number) => void;
}) {
  const getPages = (
    currentPage: number,
    totalPages: number,
    siblings: number
  ) => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - siblings);
    const end = Math.min(totalPages, currentPage + siblings);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      {page > siblings + 1 && (
        <>
          <PaginationItem>
            <PaginationLink
              href={getHrefForPage(1)}
              className='h-10 w-10 rounded-full font-semibold'
            >
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis
              className='h-10 w-10 cursor-pointer rounded-full font-semibold'
              onClick={() => onPageChange(Math.max(1, page - 3))}
            />
          </PaginationItem>
        </>
      )}

      {getPages(page, totalPages, siblings).map((p) => (
        <PaginationItem key={p}>
          <PaginationLink
            className='h-10 w-10 rounded-full font-semibold'
            isActive={p === page}
            href={getHrefForPage(p)}
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      ))}

      {page < totalPages - siblings && (
        <>
          <PaginationItem>
            <PaginationEllipsis
              className='h-10 w-10 cursor-pointer rounded-full font-semibold'
              onClick={() => onPageChange(Math.min(totalPages, page + 3))}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href={getHrefForPage(totalPages)}
              className='h-10 w-10 rounded-full font-semibold'
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </>
      )}
    </>
  );
}

export function CustomPagination({
  total,
  limit,
  skip,
  onPageChange,
  onLimitChange,
}: CustomPaginationProps) {
  const t = useTranslations('CustomPagination');
  const page = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handleLimitChange = (value: string) => {
    const newLimit = Number(value);
    onLimitChange(newLimit);
  };

  const siblings = 4;

  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());

  const getHrefForPage = (p: number) => {
    const params = new URLSearchParams(currentParams.toString());
    const newSkip = (p - 1) * limit;

    params.set('skip', String(newSkip));
    params.set('limit', String(limit));
    return `?${params.toString()}`;
  };

  return (
    <div className='mt-4 flex flex-col items-center justify-between gap-4 md:flex-row'>
      <Pagination>
        <PaginationContent className='m-[0px] flex flex-wrap justify-center md:justify-start'>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                className='h-10 w-10 rounded-full font-semibold'
                size='default'
                // onClick={() => page > 1 && onPageChange(page - 1)}
                {...(page > 1 && { href: getHrefForPage(page - 1) })}
              />
            </PaginationItem>
          )}

          <PageButtons
            page={page}
            totalPages={totalPages}
            siblings={siblings}
            getHrefForPage={getHrefForPage}
            onPageChange={onPageChange}
          />

          {page < totalPages && (
            <PaginationItem>
              <PaginationNext
                className='h-10 w-10 rounded-full font-semibold'
                size='default'
                // onClick={() => page < totalPages && onPageChange(page + 1)}
                {...(page < totalPages && { href: getHrefForPage(page + 1) })}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      {/* Items per page */}
      <div className='text-muted-foreground flex items-center gap-2 text-sm whitespace-nowrap'>
        <span>{t('items_per_page')}</span>

        <Select value={String(limit)} onValueChange={handleLimitChange}>
          <SelectTrigger className='w-20' aria-label={t('items_per_page')}>
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 10, 20, 30, 40, 50, 100, 200].map((num) => (
              <SelectItem key={num} value={String(num)}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
