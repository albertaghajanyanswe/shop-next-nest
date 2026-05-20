'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuthForm } from '../useAuthForm';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Form } from '@/components/ui/formElements/Form';
import { Button } from '@/components/ui/Button';
import { AuthFields } from './AuthFields';
import { Social } from '../Social';

export function LoginForm() {
  const t = useTranslations('Auth');
  const { form, onSubmit, isPending } = useAuthForm(false);

  return (
    <>
      <CardHeader className='flex w-full flex-col items-center justify-center pb-5'>
        <CardTitle className='text-shop-muted-text-7 pb-1 text-center text-xl font-semibold'>
          {t('login_title')}
        </CardTitle>
        <CardDescription className='text-shop-muted-text-6 text-center'>
          {t('login_description')}
        </CardDescription>
      </CardHeader>
      <CardContent className='w-full p-0'>
        <Form {...form}>
          <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
            <AuthFields form={form} isPending={isPending} isReg={false} />
            <Button
              variant='default'
              className='w-full'
              type='submit'
              disabled={isPending}
            >
              {isPending ? t('loading') : t('login_button')}
            </Button>
          </form>
        </Form>
        <Social />
      </CardContent>
      <CardFooter className='text-muted-foreground mt-4 p-0 text-sm'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-row items-center'>
            {t('dont_have_account')}
            <Link
              href='/auth?register=true'
              className='text-shop-light-primary ml-1 hover:underline'
            >
              {t('register_button')}
            </Link>
          </div>
          <Link
            href='/forgot-password'
            className='text-shop-light-primary flex items-center justify-center hover:underline'
          >
            {t('forgot_password')}
          </Link>
        </div>
      </CardFooter>
    </>
  );
}
