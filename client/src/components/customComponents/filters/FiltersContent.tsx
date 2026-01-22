import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import {
  GetBrandDto,
  GetCategoryDto,
  GetStoreDto,
} from '@/generated/orval/types';
import { iFilter } from '@/shared/types/filter.interface';
import { PriceFilter } from './PriceFilter';
import { FilterAccordionItem } from './FilterAccordionItem';
import { useState, useEffect } from 'react';

interface FilterContentProps {
  stores?: GetStoreDto[];
  categories?: GetCategoryDto[];
  brands?: GetBrandDto[];
  currentFilter: iFilter;
  toggleFilter: (field: string, value: string) => void;
  updatePrice: (values: number[]) => void;
  resetFilter: (field: string) => void;
}

export default function FiltersContent({
  categories,
  brands,
  stores,
  currentFilter,
  toggleFilter,
  updatePrice,
  resetFilter,
}: FilterContentProps) {
  // Local states for instant display of checkboxes
  const [localCategoryIds, setLocalCategoryIds] = useState<string[]>(
    currentFilter.categoryId ?? []
  );
  const [localBrandIds, setLocalBrandIds] = useState<string[]>(
    currentFilter.brandId ?? []
  );
  const [localStoreIds, setLocalStoreIds] = useState<string[]>(
    currentFilter.storeId ?? []
  );

  // Synchronize the local state with the global filter when it changes
  useEffect(
    () => setLocalCategoryIds(currentFilter.categoryId ?? []),
    [currentFilter.categoryId]
  );
  useEffect(
    () => setLocalBrandIds(currentFilter.brandId ?? []),
    [currentFilter.brandId]
  );
  useEffect(
    () => setLocalStoreIds(currentFilter.storeId ?? []),
    [currentFilter.storeId]
  );

  // Handler for toggling filters
  const handleToggleCategory = (id: string) => {
    const newState = localCategoryIds.includes(id)
      ? localCategoryIds.filter((cid) => cid !== id)
      : [...localCategoryIds, id];
    setLocalCategoryIds(newState);
    toggleFilter('categoryId', id);
  };

  const handleToggleBrand = (id: string) => {
    const newState = localBrandIds.includes(id)
      ? localBrandIds.filter((bid) => bid !== id)
      : [...localBrandIds, id];
    setLocalBrandIds(newState);
    toggleFilter('brandId', id);
  };

  const handleToggleStore = (id: string) => {
    const newState = localStoreIds.includes(id)
      ? localStoreIds.filter((sid) => sid !== id)
      : [...localStoreIds, id];
    setLocalStoreIds(newState);
    toggleFilter('storeId', id);
  };

  const handleResetCategories = () => {
    setLocalCategoryIds([]);
    resetFilter('categoryId');
  };

  const handleResetBrands = () => {
    setLocalBrandIds([]);
    resetFilter('brandId');
  };

  const handleResetStores = () => {
    setLocalStoreIds([]);
    resetFilter('storeId');
  };

  return (
    <div className='space-y-6'>
      <Accordion
        type='multiple'
        defaultValue={['categories', 'brands', 'stores', 'price']}
        className='w-full'
      >
        {/* CATEGORIES */}
        <FilterAccordionItem
          title='Categories'
          value='categories'
          items={categories || []}
          selectedIds={localCategoryIds}
          onToggle={handleToggleCategory}
          onReset={handleResetCategories}
          searchPlaceholder='Search categories...'
        />

        {/* BRANDS */}
        <FilterAccordionItem
          title='Brands'
          value='brands'
          items={brands || []}
          selectedIds={localBrandIds}
          onToggle={handleToggleBrand}
          onReset={handleResetBrands}
          searchPlaceholder='Search brands...'
        />

        {/* STORES */}
        <FilterAccordionItem
          title='Stores'
          value='stores'
          items={stores || []}
          selectedIds={localStoreIds}
          onToggle={handleToggleStore}
          onReset={handleResetStores}
          searchPlaceholder='Search stores...'
        />

        {/* PRICE */}
        <AccordionItem value='price'>
          <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
            Price
          </AccordionTrigger>
          <AccordionContent className='px-2 pt-4'>
            <PriceFilter
              onChange={(range) => updatePrice([range.min, range.max])}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
