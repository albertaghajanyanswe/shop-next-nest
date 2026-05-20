'use client';

import { useSearchParams } from 'next/navigation';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './authForms/LoginForm';
import { RegisterForm } from './authForms/RegisterForm';

export default function Auth() {
  const searchParams = useSearchParams();
  const isRegister = searchParams.get('register') === 'true';

  return (
    <AuthLayout>{isRegister ? <RegisterForm /> : <LoginForm />}</AuthLayout>
  );
}
