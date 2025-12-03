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
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface CustomPaginationProps {
  total: number;
  limit: number;
  skip: number;
  onPageChange: (p: number) => void;
  onLimitChange: (limit: number) => void;
}

export function CustomPagination({
  total,
  limit,
  skip,
  onPageChange,
  onLimitChange,
}: CustomPaginationProps) {
  const page = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handleLimitChange = (value: string) => {
    const newLimit = Number(value);
    onLimitChange(newLimit);
  };

  const siblings = 2;

  const pages = [];

  for (
    let i = Math.max(1, page - siblings);
    i <= Math.min(totalPages, page + siblings);
    i++
  ) {
    pages.push(i);
  }

  // console.log('\n\n PAGINATION')
  // console.log('total ', total)
  // console.log('skip ', skip)
  // console.log('limit ', limit)
  // console.log('PAGES = ', pages)
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());
  const getHrefForPage = (p: number) => {
    const params = new URLSearchParams(currentParams.toString());
    const newSkip = (p - 1) * limit; // <<<<<< ВСЁ!

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
                href={getHrefForPage(page - 1)}
                {...(page > 1 && { href: getHrefForPage(page - 1) })}
              />
            </PaginationItem>
          )}

          {/* 1 */}
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
                  // href={getHrefForPage(Math.max(1, page - 3))}
                  onClick={() => onPageChange(Math.max(1, page - 3))}
                />
              </PaginationItem>
            </>
          )}

          {/* центральные страницы */}
          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                className='h-10 w-10 rounded-full font-semibold'
                isActive={p === page}
                href={getHrefForPage(p)}
                // onClick={() => onPageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* последний */}
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
                  // onClick={() => onPageChange(totalPages)}
                  href={getHrefForPage(totalPages)}
                  className='h-10 w-10 rounded-full font-semibold'
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {page < totalPages && (
            <PaginationItem>
              <PaginationNext
                className='h-10 w-10 rounded-full font-semibold'
                size='default'
                {...(page < totalPages && { href: getHrefForPage(page + 1) })}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      {/* Items per page */}
      <div className='text-muted-foreground flex items-center gap-2 text-sm whitespace-nowrap'>
        <span>Items per page:</span>

        <Select value={String(limit)} onValueChange={handleLimitChange}>
          <SelectTrigger className='w-20' aria-label='Items per page'>
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 10, 20, 30, 50, 100].map((num) => (
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

// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationNext,
//   PaginationPrevious,
//   PaginationLink,
//   PaginationEllipsis,
// } from '@/components/ui/Pagination';
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/components/ui/Select';

// interface CustomPaginationProps {
//   total: number;
//   limit: number;
//   skip: number;
//   onPageChange: (p: number) => void;
//   onLimitChange: (limit: number) => void;
// }

// export function CustomPagination({
//   total,
//   limit,
//   skip,
//   onPageChange,
//   onLimitChange,
// }: CustomPaginationProps) {
//   const page = Math.floor(skip / limit) + 1;
//   const totalPages = Math.ceil(total / limit);

//   const handleLimitChange = (value: string) => {
//     const newLimit = Number(value);
//     onLimitChange(newLimit);
//   };

//   const siblings = 2;

//   const pages = [];

//   for (
//     let i = Math.max(1, page - siblings);
//     i <= Math.min(totalPages, page + siblings);
//     i++
//   ) {
//     pages.push(i);
//   }

//   // console.log('\n\n PAGINATION')
//   // console.log('total ', total)
//   // console.log('skip ', skip)
//   // console.log('limit ', limit)
//   // console.log('PAGES = ', pages)
//   return (
//     <div className='mt-4 flex flex-col items-center justify-between gap-4 md:flex-row'>
//       <Pagination>
//         <PaginationContent className='m-[0px] flex flex-wrap justify-center md:justify-start'>
//           <PaginationItem>
//             <PaginationPrevious
//               className='h-10 w-10 rounded-full font-semibold'
//               size='default'
//               onClick={() => page > 1 && onPageChange(page - 1)}
//             />
//           </PaginationItem>

//           {/* 1 */}
//           {page > siblings + 1 && (
//             <>
//               <PaginationItem>
//                 <PaginationLink
//                   onClick={() => onPageChange(1)}
//                   className='h-10 w-10 rounded-full font-semibold'
//                 >
//                   1
//                 </PaginationLink>
//               </PaginationItem>

//               <PaginationItem>
//                 <PaginationEllipsis
//                   className='h-10 w-10 cursor-pointer rounded-full font-semibold'
//                   onClick={() => onPageChange(Math.max(1, page - 3))}
//                 />
//               </PaginationItem>
//             </>
//           )}

//           {/* центральные страницы */}
//           {pages.map((p) => (
//             <PaginationItem key={p}>
//               <PaginationLink
//                 className='h-10 w-10 rounded-full font-semibold'
//                 isActive={p === page}
//                 onClick={() => onPageChange(p)}
//               >
//                 {p}
//               </PaginationLink>
//             </PaginationItem>
//           ))}

//           {/* последний */}
//           {page < totalPages - siblings && (
//             <>
//               <PaginationItem>
//                 <PaginationEllipsis
//                   className='h-10 w-10 cursor-pointer rounded-full font-semibold'
//                   onClick={() => onPageChange(Math.min(totalPages, page + 3))}
//                 />
//               </PaginationItem>

//               <PaginationItem>
//                 <PaginationLink
//                   onClick={() => onPageChange(totalPages)}
//                   className='h-10 w-10 rounded-full font-semibold'
//                 >
//                   {totalPages}
//                 </PaginationLink>
//               </PaginationItem>
//             </>
//           )}

//           <PaginationItem>
//             <PaginationNext
//               className='h-10 w-10 rounded-full font-semibold'
//               size='default'
//               onClick={() => page < totalPages && onPageChange(page + 1)}
//             />
//           </PaginationItem>
//         </PaginationContent>
//       </Pagination>

//       {/* Items per page */}
//       <div className='text-muted-foreground flex items-center gap-2 text-sm whitespace-nowrap'>
//         <span>Items per page:</span>

//         <Select value={String(limit)} onValueChange={handleLimitChange}>
//           <SelectTrigger className='w-20'>
//             <SelectValue placeholder={limit} />
//           </SelectTrigger>
//           <SelectContent>
//             {[1, 2, 10, 20, 30, 50, 100].map((num) => (
//               <SelectItem key={num} value={String(num)}>
//                 {num}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   );
// }
