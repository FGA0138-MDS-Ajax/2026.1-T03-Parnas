'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { getStoredToken } from '../services/apiClient';
import { authService, getDefaultRouteForRole, saveAuthUser } from '../services/authService';
import type { UserRole } from '../types/auth';

interface AuthGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const allowedRolesKey = allowedRoles.join('|');

  useEffect(() => {
    let active = true;

    const validateAccess = async () => {
      const token = getStoredToken();

      if (!token) {
        if (active) {
          router.replace('/login');
        }
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        saveAuthUser(user);

        if (!allowedRolesKey.split('|').includes(user.role)) {
          if (active) {
            // Redirect to default route for the user's role instead of showing error
            router.replace(getDefaultRouteForRole(user.role));
          }
          return;
        }

        // Validação adicional de PIN para administradores
        if (user.role === 'ADMIN') {
          const isPinVerified = sessionStorage.getItem('keepunb_admin_pin_verified') === 'true';
          if (pathname !== '/admin/pin') {
            if (!isPinVerified) {
              if (active) {
                router.replace('/admin/pin');
              }
              return;
            }
          } else {
            // Se o PIN já estiver verificado e o admin tentar acessar a página de PIN, redireciona para a página inicial
            if (isPinVerified) {
              if (active) {
                router.replace('/admin/usuarios');
              }
              return;
            }
          }
        }

        if (active) {
          setIsAllowed(true);
          setLoading(false);
        }
      } catch (error: any) {
        // Check if it's an API error with status code
        if (error.status === 401) {
          authService.logout();
          if (active) {
            router.replace('/login');
          }
        } else if (error.status === 403) {
          if (active) {
            router.replace('/forbidden');
          }
        } else {
          // For other errors, redirect to login
          authService.logout();
          if (active) {
            router.replace('/login');
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void validateAccess();

    return () => {
      active = false;
    };
  }, [allowedRolesKey, router, pathname]);

  if (loading) {
    return (
      <div className="error-container">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B7A3A]"></div>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
