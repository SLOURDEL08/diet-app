import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/onboarding' });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return {
    session,
    isAuthenticated,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    user: session?.user,
  };
};