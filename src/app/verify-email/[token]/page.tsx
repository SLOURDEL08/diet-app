// app/verify-email/[token]/page.tsx
import VerifyEmailClient from './VerifyEmailClient';

export default function VerifyEmailPage({ params }: { params: { token: string } }) {
  return <VerifyEmailClient token={params.token} />;
}