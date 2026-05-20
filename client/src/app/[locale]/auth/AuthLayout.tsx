'use client';

import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/Card';
import { Logo } from '@/components/layouts/mainLayout/header/logo/Logo';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='grid min-h-screen grid-cols-1 p-0 lg:grid-cols-2'>
      <div
        className={`card-linear-grad dark:card-flame relative hidden flex-col items-center justify-center overflow-hidden border-none bg-linear-to-r p-6 shadow-none lg:flex`}
      >
        <h1 className='font-semobold max-w-[80%] text-center text-3xl text-white'>
          Your smart shopping starts here...
        </h1>

        <p className='text-md font-semobold mt-6 text-center text-neutral-100'>
          Discover quality products, trusted brands, and great deals — all in
          one place. Enjoy a smooth shopping experience, clear pricing, and
          carefully selected items for everyday life.
        </p>
      </div>
      <div className='flex h-full flex-col items-center justify-center'>
        <Card className='bg-shop-bg-default flex w-full flex-col items-center justify-center gap-4 border-none p-4 shadow-none sm:w-[500px] sm:p-0'>
          <Logo classNames='sm:text-4xl' />
          {children}
        </Card>
      </div>
    </div>
  );
}
