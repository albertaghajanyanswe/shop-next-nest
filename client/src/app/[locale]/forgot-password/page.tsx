import { Metadata } from 'next';
import { SITE_NAME } from '@/utils/constants';
import { AuthLayout } from '../auth/AuthLayout';
import { ForgotPasswordForm } from '../auth/authForms/ForgotPasswordForm';

export const metadata: Metadata = {
  title: `Forgot Password | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
