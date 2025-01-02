// src/components/RoleRoute.tsx

'use client';

import React, { useContext, useEffect } from 'react';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
      // Redirect to unauthorized page or dashboard
      router.push('/unauthorized');
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default RoleRoute;
