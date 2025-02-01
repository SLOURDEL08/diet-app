'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (

      <div className="h-screen flex  bg-white dark:bg-gray-900">
        {/* Navbar avec gestion de l'état */}
        <div 
          onMouseEnter={() => setIsNavExpanded(true)}
          onMouseLeave={() => setIsNavExpanded(false)}
          className="h-screen flex-none"
        >
          <NavBar isExpanded={isNavExpanded} />
        </div>

        {/* Main Content avec transition */}
        <main className={`flex-1 min-h-screen relative transition-all duration-300 ease-in-out
          ${isNavExpanded ? 'ml-56' : 'ml-20'}`}
        >

          <div className="h-full ">
            {children}
          </div>
        </main>
      </div>

  );
}