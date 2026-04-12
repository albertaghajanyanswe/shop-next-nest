'use client';

import { useState } from 'react';
import { useAuthForm } from './useAuthForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Form } from '@/components/ui/formElements/Form';
import { Button } from '@/components/ui/Button';
import { AuthFields } from './AuthFields';
import { Social } from './Social';
import { Logo } from '@/components/layouts/mainLayout/header/logo/Logo';
import { CheckCircle2 } from 'lucide-react';
import { useGetPlans } from '@/hooks/stripe/useGetPlans';

export default function Auth() {
  const [isReg, setIsReg] = useState(false);
  const { form, onSubmit, isPending } = useAuthForm(isReg);
  const { plans, isLoadingPlans } = useGetPlans();
  const free = plans?.find((i) => i.planId === 'FREE');
  return (
    <div className='grid min-h-screen grid-cols-1 p-0 lg:grid-cols-2'>
      <div
        className={`relative hidden flex-col items-center justify-center overflow-hidden border-none bg-shop-white bg-linear-to-r from-primary-100 to-primary-400 dark:from-primary-200 dark:to-primary-600 p-6 shadow-none lg:flex text-neutral-700`}
      >
        <h1 className='max-w-[80%] text-center text-3xl'>
          Your smart shopping starts here...
        </h1>

        <p className='text-md mt-6 text-center text-neutral-600'>
          Discover quality products, trusted brands, and great deals — all in
          one place. Enjoy a smooth shopping experience, clear pricing, and
          carefully selected items for everyday life.
        </p>
      </div>
      <div className='flex h-full flex-col items-center justify-center'>
        <Card className='flex w-full flex-col items-center justify-center gap-4 border-none bg-shop-bg-default p-4 shadow-none sm:w-[500px] sm:p-0'>
          <Logo classNames='sm:text-4xl' />

          <CardHeader className='flex w-full flex-col items-center justify-center pb-5'>
            <CardTitle className='pb-1 text-center text-xl font-semibold text-shop-muted-text-7'>
              {isReg
                ? 'Join us to create and manage your online stores.'
                : 'Welcome Back!'}
            </CardTitle>
            <CardDescription className='text-shop-muted-text-6 text-center'>
              Please login or register to start your store.
            </CardDescription>
          </CardHeader>
          <CardContent className='w-full p-0'>
            <Form {...form}>
              <form
                className='space-y-5'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <AuthFields form={form} isPending={isPending} isReg={isReg} />
                {isReg && !isLoadingPlans && (
                  <div className='space-y-2 rounded-xl bg-linear-to-r from-primary-100 to-primary-400 dark:from-primary-200 dark:to-primary-600 p-3'>
                    {free?.features.map((perk) => (
                      <div
                        key={perk}
                        className='flex items-center gap-2 text-sm font-medium text-primary-600'
                      >
                        <CheckCircle2 className='size-5 shrink-0 text-primary-600' />
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
                  {isPending ? 'Loading...' : isReg ? 'Register' : 'Login'}
                </Button>
              </form>
            </Form>
            <Social />
          </CardContent>
          <CardFooter className='text-muted-foreground mt-4 p-0 text-sm'>
            {isReg ? 'Already have an account?' : "Don't have an account?"}
            <Button
              className='text-shop-light-primary ml-1 p-0'
              variant='link'
              onClick={() => setIsReg(!isReg)}
            >
              {isReg ? 'Login' : 'Register'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
