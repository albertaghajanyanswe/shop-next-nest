import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  GetBrandDto,
  GetCategoryDto,
  GetStoreDto,
} from '@/generated/orval/types';
import { iFilter } from '@/shared/types/filter.interface';
import { PriceFilter } from './PriceFilter';
import { ResetFilterButton } from './ResetFilterButton';
import { useState, useEffect } from 'react';

interface FilterContentProps {
  stores?: GetStoreDto[];
  categories?: GetCategoryDto[];
  brands?: GetBrandDto[];
  currentFilter: iFilter;
  toggleFilter: (field: string, value: string) => void; // сразу обновляет глобальный filter
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

    setLocal(newState); // update local state
    toggleFilter(field, value); // update global filter
  };

  return (
    <div className='space-y-6'>
      <Accordion
        type='multiple'
        defaultValue={['categories', 'brands', 'stores', 'price']}
        className='w-full'
      >
        {/* CATEGORIES */}
        <AccordionItem value='categories'>
          <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
            Categories
          </AccordionTrigger>
          <AccordionContent className='space-y-2 pt-0'>
            <ResetFilterButton
              filterKey='categoryId'
              resetFilter={resetFilter}
              selectedCount={localCategoryIds.length}
            />
            <div className='thin-scrollbar flex max-h-[250px] flex-col gap-y-1 overflow-y-auto pr-2'>
              {categories?.map((c) => (
                <label key={c.id} className='flex items-center gap-2'>
                  <Checkbox
                    checked={localCategoryIds.includes(c.id)}
                    onCheckedChange={() => handleToggle('categoryId', c.id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* BRANDS */}
        <AccordionItem value='brands'>
          <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
            Brands
          </AccordionTrigger>
          <AccordionContent className='space-y-2 pt-0'>
            <ResetFilterButton
              filterKey='brandId'
              resetFilter={resetFilter}
              selectedCount={localBrandIds.length}
            />
            <div className='thin-scrollbar flex max-h-[250px] flex-col gap-y-1 overflow-y-auto pr-2'>
              {brands?.map((b) => (
                <label key={b.id} className='flex items-center gap-2'>
                  <Checkbox
                    checked={localBrandIds.includes(b.id)}
                    onCheckedChange={() => handleToggle('brandId', b.id)}
                  />
                  {b.name}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* STORES */}
        <AccordionItem value='stores'>
          <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
            Stores
          </AccordionTrigger>
          <AccordionContent className='space-y-2 pt-0'>
            <ResetFilterButton
              filterKey='storeId'
              resetFilter={resetFilter}
              selectedCount={localStoreIds.length}
            />
            <div className='thin-scrollbar flex max-h-[250px] flex-col gap-y-1 overflow-y-auto pr-2'>
              {stores?.map((s) => (
                <label key={s.id} className='flex items-center gap-2'>
                  <Checkbox
                    checked={localStoreIds.includes(s.id)}
                    onCheckedChange={() => handleToggle('storeId', s.id)}
                  />
                  {s.title}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

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

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/Accordion';
// import { Checkbox } from '@/components/ui/Checkbox';
// import {
//   GetBrandDto,
//   GetCategoryDto,
//   GetStoreDto,
// } from '@/generated/orval/types';
// import { iFilter } from '@/shared/types/filter.interface';
// import { PriceFilter } from './PriceFilter';
// import { ResetFilterButton } from './ResetFilterButton';

// interface FilterContentProps {
//   stores?: GetStoreDto[];
//   categories?: GetCategoryDto[];
//   brands?: GetBrandDto[];
//   currentFilter: iFilter;
//   toggleFilter: (field: string, value: string) => void;
//   updatePrice: (values: number[]) => void;
//   resetFilter: (field: string) => void;
// }
// export default function FiltersContent({
//   categories,
//   brands,
//   stores,
//   currentFilter,
//   toggleFilter,
//   updatePrice,
//   resetFilter,
// }: FilterContentProps) {
//   console.log('FiltersContent FILTER = ', currentFilter);
//   return (
//     <div className='space-y-6'>
//       <Accordion
//         type='multiple'
//         defaultValue={['categories', 'brands', 'stores', 'price']}
//         className='w-full'
//       >
//         {/* CATEGORIES */}
//         <AccordionItem value='categories'>
//           <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
//             Categories
//           </AccordionTrigger>
//           <AccordionContent className='space-y-2 pt-0'>
//             <ResetFilterButton
//               filterKey='categoryId'
//               resetFilter={resetFilter}
//               selectedCount={currentFilter?.categoryId?.length || 0}
//             />
//             <div className='thin-scrollbar flex max-h-[250px] flex-col gap-y-1 overflow-y-auto pr-2'>
//               {categories?.map((c) => {
//                 return (
//                   <label key={c.id} className='flex items-center gap-2'>
//                     <Checkbox
//                       checked={!!currentFilter.categoryId?.includes(c.id)}
//                       onCheckedChange={() => toggleFilter('categoryId', c.id)}
//                     />
//                     {c.name}
//                   </label>
//                 );
//               })}
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         {/* BRANDS */}
//         <AccordionItem value='brands'>
//           <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
//             Brands
//           </AccordionTrigger>
//           <AccordionContent className='space-y-2 pt-0'>
//             <ResetFilterButton
//               filterKey='brandId'
//               resetFilter={resetFilter}
//               selectedCount={currentFilter?.brandId?.length || 0}
//             />
//             <div className='thin-scrollbar flex max-h-[250px] flex-col gap-y-1 overflow-y-auto pr-2'>
//               {brands?.map((b) => (
//                 <label key={b.id} className='flex items-center gap-2'>
//                   <Checkbox
//                     checked={!!currentFilter.brandId?.includes(b.id)}
//                     onCheckedChange={() => toggleFilter('brandId', b.id)}
//                   />
//                   {b.name}
//                 </label>
//               ))}
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         {/* STORES */}
//         <AccordionItem value='stores'>
//           <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
//             Stores
//           </AccordionTrigger>
//           <AccordionContent className='space-y-2 pt-0'>
//             <ResetFilterButton
//               filterKey='storeId'
//               resetFilter={resetFilter}
//               selectedCount={currentFilter?.storeId?.length || 0}
//             />
//             <div className='thin-scrollbar flex max-h-[250px] flex-col gap-y-1 overflow-y-auto pr-2'>
//               {stores?.map((s) => (
//                 <label key={s.id} className='flex items-center gap-2'>
//                   <Checkbox
//                     checked={!!currentFilter.storeId?.includes(s.id)}
//                     onCheckedChange={() => toggleFilter('storeId', s.id)}
//                   />
//                   {s.title}
//                 </label>
//               ))}
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         {/* PRICE */}
//         {/* <AccordionItem value='price'>
//           <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
//             Price
//           </AccordionTrigger>
//           <AccordionContent className='px-2 pt-4'>
//             <Slider
//               defaultValue={[0, 2000]}
//               min={0}
//               max={2000}
//               step={10}
//               onValueChange={(val) => updatePrice(val)}
//             />
//             <div className='mt-2 text-sm'>
//               ${currentFilter.price_gte ?? 0} — $
//               {currentFilter.price_lte ?? 2000}
//             </div>
//           </AccordionContent>
//         </AccordionItem> */}

//         <AccordionItem value='price'>
//           <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
//             Price
//           </AccordionTrigger>

//           <AccordionContent className='px-2 pt-4'>
//             <PriceFilter
//               onChange={(range) => updatePrice([range.min, range.max])}
//             />
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   );
// }
