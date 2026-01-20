import { GetPlansDto, GetPlansDtoPeriod } from '@/generated/orval/types';
import MonthlyPrice from './MonthlyPrice';
import AnnualPrice from './AnnualPrice';
import { memo } from 'react';

function SubscriptionPrice({
  plan,
  period,
  plans,
}: {
  plan: GetPlansDto;
  period: GetPlansDtoPeriod;
  plans: GetPlansDto[];
}) {
  if (period === GetPlansDtoPeriod.MONTHLY || plan.planId === 'FREE') {
    return <MonthlyPrice price={plan.price} />;
  }

  const monthlyPlan = plans.find(
    (p) => p.planId === plan.planId.replace('_ANNUAL', '')
  );

  if (!monthlyPlan) return null;

  const full = monthlyPlan.price * 12;
  const discount = Math.round(((full - plan.price) / full) * 100);

  return <AnnualPrice price={plan.price} full={full} discount={discount} />;
}

export default memo(SubscriptionPrice);
