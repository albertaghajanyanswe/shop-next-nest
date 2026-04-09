'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/Button';
import { useCreateConnectAccountStripe } from '@/hooks/stripe/useCreateConnectAccountStripe';
import { useCreateLoginLink } from '@/hooks/stripe/useCreateLoginLink';
import { stripeService } from '@/services/stripe.service.ts';
import { StripeActionBlock } from './StripeActionBlock';
import { useProfile } from '@/hooks/useProfile';
import { EnvVariables } from '@/shared/envVariables';

export default function AccountSettings() {
  const { theme, setTheme } = useTheme();
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
      <div className='flex flex-col gap-2 rounded-lg border p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-medium'>Theme</h3>
            <p className='text-sm text-muted-foreground'>
              <span><b className='text-shop-primary-text'>{theme === 'dark' ? 'Dark' : 'Light'}</b> theme is currently active.</span>
            </p>
          </div>
          <Button
            disabled
            variant='outline'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
          </Button>
        </div>
      </div>

      <StripeActionBlock
        title='Register on stripe as seller'
        description={
          <>
            To start selling products and accepting payments and manage your
            sales, you need a Stripe seller account. Click the button below to
            quickly register or log in. After completing it, you can:
            <ul className='list-disc px-4'>
              <li className='mt-1 text-xs leading-relaxed'>
                Receive payouts to your bank account
              </li>
              <li className='mt-1 text-xs leading-relaxed'>
                Manage your products and orders
              </li>
              <li className='mt-1 text-xs leading-relaxed'>
                Access your Stripe Dashboard
              </li>
            </ul>
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
