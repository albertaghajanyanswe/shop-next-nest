import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import {
  GetBrandDto,
  GetCategoryDto,
  GetProductWithDetailsIntendedFor,
  GetStoreDto,
} from '@/generated/orval/types';
import { iFilter } from '@/shared/types/filter.interface';
import { PriceFilter } from './PriceFilter';
import { FilterAccordionItem } from './FilterAccordionItem';
import { useState, useEffect } from 'react';
import { capitalizeFirstLetter } from '@/utils/common';
import { useTranslations } from 'next-intl';

interface FilterContentProps {
  stores?: GetStoreDto[];
  categories?: GetCategoryDto[];
  brands?: GetBrandDto[];
  currentFilter: iFilter;
  toggleFilter: (field: string, value: string) => void;
  updatePrice: (values: number[]) => void;
  resetFilter: (field: string) => void;
}

const INTENDED_FOR_OPTIONS = Object.values(
  GetProductWithDetailsIntendedFor
).map((value) => ({
  id: value,
  name: capitalizeFirstLetter(value),
}));

export default function FiltersContent({
  categories,
  brands,
  stores,
  currentFilter,
  toggleFilter,
  updatePrice,
  resetFilter,
}: FilterContentProps) {
  const t = useTranslations('Filters');
  
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

  const [localIntendedForIds, setLocalIntendedForIds] = useState<string[]>(
    currentFilter.intendedFor ?? []
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
  useEffect(
    () => setLocalIntendedForIds(currentFilter.intendedFor ?? []),
    [currentFilter.intendedFor]
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

  const handleToggleIntendedFor = (id: string) => {
    const newState = localIntendedForIds.includes(id)
      ? localIntendedForIds.filter((sid) => sid !== id)
      : [...localIntendedForIds, id];
    setLocalIntendedForIds(newState);
    toggleFilter('intendedFor', id);
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

  const handleResetIntendedFor = () => {
    setLocalIntendedForIds([]);
    resetFilter('intendedFor');
  };

  return (
    <div className='space-y-6'>
      <Accordion
        type='multiple'
        defaultValue={[
          'intendedFor',
          'categories',
          'brands',
          'stores',
          'price',
        ]}
        className='w-full'
      >
        {/* INTENDED FOR */}
        <FilterAccordionItem
          title={t('intended_for')}
          value='intendedFor'
          items={INTENDED_FOR_OPTIONS || []}
          selectedIds={localIntendedForIds}
          onToggle={handleToggleIntendedFor}
          onReset={handleResetIntendedFor}
          searchPlaceholder={t('search_intended_for')}
        />
        {/* CATEGORIES */}
        <FilterAccordionItem
          title={t('categories')}
          value='categories'
          items={categories || []}
          selectedIds={localCategoryIds}
          onToggle={handleToggleCategory}
          onReset={handleResetCategories}
          searchPlaceholder={t('search_categories')}
        />

        {/* BRANDS */}
        <FilterAccordionItem
          title={t('brands')}
          value='brands'
          items={brands || []}
          selectedIds={localBrandIds}
          onToggle={handleToggleBrand}
          onReset={handleResetBrands}
          searchPlaceholder={t('search_brands')}
        />

        {/* STORES */}
        <FilterAccordionItem
          title={t('stores')}
          value='stores'
          items={stores || []}
          selectedIds={localStoreIds}
          onToggle={handleToggleStore}
          onReset={handleResetStores}
          searchPlaceholder={t('search_stores')}
        />

        {/* PRICE */}
        <AccordionItem value='price'>
          <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
            {t('price')}
          </AccordionTrigger>
          <AccordionContent className='px-2 pt-4'>
            <PriceFilter
              min={currentFilter?.price_gte}
              max={currentFilter?.price_lte}
              onChange={(range) => updatePrice([range.min, range.max])}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
