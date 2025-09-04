'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/form-elements/Input';
import { PUBLIC_URL } from '@/config/url.config';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchInput() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');

  const router = useRouter();

  return (
    <div className='relative flex items-center'>
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
        onClick={() =>
          router.push(PUBLIC_URL.explorer(`searchTerm=${searchTerm}`))
        }
      >
        <Search className='size-4' />
      </Button>
    </div>
  );
}
