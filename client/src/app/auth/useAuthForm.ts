'use client';
import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config';
import { authService } from '@/services/auth/auth.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IAuthForm } from '@/shared/types/auth.interface';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function useAuthForm(isReg: boolean) {
  const router = useRouter();

  const form = useForm<IAuthForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: QUERY_KEYS.auth,
    mutationFn: (data: IAuthForm) =>
      authService.main(isReg ? 'register' : 'login', data),
    onSuccess: () => {
      form.reset();
      toast.success('Login success');
      router.replace(DASHBOARD_URL.home());
    },
    onError: (error) => {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Error while login');
      }
    },
  });

  const onSubmit: SubmitHandler<IAuthForm> = (data) => {
    mutate(data);
  };

  return { form, onSubmit, isPending };
}
