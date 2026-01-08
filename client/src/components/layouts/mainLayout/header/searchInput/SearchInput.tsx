'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/formElements/Input';
import { PUBLIC_URL } from '@/config/url.config';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  redirectToShop?: boolean;
  searchFields?: string[];
}
export function SearchInput({
  placeholder = 'Search products...',
  redirectToShop = true,
  searchFields = ['title', 'description'],
}: SearchInputProps) {
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
          fields: searchFields,
          value: searchTerm,
        },
        skip: 0,
      },
    };
    if (pathname === PUBLIC_URL.shop() || !redirectToShop) {
      setFilteredParams(newFilter);
      return;
    }
    setFilteredParamsWithPush(newFilter, PUBLIC_URL.shop());
  };
  return (
    <div className='relative flex w-full items-center'>
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='rounded-lg rounded-r-none pr-8 focus-visible:ring-transparent'
      />
      <Button
        aria-label='Search products'
        className='rounded-l-none'
        variant='default'
        onClick={handleSearch}
      >
        <Search className='size-4' />
      </Button>
    </div>
  );
}
