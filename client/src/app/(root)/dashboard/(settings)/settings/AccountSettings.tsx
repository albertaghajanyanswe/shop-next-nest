'use client';

import { Button } from '@/components/ui/Button';
import { useCreateConnectAccountStripe } from '@/hooks/stripe/useCreateConnectAccountStripe';
import { useCreateLoginLink } from '@/hooks/stripe/useCreateLoginLink';
import { stripeService } from '@/services/stripe.service.ts';
import { StripeActionBlock } from './StripeActionBlock';

export default function AccountSettings() {
  const { connectStripeAccount, isLoadingConnectAccount } =
    useCreateConnectAccountStripe();

  const handleLoginStripeDashboard = async () => {
    const loginLinkObj = await stripeService.getLoginUrl();
    console.log('loginLinkObj = ', loginLinkObj);
    window.open(loginLinkObj.loginLink, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className='flex flex-col gap-4'>
      <StripeActionBlock
        title='Register on stripe as seller'
        description={`To start selling products and accepting payments and manage your sales, you need a Stripe seller account.
  Click the button below to quickly register or log in. After completing it, you can:
  - Receive payouts to your bank account
  - Manage your products and orders
  - Access your Stripe Dashboard`}
        buttonText='Register on Stripe as Seller'
        onButtonClick={() => connectStripeAccount()}
      />

      <StripeActionBlock
        title='Login to stripe dashboard'
        description={`Already have a Stripe seller account?
Click the button below to securely log in to your Stripe Dashboard and manage your sales, products, and payouts.
Access your account anytime to track orders and payments.`}
        buttonText='Login to Stripe Dashboard'
        onButtonClick={handleLoginStripeDashboard}
      />
    </div>
  );
}
