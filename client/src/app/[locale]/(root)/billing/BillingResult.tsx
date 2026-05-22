'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function BillingResult() {
  const t = useTranslations('Billing');
  const searchParams = useSearchParams();

  const isSuccess = searchParams.get('success') === 'true';
  const isDowngrade = searchParams.get('downgrade') === 'true';
  const isCancel = searchParams.get('cancel') === 'true';
  const planId = searchParams.get('planId');

  let title: string;
  let description: React.ReactNode;
  let icon: 'success' | 'error';

  if (!isSuccess) {
    title = t('something_went_wrong');
    description = t('something_went_wrong_desc');
    icon = 'error';
  } else if (isCancel) {
    title = t('cancel_succeeded');
    description = t('cancel_succeeded_desc');
    icon = 'success';
  } else if (isDowngrade) {
    title = t('downgrade_succeeded');
    description = t.rich('downgrade_succeeded_desc', {
      planId: (chunks) => <b>{chunks}</b>,
      planIdValue: planId,
    });
    icon = 'success';
  } else {
    title = t('operation_succeeded');
    description = t.rich('operation_succeeded_desc', {
      planId: (chunks) => <b>{chunks}</b>,
      planIdValue: planId,
    });
    icon = 'success';
  }

  return (
    <div className='xs:my-24 my-6 flex h-full w-full items-center justify-center px-4'>
      <div className='bg-shop-white w-full max-w-sm rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <div className='mb-4 flex items-center justify-center'>
          {icon === 'success' ? (
            <CheckCircle className='h-8 w-8 text-emerald-600' />
          ) : (
            <AlertCircle className='text-shop-red h-8 w-8' />
          )}
        </div>

        <h5
          className={`mb-4 place-self-center text-2xl font-semibold ${
            icon === 'success' ? 'text-green-700' : 'text-shop-red'
          }`}
        >
          {title}
        </h5>

        <p className='text-muted-foreground text-center font-normal'>
          {description}
        </p>
      </div>
    </div>
  );
}
