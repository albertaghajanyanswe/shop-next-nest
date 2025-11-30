import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/Breadcrumb';
import React from 'react';

export default function Breadcrumbs({
  items,
  classNames = '',
}: {
  items: { title: string; href?: string }[];
  classNames?: string;
}) {
  return (
    <Breadcrumb className={`${classNames}`}>
      <BreadcrumbList>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <React.Fragment key={item.title + i}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className='transition-colors hover:text-black'
                    >
                      {item.title}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <span aria-current='page' className='font-medium text-black'>
                    {item.title}
                  </span>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>

    // <nav aria-label='Breadcrumb' className='mb-6 text-sm text-gray-500'>
    //   <ol className='flex items-center gap-1'>
    //     {items.map((item, i) => (
    //       <li key={i} className='flex items-center gap-1'>
    //         {item.href ? (
    //           <Link href={item.href} className='hover:text-black'>
    //             {item.title}
    //           </Link>
    //         ) : (
    //           <span aria-current='page' className='font-medium text-black'>
    //             {item.title}
    //           </span>
    //         )}
    //         {i !== items.length - 1 && <span>/</span>}
    //       </li>
    //     ))}
    //   </ol>
    // </nav>
  );
}
