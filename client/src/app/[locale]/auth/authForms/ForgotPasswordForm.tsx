'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/formElements/Form';
import { Input } from '@/components/ui/formElements/Input';
import { Button } from '@/components/ui/Button';
import { mailerService } from '@/services/mailer.service';
import { validEmailRegex } from '@/shared/regex';
import { CheckCircle, CircleAlert } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPasswordForm() {
  const t = useTranslations('ForgotPassword');
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const form = useForm<ForgotPasswordFormData>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsPending(true);
    setError('');
    setMessage('');

    try {
      await mailerService.forgotPassword(data.email);
      setMessage(t('success_message'));
      form.reset();
    } catch (err: any) {
      setError(err.response?.data?.message || t('error_message'));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <CardHeader className='flex w-full flex-col items-center justify-center pb-5'>
        <CardTitle className='text-shop-muted-text-7 pb-1 text-center text-xl font-semibold'>
          {t('title')}
        </CardTitle>
        <CardDescription className='text-shop-muted-text-6 text-center'>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className='w-full p-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField<ForgotPasswordFormData, 'email'>
              control={form.control}
              name='email'
              rules={{
                required: t('email_required'),
                pattern: {
                  value: validEmailRegex,
                  message: t('email_invalid'),
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t('email_placeholder')}
                      type='email'
                      disabled={isPending}
                      autoComplete='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {message && (
              <div className='bg-primary-100 text-primary-600 flex items-center gap-2 rounded-md p-3 text-sm font-semibold'>
                <CheckCircle />
                {message}
              </div>
            )}

            {error && (
              <div className='flex items-center gap-2 rounded-md bg-red-100 p-3 text-sm font-semibold text-red-700'>
                <CircleAlert />
                {error}
              </div>
            )}

            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? t('sending') : t('send_button')}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='text-muted-foreground mt-4 p-0 text-sm'>
        <Link href='/auth' className='text-shop-light-primary hover:underline'>
          {t('back_to_login')}
        </Link>
      </CardFooter>
    </>
  );
}
