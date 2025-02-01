import { Metadata } from 'next';
import VerifyEmailClient from './VerifyEmailClient';

export async function generateMetadata({ 
  params 
}: { 
  params: { token: string } 
}): Promise<Metadata> {
  return {
    title: `Vérification Email - ${params.token.slice(0, 10)}...`
  };
}

export default function VerifyEmailPage({ 
  params 
}: { 
  params: { token: string } 
}) {
  return <VerifyEmailClient token={params.token} />;
}