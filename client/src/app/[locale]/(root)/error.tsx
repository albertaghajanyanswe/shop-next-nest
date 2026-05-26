'use client';

import { Button } from '@/components/ui/Button';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='flex min-h-50 flex-col items-center justify-center gap-4 py-8 text-center'>
      <h2 className='text-2xl font-semibold'>Something went wrong!</h2>
      <Button variant='default' onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
