import { AuthLayout } from '../auth/AuthLayout';
import { ForgotPasswordForm } from '../auth/authForms/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
