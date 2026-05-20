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
import { CheckCircle2 } from 'lucide-react';
import { useGetPlans } from '@/hooks/stripe/useGetPlans';

export function RegisterForm() {
  const t = useTranslations('Auth');
  const { form, onSubmit, isPending } = useAuthForm(true);
  const { plans, isLoadingPlans } = useGetPlans();
  const free = plans?.find((i) => i.planId === 'FREE');

  return (
    <>
      <CardHeader className='flex w-full flex-col items-center justify-center pb-5'>
        <CardTitle className='text-shop-muted-text-7 pb-1 text-center text-xl font-semibold'>
          {t('register_title')}
        </CardTitle>
        <CardDescription className='text-shop-muted-text-6 text-center'>
          {t('register_description')}
        </CardDescription>
      </CardHeader>
      <CardContent className='w-full p-0'>
        <Form {...form}>
          <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
            <AuthFields form={form} isPending={isPending} isReg={true} />
            {!isLoadingPlans && (
              <div className='card-linear-grad space-y-2 rounded-xl p-3'>
                {free?.features.map((perk) => (
                  <div
                    key={perk}
                    className='flex items-center gap-2 text-sm font-medium text-white'
                  >
                    <CheckCircle2 className='size-5 shrink-0 text-white' />
                    {perk}
                  </div>
                ))}
              </div>
            )}
            <Button
              variant='default'
              className='w-full'
              type='submit'
              disabled={isPending}
            >
              {isPending ? t('loading') : t('register_button')}
            </Button>
          </form>
        </Form>
        <Social />
      </CardContent>
      <CardFooter className='text-muted-foreground mt-4 p-0 text-sm'>
        <div className='flex flex-row items-center'>
          {t('already_have_account')}
          <Link
            href='/auth'
            className='text-shop-light-primary ml-1 hover:underline'
          >
            {t('login_button')}
          </Link>
        </div>
      </CardFooter>
    </>
  );
}
