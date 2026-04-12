'use client';
import { CreateStoreModal } from '@/components/modals/CreateStoreModal';
import { Button } from '@/components/ui/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { STORE_URL } from '@/config/url.config';
import { GetStoreDto } from '@/generated/orval/types';
import { useProfile } from '@/hooks/useProfile';
import { ChevronsUpDown, Plus, StoreIcon, Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface StoreSwitcherProps {
  items: GetStoreDto[];
}

export function StoreSwitcher({ items }: StoreSwitcherProps) {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();
  const { user, isLoading: isLoadingUser, canCreateStore } = useProfile();
  const t = useTranslations('StoreSwitcher');

  const [isOpen, setIsOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState<GetStoreDto | null>(
    items.find((item) => item.id === params.storeId) || null
  );

  const onStoreSelect = (store: GetStoreDto) => {
    setIsOpen(false);
    setCurrentStore(store);
    router.push(STORE_URL.home(store.id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          role='combobox'
          aria-expanded={isOpen}
          aria-label={t('select_store')}
          className='w-fit cursor-pointer'
        >
          <StoreIcon className='mr-2 size-4' />
          {currentStore?.title || t('current_store')}
          <ChevronsUpDown className='ml-auto size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder={t('search_store')} />
            <CommandEmpty>{t('no_store_found')}</CommandEmpty>
            <CommandGroup heading={t('stores')}>
              <div className='flex flex-col gap-1'>
                {items.map((store) => (
                  <CommandItem
                    key={store.id}
                    onSelect={() => onStoreSelect(store)}
                    className={`cursor-pointer text-sm ${
                      currentStore?.id === store.id
                        ? 'bg-accent text-shop-primary-text'
                        : ''
                    }`}
                  >
                    <div className='flex w-full items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <StoreIcon className='size-4 flex-shrink-0' />
                        <div className='line-clamp-1'>{store.title}</div>
                      </div>
                      {currentStore?.id === store.id && (
                        <Check className='text-shop-light-primary h-3 w-3' />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              {/* <CreateStoreModal disabledTrigger={!canCreateStore}> */}
              <CreateStoreModal setCurrentStore={setCurrentStore}>
                <CommandItem
                  // disabled={!canCreateStore}
                  className='cursor-pointer text-sm'
                >
                  <Plus className='mr-2 size-4' />
                  {t('create_store')}
                </CommandItem>
              </CreateStoreModal>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
