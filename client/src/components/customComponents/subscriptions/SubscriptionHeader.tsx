import {
  GetPlansDto,
  GetPlansDtoPeriod,
  GetPlansDtoPlanId,
} from '@/generated/orval/types';
import { Label } from '../../ui/Label';
import { Switch } from '../../ui/Switch';
import { memo, useCallback } from 'react';

interface ISubscriptionHeaderProps {
  plans: GetPlansDto[];
  period: GetPlansDtoPeriod;
  setPeriod: (prev: GetPlansDtoPeriod) => void;
}
function SubscriptionHeader({
  plans,
  period,
  setPeriod,
}: ISubscriptionHeaderProps) {
  const findPlan = useCallback(
    (planId: string) => plans.find((p) => p.planId === planId),
    [plans]
  );

  const calculateDiscount = useCallback(
    (basePlanId: GetPlansDtoPlanId) => {
      const monthlyPlan = findPlan(basePlanId);
      const yearlyPlan = findPlan(`${basePlanId}_ANNUAL`);

      if (!monthlyPlan || !yearlyPlan) return 0;

      const yearlyEquivalent = monthlyPlan.price * 12;
      const discount =
        ((yearlyEquivalent - yearlyPlan.price) / yearlyEquivalent) * 100;
      return Math.round(discount);
    },
    [findPlan]
  );

  return (
    <div className='flex items-center justify-center space-x-2'>
      <Label className='text-shop-primary-text' htmlFor='period'>
        Monthly
      </Label>
      <Switch
        id='period'
        checked={period === GetPlansDtoPeriod.YEARLY}
        onCheckedChange={(checked) =>
          setPeriod(
            checked ? GetPlansDtoPeriod.YEARLY : GetPlansDtoPeriod.MONTHLY
          )
        }
      />
      <Label className='text-shop-primary-text' htmlFor='period'>
        Annual{' '}
        <span className='text-shop-light-primary font-semibold'>
          (save {calculateDiscount(GetPlansDtoPlanId.ADVANCED)}%)
        </span>
      </Label>
    </div>
  );
}

export default memo(SubscriptionHeader);
