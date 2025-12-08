import React from 'react';
import Image from 'next/image';
import {
  ImageItemConfig,
  TableSectionColumn,
  TableSectionItem,
} from './OrderDetailsModal';

interface GenericTableProps<T extends TableSectionItem> {
  columns: TableSectionColumn[];
  items: T[];
  renderCell?: (item: T, column: TableSectionColumn) => React.ReactNode;
  className?: string;
}

function DefaultCellRenderer<T extends TableSectionItem>(
  item: T,
  column: TableSectionColumn
): React.ReactNode {
  const value = item[column.key];

  if (column.type === 'text') {
    return <span className='text-sm font-medium text-neutral-700'>{value}</span>;
  }

  if (column.type === 'image' && value) {
    const config = value as ImageItemConfig;
    return (
      <div className='flex flex-row items-center gap-3 sm:col-span-6'>
        <div className='relative h-15 w-15'>
          <Image
            src={config.src}
            alt={config.alt}
            width={config.width}
            height={config.height}
            {...(config.blurDataURL && {
              placeholder: 'blur',
              blurDataURL: config.blurDataURL,
            })}
            className='max-h-15 object-contain'
          />
        </div>
        <p className='text-sm text-neutral-700 font-medium'>{item.title}</p>
      </div>
    );
  }

  return <span className='text-sm'>{value}</span>;
}

export function ItemsTable<T extends TableSectionItem>({
  columns,
  items,
  renderCell = DefaultCellRenderer,
  className = '',
}: GenericTableProps<T>) {
  const gridCols = columns.reduce((sum, col) => sum + (col.span || 1), 0);

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`hidden grid-cols-${gridCols} gap-4 p-0 text-sm font-semibold text-neutral-700 sm:grid`}
      >
        {columns.map((col) => (
          <div key={col.key} className={`col-span-${col.span || 1} text-left`}>
            {col.title}
          </div>
        ))}
      </div>

      {/* Rows */}
      {items.map((item) => (
        <div
          key={item.id}
          className={`grid-cols-${gridCols} flex flex-col gap-4 rounded-lg border border-shop-light-green/70 p-2 sm:grid`}
        >
          {columns.map((col) => (
            <div
              key={`${item.id}-${col.key}`}
              className={`col-span-${col.span || 1} flex flex-row items-center justify-between ${
                col.type === 'text'
                  ? 'justify-between sm:justify-between'
                  : 'justify-between sm:justify-between'
              }`}
            >
              {/* Мобильный label */}
              <span className='text-sm font-semibold text-neutral-700 sm:hidden'>
                {col.title}
              </span>
              {renderCell(item, col)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
