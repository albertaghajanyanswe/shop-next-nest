'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type BillingAction = 'subscribe' | 'downgrade' | 'cancel';

interface BillingMessage {
  title: string;
  description: string;
  icon: 'success' | 'error';
}

const BILLING_MESSAGES: Record<BillingAction, BillingMessage> = {
  subscribe: {
    title: 'Operation Succeeded',
    description:
      'You have successfully subscribed to the plan {planId}. You can close this window now.',
    icon: 'success',
  },
  downgrade: {
    title: 'Downgrade Succeeded',
    description:
      'You have successfully downgraded to the plan {planId}. You can close this window now.',
    icon: 'success',
  },
  cancel: {
    title: 'Cancel Succeeded',
    description:
      'You have successfully canceled your subscription. You can close this window now.',
    icon: 'success',
  },
};

const ERROR_MESSAGE: BillingMessage = {
  title: 'Something went wrong',
  description: 'Please try again later or contact support.',
  icon: 'error',
};

export default function BillingResult() {
  const searchParams = useSearchParams();

  const isSuccess = searchParams.get('success') === 'true';
  const isDowngrade = searchParams.get('downgrade') === 'true';
  const isCancel = searchParams.get('cancel') === 'true';
  const planId = searchParams.get('planId');

  const getAction = (): BillingAction | null => {
    if (isCancel) return 'cancel';
    if (isDowngrade) return 'downgrade';
    return 'subscribe';
  };

  const action = getAction();
  const message =
    isSuccess && action ? BILLING_MESSAGES[action] : ERROR_MESSAGE;

  return (
    <div className='xs:my-24 my-6 flex h-full w-full items-center justify-center px-4'>
      <div className='w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        {/* Icon */}
        <div className='mb-4 flex items-center justify-center'>
          {message.icon === 'success' ? (
            <CheckCircle className='h-8 w-8 text-emerald-600' />
          ) : (
            <AlertCircle className='text-shop-red h-8 w-8' />
          )}
        </div>

        {/* Title */}
        <h5
          className={`mb-4 place-self-center text-2xl font-semibold ${
            message.icon === 'success' ? 'text-green-700' : 'text-shop-red'
          }`}
        >
          {message.title}
        </h5>

        {/* Description */}
        <p className='text-muted-foreground text-center font-normal'>
          {message.icon === 'success' && planId ? (
            <>
              {message.description.split('{planId}')[0]}
              <b>{planId}</b>
              {message.description.split('{planId}')[1]}
            </>
          ) : (
            message.description
          )}
        </p>
      </div>
    </div>
  );
}
