'use client';

import SubscriptionCards from '@/components/customComponents/subscriptions/Subscriptions';
import Loading from '@/components/customComponents/loading/Loading';
import { useGetPlans } from '@/hooks/stripe/useGetPlans';
import { useGetSubscriptions } from '@/hooks/stripe/useGetSubscriptions';

export default function Subscriptions() {
  const { plans, isLoadingPlans } = useGetPlans();
  const { subscriptions, isLoadingSubscriptions } = useGetSubscriptions();

  if (isLoadingPlans || isLoadingSubscriptions) {
    return <Loading />;
  }

  return (
    <SubscriptionCards
      plans={plans || []}
      subscriptions={subscriptions || []}
    />
  );
}
