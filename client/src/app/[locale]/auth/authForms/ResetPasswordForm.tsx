'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { CheckCircle, CircleAlert, MessageSquareWarning } from 'lucide-react';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordFormData>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid reset link');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsPending(true);
    setError('');

    try {
      await mailerService.resetPassword(token, data.password);
      setSuccess(true);
      form.reset();
      setTimeout(() => {
        router.push('/auth');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsPending(false);
    }
  };

  const passwordValue = form.watch('password', '');
  const strength =
    passwordValue.length >= 8
      ? 'strong'
      : passwordValue.length >= 6
        ? 'medium'
        : 'weak';

  if (!token) {
    return (
      <>
        <CardHeader className='flex w-full flex-col items-center justify-center pb-5'>
          <CardTitle className='text-shop-muted-text-7 pb-1 text-center text-xl font-semibold'>
            Invalid Link
          </CardTitle>
        </CardHeader>
        <CardContent className='w-full p-0'>
          <div className='flex items-center gap-2 rounded-md bg-red-100 p-3 text-sm font-semibold text-red-700'>
            <CircleAlert />
            Invalid or missing reset token
          </div>
        </CardContent>
        <CardFooter className='text-muted-foreground mt-4 p-0 text-sm'>
          <Link
            href='/auth'
            className='text-shop-light-primary hover:underline'
          >
            Back to Login
          </Link>
        </CardFooter>
      </>
    );
  }

  if (success) {
    return (
      <>
        <CardHeader className='flex w-full flex-col items-center justify-center pb-5'>
          <CardTitle className='text-shop-muted-text-7 pb-1 text-center text-xl font-semibold'>
            Success!
          </CardTitle>
        </CardHeader>
        <CardContent className='w-full p-0'>
          <div className='flex items-center justify-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700'>
            <CheckCircle />
            Password reset successfully! Redirecting to login . . .
          </div>
        </CardContent>
        <CardFooter className='text-muted-foreground mt-4 p-0 text-sm'>
          <Link
            href='/auth'
            className='text-shop-light-primary hover:underline'
          >
            Go to Login
          </Link>
        </CardFooter>
      </>
    );
  }

  return (
    <>
      <CardHeader className='flex w-full flex-col items-center justify-center pb-5'>
        <CardTitle className='text-shop-muted-text-7 pb-1 text-center text-xl font-semibold'>
          Reset Password
        </CardTitle>
        <CardDescription className='text-shop-muted-text-6 text-center'>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent className='w-full p-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField<ResetPasswordFormData, 'password'>
              control={form.control}
              name='password'
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='New Password'
                      type='password'
                      disabled={isPending}
                      autoComplete='new-password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {passwordValue && (
              <div className='mt-2 flex gap-1'>
                {['weak', 'medium', 'strong'].map((s, i) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      strength === 'strong'
                        ? 'bg-green-500'
                        : strength === 'medium' && i < 2
                          ? 'bg-yellow-500'
                          : strength === 'weak' && i === 0
                            ? 'bg-red-500'
                            : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            )}

            <FormField<ResetPasswordFormData, 'confirmPassword'>
              control={form.control}
              name='confirmPassword'
              rules={{
                required: 'Please confirm your password',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Confirm Password'
                      type='password'
                      disabled={isPending}
                      autoComplete='new-password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className='rounded-md bg-red-50 p-3 text-sm text-red-700'>
                {error}
              </div>
            )}

            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='text-muted-foreground mt-4 p-0 text-sm'>
        <Link href='/auth' className='text-shop-light-primary hover:underline'>
          Back to Login
        </Link>
      </CardFooter>
    </>
  );
}
