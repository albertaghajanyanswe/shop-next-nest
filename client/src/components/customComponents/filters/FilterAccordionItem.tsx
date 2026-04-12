import { Checkbox } from '@/components/ui/Checkbox';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { ResetFilterButton } from './ResetFilterButton';
import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/commons/useDebounce';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/formElements/Input';

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
          className='absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-shop-muted-text-6'
        >
          <X className='h-4 w-4' />
        </button>
      )}
    </div>
  );
}

interface FilterItem {
  id: string;
  name?: string;
  title?: string;
}

interface FilterAccordionItemProps<T extends FilterItem> {
  title: string;
  value: string;
  items: T[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onReset: () => void;
  searchPlaceholder?: string;
  maxHeight?: string;
}

export function FilterAccordionItem<T extends FilterItem>({
  title,
  value,
  items,
  selectedIds,
  onToggle,
  onReset,
  searchPlaceholder = `Search ${title.toLowerCase()}...`,
  maxHeight = 'max-h-[250px]',
}: FilterAccordionItemProps<T>) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filterItems = (itemsList: T[], searchText: string) => {
    return itemsList.filter((item) => {
      const text = (item.name || item.title || '').toLowerCase();
      return text.includes(searchText.toLowerCase());
    });
  };

  const filteredItems = useMemo(
    () => filterItems(items, debouncedSearch),
    [items, debouncedSearch]
  );

  if (!items?.length) return null;

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className='text-md cursor-pointer p-2 text-left font-medium hover:no-underline md:text-lg'>
        {title}
      </AccordionTrigger>
      <AccordionContent className='space-y-2 pt-0'>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder}
        />
        <ResetFilterButton
          filterKey={value}
          resetFilter={onReset}
          selectedCount={selectedIds.length}
        />
        <div
          className={`thin-scrollbar flex ${maxHeight} flex-col gap-y-1 overflow-y-auto pr-2`}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <label key={item.id} className='flex items-center gap-2'>
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => onToggle(item.id)}
                />
                {item.name || item.title}
              </label>
            ))
          ) : (
            <p className='py-2 text-sm text-neutral-500'>No results found</p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
