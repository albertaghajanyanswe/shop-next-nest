import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/formElements/Input';
import {
  GetBrandDto,
  GetCategoryDto,
  GetStoreDto,
} from '@/generated/orval/types';
import { iFilter } from '@/shared/types/filter.interface';
import { PriceFilter } from './PriceFilter';
import { ResetFilterButton } from './ResetFilterButton';
import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/commons/useDebounce';

interface FilterContentProps {
  stores?: GetStoreDto[];
  categories?: GetCategoryDto[];
  brands?: GetBrandDto[];
  currentFilter: iFilter;
  toggleFilter: (field: string, value: string) => void;
  updatePrice: (values: number[]) => void;
  resetFilter: (field: string) => void;
}

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  return (
    <div className='relative mb-3'>
      <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400' />

      <Input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='h-9 pr-9 pl-9'
      />

      {value && (
        <button
          type='button'
          onClick={() => onChange('')}
          className='absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600'
        >
          <X className='h-4 w-4' />
        </button>
      )}
    </div>
  );
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

  // Search states
  const [categorySearch, setCategorySearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');

  // Debounced search values
  const debouncedCategorySearch = useDebounce(categorySearch, 300);
  const debouncedBrandSearch = useDebounce(brandSearch, 300);
  const debouncedStoreSearch = useDebounce(storeSearch, 300);

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

  // Handler for instant updating of local state and global filter
  const handleToggle = (
    field: 'categoryId' | 'brandId' | 'storeId',
    value: string
  ) => {
    let localState: string[] = [];
    let setLocal: (ids: string[]) => void = () => {};

    if (field === 'categoryId') {
      localState = localCategoryIds;
      setLocal = setLocalCategoryIds;
    }
    if (field === 'brandId') {
      localState = localBrandIds;
      setLocal = setLocalBrandIds;
    }
    if (field === 'storeId') {
      localState = localStoreIds;
      setLocal = setLocalStoreIds;
    }

    const newState = localState.includes(value)
      ? localState.filter((id) => id !== value)
      : [...localState, value];

    setLocal(newState);
    toggleFilter(field, value);
  };

  // Filter functions
  const filterItems = <T extends { name?: string; title?: string }>(
    items: T[],
    searchText: string
  ) => {
    return items.filter((item) => {
      const text = (item.name || item.title || '').toLowerCase();
      return text.includes(searchText.toLowerCase());
    });
  };

  const filteredCategories = useMemo(
    () => filterItems(categories || [], debouncedCategorySearch),
    [categories, debouncedCategorySearch]
  );

  const filteredBrands = useMemo(
    () => filterItems(brands || [], debouncedBrandSearch),
    [brands, debouncedBrandSearch]
  );

  const filteredStores = useMemo(
    () => filterItems(stores || [], debouncedStoreSearch),
    [stores, debouncedStoreSearch]
  );

  return (
    <div className='space-y-6'>
      <Accordion
        type='multiple'
        defaultValue={['categories', 'brands', 'stores', 'price']}
        className='w-full'
      >
        {/* CATEGORIES */}
        {!!categories?.length && (
          <AccordionItem value='categories'>
            <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
              Categories
            </AccordionTrigger>
            <AccordionContent className='space-y-2 pt-0'>
              <SearchInput
                value={categorySearch}
                onChange={setCategorySearch}
                placeholder='Search categories...'
              />
              <ResetFilterButton
                filterKey='categoryId'
                resetFilter={resetFilter}
                selectedCount={localCategoryIds.length}
              />
              <div className='thin-scrollbar flex max-h-[250px] flex-col gap-y-1 overflow-y-auto pr-2'>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((c) => (
                    <label key={c.id} className='flex items-center gap-2'>
                      <Checkbox
                        checked={localCategoryIds.includes(c.id)}
                        onCheckedChange={() => handleToggle('categoryId', c.id)}
                      />
                      {c.name}
                    </label>
                  ))
                ) : (
                  <p className='py-2 text-sm text-neutral-500'>
                    No results found
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* BRANDS */}
        {!!brands?.length && (
          <AccordionItem value='brands'>
            <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
              Brands
            </AccordionTrigger>
            <AccordionContent className='space-y-2 pt-0'>
              <SearchInput
                value={brandSearch}
                onChange={setBrandSearch}
                placeholder='Search brands...'
              />
              <ResetFilterButton
                filterKey='brandId'
                resetFilter={resetFilter}
                selectedCount={localBrandIds.length}
              />
              <div className='thin-scrollbar flex max-h-[250px] flex-col gap-y-1 overflow-y-auto pr-2'>
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((b) => (
                    <label key={b.id} className='flex items-center gap-2'>
                      <Checkbox
                        checked={localBrandIds.includes(b.id)}
                        onCheckedChange={() => handleToggle('brandId', b.id)}
                      />
                      {b.name}
                    </label>
                  ))
                ) : (
                  <p className='py-2 text-sm text-neutral-500'>
                    No results found
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* STORES */}
        {!!stores?.length && (
          <AccordionItem value='stores'>
            <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
              Stores
            </AccordionTrigger>
            <AccordionContent className='space-y-2 pt-0'>
              <SearchInput
                value={storeSearch}
                onChange={setStoreSearch}
                placeholder='Search stores...'
              />
              <ResetFilterButton
                filterKey='storeId'
                resetFilter={resetFilter}
                selectedCount={localStoreIds.length}
              />
              <div className='thin-scrollbar flex max-h-[250px] flex-col gap-y-1 overflow-y-auto pr-2'>
                {filteredStores.length > 0 ? (
                  filteredStores.map((s) => (
                    <label key={s.id} className='flex items-center gap-2'>
                      <Checkbox
                        checked={localStoreIds.includes(s.id)}
                        onCheckedChange={() => handleToggle('storeId', s.id)}
                      />
                      {s.title}
                    </label>
                  ))
                ) : (
                  <p className='py-2 text-sm text-neutral-500'>
                    No results found
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

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
