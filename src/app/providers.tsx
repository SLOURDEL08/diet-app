'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { StoreProvider } from '@/providers/StoreProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <AuthProvider>
        <StoreProvider>
          {children}
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}