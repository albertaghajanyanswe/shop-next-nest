'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { stripeService } from '@/services/stripe.service.ts';
import { useUpgradePlan } from '@/hooks/stripe/useUpgradePlan';
import { useCancelUpgrade } from '@/hooks/stripe/useCancelUpgrade';
import { EnumSubscriptionStatus } from '@/shared/types/stripe.interface';
import {
  GetPlansDto,
  GetPlansDtoPeriod,
  GetPlansDtoPlanId,
  GetSubscriptionDto,
} from '@/generated/orval/types';
import SubscriptionTestClock from './SubscriptionTestClock';
import SubscriptionFeatures from './SubscriptionFeatures';
import SubscriptionPrice from './price/SubscriptionPrice';
import toast from 'react-hot-toast';
import SubscriptionHeader from './SubscriptionHeader';

interface ISubscriptionCardsProps {
  plans: GetPlansDto[];
  subscriptions: GetSubscriptionDto[];
}

export default function SubscriptionCards({
  plans,
  subscriptions,
}: ISubscriptionCardsProps) {
  const [period, setPeriod] = useState<GetPlansDtoPeriod>(GetPlansDtoPeriod.MONTHLY);

  // Selectors
  const activeSubscription = useMemo(
    () =>
      subscriptions.find((sub) => sub.status === EnumSubscriptionStatus.ACTIVE),
    [subscriptions]
  );

  const currentPlanName = activeSubscription?.planId;
  const nextPlanId = activeSubscription?.nextPlanId;

  // Hooks
  const { upgradePlan } = useUpgradePlan();
  const { cancelUpgrade } = useCancelUpgrade();

  // Helper functions
  const getPlanSettings = useCallback(
    (planId: string) => plans.find((p) => p.planId === planId),
    [plans]
  );

  const isMonthlyPlan = (planId: string) => !planId.includes('_ANNUAL');
  const isAnnualPlan = (planId: string) =>
    planId.includes('_ANNUAL') || planId === GetPlansDtoPlanId.FREE;
  const isFreePlan = (planId: string) => planId === GetPlansDtoPlanId.FREE;

  const hasActivePaidSubscription = () =>
    subscriptions.some(
      (i) =>
        i.planId !== GetPlansDtoPlanId.FREE &&
        i.status !== EnumSubscriptionStatus.PENDING
    );

  const getPlanName = (planId: string) => planId.replace('_ANNUAL', '');

  // Filtered plans
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      if (period === GetPlansDtoPeriod.MONTHLY) {
        return isMonthlyPlan(plan.planId);
      }
      return isAnnualPlan(plan.planId);
    });
  }, [plans, period]);

  // Handlers
  const handleManagePlan = async () => {
    try {
      const { url } = await stripeService.getManagementLink();
      window.location.assign(url);
    } catch {
      toast.error('Failed to open billing portal');
    }
  };

  const handlePlanClick = useCallback(
    (planId: GetPlansDtoPlanId) => {
      if (activeSubscription?.planId === planId) {
        return;
      }

      if (nextPlanId === planId) {
        cancelUpgrade();
      } else {
        upgradePlan(planId);
      }
    },
    [nextPlanId, activeSubscription?.planId, cancelUpgrade, upgradePlan]
  );

  // Get button text
  const getChangePlanText = (planItem: GetPlansDto) => {
    const currentSubSettings = getPlanSettings(currentPlanName || '');
    const planItemSubSettings = getPlanSettings(planItem.planId);

    const isSamePlanAndPeriod =
      planItem.planId === activeSubscription?.planId &&
      currentSubSettings?.period?.toLowerCase() === period.toLowerCase();

    const isDowngradePlan =
      planItemSubSettings &&
      currentSubSettings &&
      planItemSubSettings.price < currentSubSettings.price;

    // Early returns
    if (nextPlanId === planItem.planId) return 'Cancel Change';
    if (isFreePlan(planItem.planId) && planItem.planId === currentPlanName)
      return 'Current Plan';

    // No paid subscription
    if (!hasActivePaidSubscription()) {
      return isFreePlan(planItem.planId) ? 'Change Plan' : '7-Day Free Trial';
    }

    // Has paid subscription
    if (planItem.planId === currentPlanName) {
      return isSamePlanAndPeriod ? 'Current Plan' : 'Get Started';
    }

    return isDowngradePlan ? 'Change Plan' : 'Get Started';
  };

  return (
    <div className='bg-shop-light-bg space-y-6 rounded-lg p-6'>
      {/* Period Toggle */}
      <SubscriptionHeader plans={plans} period={period} setPeriod={setPeriod} />
      {/* Manage Plan Button */}
      <Button
        className='font-medium'
        variant='default'
        onClick={handleManagePlan}
      >
        Manage Plan
      </Button>

      {/* Plans Grid */}
      <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {filteredPlans.map((plan) => (
          <Card
            key={plan.planId}
            className={`relative flex flex-col overflow-hidden border-none bg-white shadow-none ${
              plan.isPopular
                ? 'bg-gradient-to-r from-emerald-100 to-lime-100'
                : ''
            }`}
          >
            <CardHeader className='text-neutral-900'>
              <CardTitle className='flex h-6 items-center justify-between text-neutral-900'>
                {getPlanName(plan.planId)}
                {plan.isPopular && (
                  <span className='absolute top-0 right-0 flex w-fit items-center justify-center rounded-bl-full bg-emerald-800 px-[10px] py-[4px] text-xs font-semibold text-white'>
                    Popular
                  </span>
                )}
              </CardTitle>
              <SubscriptionPrice plan={plan} period={period} plans={plans} />
            </CardHeader>

            <CardContent className='flex-1'>
              <SubscriptionFeatures features={plan.features} />
            </CardContent>

            <CardFooter>
              <Button
                disabled={activeSubscription?.planId === plan.planId}
                className='w-full'
                variant={plan.isPopular ? 'primary' : 'outline'}
                onClick={() => handlePlanClick(plan.planId)}
              >
                {getChangePlanText(plan)}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <SubscriptionTestClock />
    </div>
  );
}
