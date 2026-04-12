'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import {
  GetBrandDto,
  GetCategoryDto,
  GetStoreDto,
} from '@/generated/orval/types';
import FiltersContent from './FiltersContent';
import { Heading } from '@/components/ui/Heading';
import { X } from 'lucide-react';
import { useState } from 'react';
import { iFilter } from '@/shared/types/filter.interface';

interface FilterProps {
  stores?: GetStoreDto[];
  categories?: GetCategoryDto[];
  brands?: GetBrandDto[];
}

export default function Filters({ categories, brands, stores }: FilterProps) {
  const { queryParams, changeFilterObject } = useQueryParams({
    pageDefaultParams: {
      params: {
        sort: { field: 'createdAt', order: 'desc' },
        filter: { storeId: [], categoryId: [], brandId: [] },
        limit: 10,
        skip: 0,
        search: {
          value: '',
          fields: ['title', 'description'],
        },
      },
    },
  });

  // const currentFilter = queryParams.params.filter ?? {};
  const [currentFilter, setCurrentFilter] = useState<iFilter>(
    queryParams.params.filter ?? {}
  );

  const toggleFilter = (field: string, value: string) => {
    const arr = new Set(currentFilter[field] ?? []);
    if (arr.has(value)) {
      arr.delete(value);
    } else {
      arr.add(value);
    }
    const updatedFilter = {
      ...currentFilter,
      [field]: Array.from(arr),
    };
    setCurrentFilter(updatedFilter);
    changeFilterObject(updatedFilter);
  };

  const updatePrice = (values: number[]) => {
    const updatedFilter = {
      ...currentFilter,
      ...(values[0] !== undefined && { price_gte: +values[0] }),
      ...(values[1] !== undefined && { price_lte: +values[1] }),
    };
    setCurrentFilter(updatedFilter);
    changeFilterObject(updatedFilter);
  };

  const resetFilter = (field: string) => {
    const updated = { ...currentFilter };

    switch (field) {
      case 'categoryId':
        updated.categoryId = [];
        break;
      case 'brandId':
        updated.brandId = [];
        break;
      case 'storeId':
        updated.storeId = [];
        break;
      case 'price':
        updated.price_gte = undefined;
        updated.price_lte = undefined;
        break;
    }
    setCurrentFilter(updated);
    changeFilterObject(updated);
  };

  return (
    <>
      {/* MOBILE BUTTON */}
      <div className='mb-4 md:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              className='icon-btn hoverEffect group relative w-full justify-center'
            >
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side='left'
            className='bg-shop-white flex max-h-[100dvh] w-80 flex-col overflow-y-auto p-4 pt-0'
          >
            <SheetHeader className='bg-shop-white/95 sticky top-0 z-20 flex w-full flex-row items-center justify-between border-b p-0 pb-4 backdrop-blur-sm'>
              <SheetTitle className='p-0'>
                <Heading
                  title='Filters'
                  className='text-xl'
                  showBackButton={false}
                />
              </SheetTitle>
              <div className='flex items-center gap-2'>
                <SheetClose asChild>
                  <Button variant='ghost' size='icon' aria-label='Close'>
                    <X className='h-4 w-4' />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>

            <FiltersContent
              categories={categories}
              brands={brands}
              stores={stores}
              currentFilter={currentFilter}
              toggleFilter={toggleFilter}
              updatePrice={updatePrice}
              resetFilter={resetFilter}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className='bg-shop-light-bg hidden h-max rounded-md p-4 pb-8 md:block'>
        <FiltersContent
          categories={categories}
          brands={brands}
          stores={stores}
          currentFilter={currentFilter}
          toggleFilter={toggleFilter}
          updatePrice={updatePrice}
          resetFilter={resetFilter}
        />
      </div>
    </>
  );
}
