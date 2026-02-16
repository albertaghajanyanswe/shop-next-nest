'use client';

import { Button } from '@/components/ui/Button';
import { useCreateConnectAccountStripe } from '@/hooks/stripe/useCreateConnectAccountStripe';
import { useCreateLoginLink } from '@/hooks/stripe/useCreateLoginLink';
import { stripeService } from '@/services/stripe.service.ts';
import { StripeActionBlock } from './StripeActionBlock';
import { useProfile } from '@/hooks/useProfile';
import { EnvVariables } from '@/shared/envVariables';

export default function AccountSettings() {
  const { user } = useProfile();
  const { connectStripeAccount, isLoadingConnectAccount } =
    useCreateConnectAccountStripe();

  const handleConnectStripeAccount = async () => {
    if (user?.stripeAccountId || isLoadingConnectAccount) return;
    connectStripeAccount();
  };

  const handleLoginStripeDashboard = async () => {
    if (!user?.stripeAccountId || isLoadingConnectAccount) return;
    const loginLinkObj = await stripeService.getLoginUrl();
    window.open(loginLinkObj.loginLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='flex flex-col gap-4'>
      <StripeActionBlock
        title='Register on stripe as seller'
        description={
          <>
            To start selling products and accepting payments and manage your
            sales, you need a Stripe seller account. Click the button below to
            quickly register or log in. After completing it, you can:
            {
              <p className='mt-1 text-xs leading-relaxed'>
                - Receive payouts to your bank account
              </p>
            }
            {
              <p className='text-xs leading-relaxed'>
                - Manage your products and orderst
              </p>
            }
            {
              <p className='text-xs leading-relaxed'>
                - Access your Stripe Dashboard
              </p>
            }
          </>
        }
        buttonText='Register on Stripe as Seller'
        onButtonClick={handleConnectStripeAccount}
        btnDisabled={
          !!user?.stripeAccountId ||
          isLoadingConnectAccount ||
          !EnvVariables.NEXT_PUBLIC_ALLOW_PURCHASE
        }
      />

      <StripeActionBlock
        title='Login to stripe dashboard'
        description={`Already have a Stripe seller account?
Click the button below to securely log in to your Stripe Dashboard and manage your sales, products, and payouts.
Access your account anytime to track orders and payments.`}
        buttonText='Login to Stripe Dashboard'
        onButtonClick={handleLoginStripeDashboard}
        btnDisabled={
          !user?.stripeAccountId ||
          isLoadingConnectAccount ||
          !EnvVariables.NEXT_PUBLIC_ALLOW_PURCHASE
        }
      />
    </div>
  );
}
