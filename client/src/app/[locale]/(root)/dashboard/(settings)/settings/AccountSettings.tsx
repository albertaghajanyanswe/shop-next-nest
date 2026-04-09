'use client';

import { useTranslations } from 'next-intl';

import { useCreateConnectAccountStripe } from '@/hooks/stripe/useCreateConnectAccountStripe';
import { stripeService } from '@/services/stripe.service.ts';
import { StripeActionBlock } from './StripeActionBlock';
import { useProfile } from '@/hooks/useProfile';
import { EnvVariables } from '@/shared/envVariables';
import { LanguageSwitcher } from '@/components/customComponents/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/customComponents/ThemeSwitcher';

export default function AccountSettings() {
  const t = useTranslations('AccountSettings');
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
      <LanguageSwitcher />
      <ThemeSwitcher />

      <StripeActionBlock
        title={t('register_stripe')}
        description={
          <>
            {t('register_stripe_desc')}
            <ul className='list-disc px-4'>
              <li className='mt-1 text-xs leading-relaxed'>
                {t('payouts_desc')}
              </li>
              <li className='mt-1 text-xs leading-relaxed'>
                {t('manage_desc')}
              </li>
              <li className='mt-1 text-xs leading-relaxed'>
                {t('dashboard_desc')}
              </li>
            </ul>
          </>
        }
        buttonText={t('register_stripe')}
        onButtonClick={handleConnectStripeAccount}
        btnDisabled={
          !!user?.stripeAccountId ||
          isLoadingConnectAccount ||
          !EnvVariables.NEXT_PUBLIC_ALLOW_PURCHASE
        }
      />

      <StripeActionBlock
        title={t('login_stripe')}
        description={t('login_stripe_desc')}
        buttonText={t('login_stripe')}
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
