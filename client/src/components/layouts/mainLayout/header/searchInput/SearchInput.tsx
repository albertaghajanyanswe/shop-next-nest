'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/formElements/Input';
import { PUBLIC_URL } from '@/config/url.config';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function SearchInput() {
  const pathname = usePathname();
  const { queryParams, setFilteredParams, setFilteredParamsWithPush } =
    useQueryParams({});
  const [searchTerm, setSearchTerm] = useState(
    queryParams?.params?.search?.value ?? ''
  );
  const handleSearch = () => {
    const newFilter = {
      params: {
        ...(queryParams?.params ? queryParams.params : {}),
        search: {
          ...(queryParams?.params?.search
            ? queryParams?.params?.search
            : { fields: ['title', 'description'] }),
          value: searchTerm,
        },
        skip: 0,
      },
    };
    if (pathname === PUBLIC_URL.shop()) {
      setFilteredParams(newFilter);
      return;
    }
    setFilteredParamsWithPush(newFilter, PUBLIC_URL.shop());
  };
  return (
    <div className='relative flex w-full items-center'>
      <Input
        placeholder='Search products...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='rounded-lg rounded-r-none pr-8 focus-visible:ring-transparent'
      />
      <Button
        aria-label='Search products'
        className='rounded-l-none'
        variant='primary'
        onClick={handleSearch}
      >
        <Search className='size-4' />
      </Button>
    </div>
  );
}
