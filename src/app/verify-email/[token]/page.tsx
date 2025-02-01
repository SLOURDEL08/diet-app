// app/verify-email/page.tsx
import EmailVerification from '@/components/EmailVerification';

export const metadata = {
  title: 'Vérification Email',
};

export default function VerifyEmailPage() {
  return <EmailVerification />;
}