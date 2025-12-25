'use client';

import { useCallback, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { useManagePlan } from '@/hooks/stripe/useManagePlan';
import { stripeService } from '@/services/stripe.service.ts';
import { useUpgradePlan } from '@/hooks/stripe/useUpgradePlan';
import { useGetPlans } from '@/hooks/stripe/useGetPlans';
import { count } from 'console';
import { useGetSubscriptions } from '@/hooks/stripe/useGetSubscriptions';
import { useCancelUpgrade } from '@/hooks/stripe/useCancelUpgrade';
import { EnumSubscriptionStatus } from '@/shared/types/stripe.interface';
import { useTestClock } from '@/hooks/stripe/useTestClock';
import { GetPlansDto, GetPlansDtoPlanId } from '@/generated/orval/types';

const PLAN_FEATURES = {
  FREE: ['1 Store', '10 Products'],
  ADVANCED: ['5 Stores', '150 Products', 'Community Support'],
  ADVANCED_ANNUAL: ['5 Stores', '150 Products', 'Community Support'],
  PREMIUM: ['Unlimited Stores', 'Unlimited Projects', '24/7 Premium Support'],
  PREMIUM_ANNUAL: [
    'Unlimited Stores',
    'Unlimited Projects',
    '24/7 Premium Support',
  ],
};

export default function SubscriptionCards() {
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');

  const { plans, isLoadingPlans } = useGetPlans();

  const { subscriptions, isLoadingSubscriptions } = useGetSubscriptions();

  const { runTestClock, isLoadingTestClock } = useTestClock();
  const activeSubscription = subscriptions?.find(
    (sub) => sub.status === 'ACTIVE'
  );
  const activePlan = plans?.find(
    (plan) => plan.planId === activeSubscription?.planId
  );

  const [processing, setProcessing] = useState(false);
  const currentPlanName = activeSubscription?.planId;
  const currentSubSettings = plans?.find((i) => i.planId === currentPlanName);

  const nextPlanId = activeSubscription?.nextPlanId;
  const nextPlanData = plans?.find((i) => i.planId === nextPlanId);

  const filteredPlans = plans?.filter((plan) =>
    period === 'monthly'
      ? !plan.planId.includes('_ANNUAL')
      : plan.planId.includes('_ANNUAL') || plan.planId === 'FREE'
  );
  // const { managePlan } = useManagePlan();
  const { upgradePlan } = useUpgradePlan();
  const { cancelUpgrade } = useCancelUpgrade();

  const handleManagePlan = async () => {
    const managementLink = await stripeService.getManagementLink();
    console.log(managementLink);
    window.location.href = managementLink.url;
  };

  const calculateDiscount = useCallback(() => {
    if (!plans) return 0;
    const advancedPlanLit = plans?.filter(
      (plan) => plan.planId === 'ADVANCED' || plan.planId === 'ADVANCED_ANNUAL'
    );
    const yearlyPlan = advancedPlanLit.find(
      (p) => p.planId === 'ADVANCED_ANNUAL'
    );
    const monthlyPlan = advancedPlanLit.find((p) => p.planId === 'ADVANCED');
    const bigPrice = monthlyPlan!.price * 12;
    const discounted = ((bigPrice - yearlyPlan!.price) / bigPrice) * 100;
    return Math.round(discounted);
  }, [plans]);

  const getPriceBlock = (plan: GetPlansDto) => {
    if (period === 'monthly' || plan.planId === 'FREE') {
      return (
        <div className='h-16 text-neutral-900'>
          <p className='text-3xl font-semibold lg:text-4xl'>
            ${plan.price}
            <span className='text-sm font-medium text-neutral-700'>
              /monthly
            </span>
          </p>
          <p className='text-xs sm:min-h-4'></p>
        </div>
      );
    }

    const monthlyPlanId = plan.planId.split('_')[0];
    const monthlyPlan = plans?.find((p) => p.planId === monthlyPlanId);
    const bigPrice = monthlyPlan!.price * 12;
    const discounted = Math.round(((bigPrice - plan.price) / bigPrice) * 100);

    return (
      <div className='text-neutral-900'>
        <div className='flex flex-row items-baseline gap-2'>
          <span className='text-3xl font-semibold text-neutral-900 lg:text-4xl'>
            ${plan.price}
            <span className='text-sm font-medium text-neutral-700'>
              /annual
            </span>
          </span>
        </div>
        {plan.price > 0 && (
          <span className='text-shop-light-green text-xs font-semibold'>
            <span className='text-shop-red mr-2 text-sm font-semibold line-through'>
              ${monthlyPlan!.price * 12}
            </span>
            Save ${discounted}%
          </span>
        )}
      </div>
    );
  };

  const getPlanName = (planId: string) => {
    return planId.replace('_ANNUAL', '');
  };

  const handleSubscriptionSubmit = async (
    planId: GetPlansDtoPlanId,
    isCancelNextPlan: boolean
  ) => {
    if (activeSubscription?.planId === planId) {
      return;
    }
    if (isCancelNextPlan) {
      cancelUpgrade();
      return;
    }
    if (currentPlanName !== planId) {
      upgradePlan(planId);
    }
  };

  const getChangePlanText = (planItem: GetPlansDto) => {
    const userHadOnlyFreeSub = !subscriptions?.some(
      (i) => i.planId !== 'FREE' && i.status !== EnumSubscriptionStatus.PENDING
    );

    const isSamePeriod =
      planItem.planId === activeSubscription?.planId &&
      currentSubSettings?.period?.toLowerCase() === period?.toLowerCase();

    const planItemSubSettings = plans?.find(
      (i) => i.planId === planItem.planId
    );
    const isDowngrade =
      planItemSubSettings &&
      currentSubSettings &&
      planItemSubSettings?.price < currentSubSettings?.price;

    if (nextPlanId === planItem.planId) return 'Cancel Change';

    return planItem.planId === 'FREE'
      ? planItem.planId === currentPlanName
        ? 'Current Plan'
        : 'Change Plan'
      : userHadOnlyFreeSub
        ? '7-Day Free Trial'
        : planItem.planId === currentPlanName
          ? isSamePeriod
            ? 'Current Plan'
            : isDowngrade
              ? 'Change Plan'
              : 'Get Started'
          : isDowngrade
            ? 'Change Plan'
            : 'Get Started';
  };

  return (
    <div className='bg-shop-light-bg space-y-6 rounded-lg p-6'>
      {/* Toggle period */}
      <div className='flex items-center justify-center space-x-2'>
        <Label className='text-neutral-900' htmlFor='period'>
          Monthly
        </Label>
        <Switch
          id='period'
          checked={period === 'annual'}
          onCheckedChange={(checked) =>
            setPeriod(checked ? 'annual' : 'monthly')
          }
        />
        <Label className='text-neutral-900' htmlFor='period'>
          Annual{' '}
          <span className='text-shop-light-green font-semibold'>
            (save {calculateDiscount()}%)
          </span>
        </Label>
      </div>

      {/* Cards */}
      <Button
        className='font-medium'
        variant='primary'
        onClick={handleManagePlan}
      >
        Manage Plan
      </Button>

      <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {filteredPlans &&
          filteredPlans?.length > 0 &&
          filteredPlans.map((plan) => (
            <Card
              key={plan.planId}
              className={`relative flex flex-col overflow-hidden border-none bg-white shadow-none ${plan.isPopular ? 'bg-gradient-to-r from-emerald-200 to-lime-200' : ''}`}
            >
              <CardHeader className='text-neutral-900'>
                <CardTitle className='flex h-6 items-center justify-between text-neutral-900'>
                  {getPlanName(plan.planId)}
                  {plan.planId.includes('ADVANCED') && (
                    <p className='w-21 text-neutral900 bg-emerald-800 absolute top-0 right-0 flex items-center justify-center rounded-bl-full px-[10px] py-[4px] text-xs font-semibold text-white'>
                      Popular
                    </p>
                  )}
                </CardTitle>
                {getPriceBlock(plan)}
              </CardHeader>

              <CardContent className='flex-1'>
                <ul className='space-y-2'>
                  {PLAN_FEATURES[plan.planId as keyof typeof PLAN_FEATURES].map(
                    (feature) => (
                      <li
                        key={feature}
                        className='flex items-center text-sm text-neutral-900'
                      >
                        <Check className='text-shop-light-green mr-2 h-4 w-4' />
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  disabled={activeSubscription?.planId === plan.planId}
                  className={`w-full ${activeSubscription?.planId === plan.planId ? 'cursor-not-allowed' : ''}`}
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  onClick={() =>
                    handleSubscriptionSubmit(
                      plan.planId,
                      nextPlanId === plan.planId
                    )
                  }
                >
                  {getChangePlanText(plan)}
                  {/* {activeSubscription?.planId === plan?.planId
                    ? 'Current Plan'
                    : 'Change Plan'} */}
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
      <div className='flex flex-row gap-4'>
        <Button variant='outline' onClick={() => runTestClock(9)}>
          Clock 9 d
        </Button>
        <Button variant='outline' onClick={() => runTestClock(50)}>
          Clock 50 d
        </Button>
        <Button variant='outline' onClick={() => runTestClock(367)}>
          Clock 367 d
        </Button>
      </div>
    </div>
  );
}
