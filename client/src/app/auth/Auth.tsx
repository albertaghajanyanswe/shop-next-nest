'use client';

import { useState } from 'react';
import { useAuthForm } from './useAuthForm';
import Image from 'next/image';
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
import Link from 'next/link';
import { PUBLIC_URL } from '@/config/url.config';
import { Logo } from '@/components/layouts/mainLayout/header/logo/Logo';

export default function Auth() {
  const [isReg, setIsReg] = useState(false);
  const { form, onSubmit, isPending } = useAuthForm(isReg);

  return (
    <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
      <div
        className={`hidden lg:flex relative flex-col items-center justify-center overflow-hidden border-none bg-white bg-gradient-to-r from-emerald-200 to-lime-100 p-6 shadow-none`}
      >
        <h1 className='max-w-[80%] text-center text-3xl'>
          Your smart shopping starts here...
        </h1>

        <p className='mt-6 text-center text-md text-neutral-700'>
          Discover quality products, trusted brands, and great deals — all in
          one place. Enjoy a smooth shopping experience, clear pricing, and
          carefully selected items for everyday life.
        </p>
      </div>
      {/* <div className='bg-primary-50 hidden h-full items-center justify-center lg:flex'>
        <Image
          src={'/images/myStore_logo.svg'}
          alt='auth'
          width={450}
          height={450}
        />
      </div> */}
      <div className='flex h-full flex-col items-center justify-center'>
        <Card className='flex w-[500px] flex-col items-center justify-center border-none bg-white shadow-none'>
          <Logo classNames='sm:text-4xl' />

          <CardHeader className='flex w-full flex-col items-center justify-center pb-5'>
            <CardTitle className='text-primary-700 pb-1 text-center text-xl font-semibold'>
              {isReg
                ? 'Join us to create and manage your online stores.'
                : 'Welcome Back!'}
            </CardTitle>
            <CardDescription className='text-muted-foreground text-center'>
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
              className='text-primary-700 ml-1'
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
