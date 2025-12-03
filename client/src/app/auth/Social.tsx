import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FcGoogle } from 'react-icons/fc';
import { NEXT_PUBLIC_SERVER_URL } from '@/config/api.config';

export function Social() {
  const router = useRouter();
  return (
    <div className='mt-5 w-full space-y-3'>
      <Button
        variant='outline'
        onClick={() => router.push(`${NEXT_PUBLIC_SERVER_URL}/api/auth/google`)}
        className='w-full'
      >
        <FcGoogle className='mr-2 size-5' />
        Continue with Google
      </Button>
    </div>
  );
}
