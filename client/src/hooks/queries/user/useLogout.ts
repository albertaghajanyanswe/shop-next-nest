import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PUBLIC_URL } from '@/config/url.config';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { authService } from '@/services/auth/auth.service';
import { persistor } from '@/store/store';

export function useLogout() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoadingLogout } = useMutation({
    mutationKey: QUERY_KEYS.logout,
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      persistor.purge();
      queryClient.setQueryData(QUERY_KEYS.profile, null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      toast.success('Logout from account.');
      router.push(PUBLIC_URL.auth());
    },
    onError: () => {
      toast.error('Failed to logout.');
    },
  });

  return useMemo(
    () => ({ logout, isLoadingLogout }),
    [logout, isLoadingLogout]
  );
}
