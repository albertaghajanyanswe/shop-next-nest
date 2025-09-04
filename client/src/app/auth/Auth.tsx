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
import { Form } from '@/components/ui/form-elements/Form';
import { Button } from '@/components/ui/Button';
import { AuthFields } from './AuthFields';
import { Social } from './Social';
import Link from 'next/link';
import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config';

export default function Auth() {
  const [isReg, setIsReg] = useState(false);
  const { form, onSubmit, isPending } = useAuthForm(isReg);

  return (
    <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
      <div className='bg-primary-100 hidden h-full items-center justify-center lg:flex'>
        <Image
          src={'/images/myStore_logo.svg'}
          alt='auth'
          width={450}
          height={450}
        />
      </div>
      <div className='flex h-full flex-col items-center justify-center'>
        <Card className='flex w-[500px] flex-col items-center justify-center border-none p-6 shadow-none'>
          <Link href={PUBLIC_URL.home()} className='flex items-center gap-2'>
            <Image
              src={'/images/myStore_logo.svg'}
              alt={'auth'}
              width={100}
              height={50}
              className='rounded-full'
            />
          </Link>
          <CardHeader className='flex w-full flex-col items-center justify-center pb-5'>
            <CardTitle className='text-primary-700 pb-1 text-center text-3xl font-bold'>
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

                <Button variant='primary' className='w-full' type='submit' disabled={isPending}>
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
