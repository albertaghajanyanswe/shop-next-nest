import { useTranslations } from 'next-intl';
import { useTestClock } from '@/hooks/stripe/useTestClock';
import { Button } from '../../ui/Button';
import { memo } from 'react';

const SubscriptionTestClock = () => {
  const t = useTranslations('Subscriptions');
  const { runTestClock, isLoadingTestClock } = useTestClock();

  return (
    <div className='flex flex-row gap-4'>
      <Button
        disabled={isLoadingTestClock}
        variant='outline'
        onClick={() => runTestClock(9)}
      >
        {t('clock_days', { days: 9 })}
      </Button>
      <Button
        disabled={isLoadingTestClock}
        variant='outline'
        onClick={() => runTestClock(40)}
      >
        {t('clock_days', { days: 40 })}
      </Button>
      <Button
        disabled={isLoadingTestClock}
        variant='outline'
        onClick={() => runTestClock(120)}
      >
        {t('clock_days', { days: 120 })}
      </Button>
      <Button
        disabled={isLoadingTestClock}
        variant='outline'
        onClick={() => runTestClock(365)}
      >
        {t('clock_days', { days: 365 })}
      </Button>
    </div>
  );
};
export default memo(SubscriptionTestClock);
