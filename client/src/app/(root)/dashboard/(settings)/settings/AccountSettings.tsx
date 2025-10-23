'use client';

import { Button } from '@/components/ui/Button';
import { useCreateConnectAccountStripe } from '@/hooks/stripe/useCreateConnectAccountStripe';

export default function AccountSettings() {
  const { connectStripeAccount, isLoadingConnectAccount } =
    useCreateConnectAccountStripe();
  return (
    <div className='my-6'>
      <Button
        disabled={isLoadingConnectAccount}
        variant='primary'
        onClick={() => connectStripeAccount()}
      >
        Register on stripe as seller
      </Button>
    </div>
  );
}
