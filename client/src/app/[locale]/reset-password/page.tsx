import { Metadata } from 'next';
import { SITE_NAME } from '@/utils/constants';
import { AuthLayout } from '../auth/AuthLayout';
import { ResetPasswordForm } from '../auth/authForms/ResetPasswordForm';

export const metadata: Metadata = {
  title: `Reset Password | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
