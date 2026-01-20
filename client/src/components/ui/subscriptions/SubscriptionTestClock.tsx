import { useTestClock } from '@/hooks/stripe/useTestClock';
import { Button } from '../Button';
import { memo } from 'react';

const SubscriptionTestClock = () => {
  const { runTestClock, isLoadingTestClock } = useTestClock();

  return (
    <div className='flex flex-row gap-4'>
      <Button
        disabled={isLoadingTestClock}
        variant='outline'
        onClick={() => runTestClock(9)}
      >
        Clock 9 d
      </Button>
      <Button
        disabled={isLoadingTestClock}
        variant='outline'
        onClick={() => runTestClock(40)}
      >
        Clock 40 d
      </Button>
      <Button
        disabled={isLoadingTestClock}
        variant='outline'
        onClick={() => runTestClock(120)}
      >
        Clock 120 d
      </Button>
      <Button
        disabled={isLoadingTestClock}
        variant='outline'
        onClick={() => runTestClock(365)}
      >
        Clock 365 d
      </Button>
    </div>
  );
};
export default memo(SubscriptionTestClock);
