'use client';

import * as React from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/Popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/Command';
import { cn } from '@/utils/common';

export type ComboOption = {
  id: string;
  name: string;
};

interface ComboBoxProps {
  value?: string;
  onChange: (value: string | null) => void;
  options: ComboOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxVisibleOptions?: number;
  error?: string;
}

export function CustomComboBox({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled,
  className,
  maxVisibleOptions = 5,
  error = '',
}: ComboBoxProps) {
  console.log('ERROR = ', error);
  const [open, setOpen] = React.useState(false);

  const selectedName = options.find((o) => o.id === value)?.name;

  // Высота одного CommandItem (Radix + shadcn)
  const ITEM_HEIGHT = 36;
  const maxHeight = ITEM_HEIGHT * maxVisibleOptions;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant='outline'
          role='combobox'
          className={cn(
            'relative w-full justify-between pr-10 font-normal',
            !selectedName && 'text-muted-foreground',
            error && 'border-red-500',
            className
          )}
        >
          {selectedName || placeholder}
          <ChevronsUpDown className='absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Search...' className='h-9' />
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandList style={{ maxHeight }}>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.name.toLowerCase()}
                  onSelect={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                >
                  {opt.name}

                  {value === opt.id && <Check className='ml-auto h-4 w-4' />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          {/* Clear selection — ВСЕГДА НИЗ */}
          <div className='border-t'>
            <Button
            variant='ghost'
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className='text-shop-red hover:text-shop-red/80 w-full hover:bg-red-500/5'
            >
              <X className='h-4 w-4 text-red-500 hover:text-red-800' />
              Clear selection
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
