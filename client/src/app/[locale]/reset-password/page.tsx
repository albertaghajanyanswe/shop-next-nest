import { AuthLayout } from '../auth/AuthLayout';
import { ResetPasswordForm } from '../auth/authForms/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
