'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useOnboardingStore } from '@/store/onboardingStore';
import Loading from '@/components/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({
  children,
  requireOnboarding = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isCompleted, currentStep } = useOnboardingStore();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (requireOnboarding && !isCompleted) {
      router.push(`/onboarding/step-${currentStep}`);
      return;
    }
  }, [session, status, isCompleted, currentStep, router, requireOnboarding]);

  if (status === 'loading') {
    return <Loading />;
  }

  return <>{children}</>;
}