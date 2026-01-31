import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { QUERY_KEYS } from '@/shared/queryConstants';

export function useProfile() {
  const { data: user, isLoading } = useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => userService.getProfile(),
  });

  const userActiveSub = user?.subscription?.find((i) => i.status === 'ACTIVE');

  const canCreateStore =
    userActiveSub && userActiveSub?.storeLimit
      ? userActiveSub.storeLimit > (user?.stores?.length || 0)
      : false;
  const publishedProduct = user?.products?.filter((i) => i.isPublished) || [];

  const canCreateProduct =
    userActiveSub && userActiveSub?.productLimit
      ? userActiveSub.productLimit > (publishedProduct.length || 0)
      : false;
  return { user, isLoading, canCreateStore, canCreateProduct };
}
