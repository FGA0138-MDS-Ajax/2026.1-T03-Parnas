'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getStoredToken } from '../services/apiClient';
import { authService, getDefaultRouteForRole, saveAuthUser } from '../services/authService';
import type { UserRole } from '../types/auth';

interface AuthGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const allowedRolesKey = allowedRoles.join('|');

  useEffect(() => {
    let active = true;

    const validateAccess = async () => {
      const token = getStoredToken();

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        saveAuthUser(user);

        if (!allowedRolesKey.split('|').includes(user.role)) {
          router.replace(getDefaultRouteForRole(user.role));
          return;
        }

        if (active) {
          setIsAllowed(true);
        }
      } catch {
        authService.logout();
        router.replace('/login');
      }
    };

    void validateAccess();

    return () => {
      active = false;
    };
  }, [allowedRolesKey, router]);

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
