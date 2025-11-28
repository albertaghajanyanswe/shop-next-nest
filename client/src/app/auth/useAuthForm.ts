'use client';
import { ErrorResponse } from '@/api/api.interceptors';
import { DASHBOARD_URL } from '@/config/url.config';
import { AuthResponseDto, RegisterDto } from '@/generated/orval/types';
import { authService } from '@/services/auth/auth.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function useAuthForm(isReg: boolean) {
  const router = useRouter();

  const form = useForm<RegisterDto>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useMutation<AuthResponseDto, ErrorResponse, RegisterDto>({
    mutationKey: QUERY_KEYS.auth,
    mutationFn: (data: RegisterDto) =>
      authService.main(isReg ? 'register' : 'login', data),
    onSuccess: () => {
      form.reset();
      toast.success('Login success');
      router.replace(DASHBOARD_URL.home());
    },
    onError: (error) => {
      console.log('error = ', error);
      toast.error(
        error.response?.data?.message || error.message || 'Error while login'
      );
    },
  });

  const onSubmit: SubmitHandler<RegisterDto> = (data) => {
    mutate(data);
  };

  return { form, onSubmit, isPending };
}
