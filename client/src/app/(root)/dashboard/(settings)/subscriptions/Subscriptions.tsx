import { fetchAxiosAuthServer } from '@/api/axiosAuthServer';
import SubscriptionCards from '@/components/customComponents/subscriptions/Subscriptions';
import { API_URL } from '@/config/api.config';
import { GetPlansDto, GetSubscriptionDto } from '@/generated/orval/types';

export const revalidate = 60;

// TODO axiosAuthServer example

async function getPlans() {
  return fetchAxiosAuthServer<GetPlansDto[]>(API_URL.plans());
}

async function getSubscriptions() {
  return fetchAxiosAuthServer<GetSubscriptionDto[]>(API_URL.subscriptions());
}

export default async function Subscriptions() {
  const [plans, subscriptions] = await Promise.all([
    getPlans(),
    getSubscriptions(),
  ]);
  return <SubscriptionCards plans={plans} subscriptions={subscriptions} />;
}
