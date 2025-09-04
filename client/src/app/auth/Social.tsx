import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FcGoogle } from 'react-icons/fc';
import { SERVER_URL } from '@/config/api.config';

export function Social() {
  const router = useRouter();
  return (
    <div className='space-y-3 w-full mt-5'>
      <Button
        variant='outline'
        onClick={() => router.push(`${SERVER_URL}/auth/google`)}
        className='w-full'
      >
        <FcGoogle className='size-5 mr-2' />
        Continue with Google
      </Button>
    </div>
  );
}
