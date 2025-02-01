import { useSession, signIn, signOut } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

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