import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { userService } from '@/services/user.service';
import { UpdateUserDto } from '@/generated/orval/types';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => userService.getProfile(),
  });

  const { mutate: updateUser, isPending: isLoadingUpdate } = useMutation({
    mutationKey: QUERY_KEYS.updateUser,
    mutationFn: (data: UpdateUserDto) => userService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      toast.success('User updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update user.');
    },
  });

  return useMemo(
    () => ({
      user,
      updateUser,
      isLoadingUpdate,
    }),
    [user, updateUser, isLoadingUpdate]
  );
}
