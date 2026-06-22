// layout.tsx — Layout do Administrador. TODO: Implementar.
'use client';

import { usePathname } from 'next/navigation';
import AuthGuard from '../../features/shared/components/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPinPage = pathname === '/admin/pin';

  if (isPinPage) {
    return (
      <AuthGuard allowedRoles={['ADMIN']}>
        {children}
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={['ADMIN']}>
    <div style={{ display: 'flex' }}>
      {/*barra lateral*/}
      <aside style={{ width: '250px', background: '#eee', padding: '1rem' }}>
        <h3>Menu Admin</h3>
      </aside>
      
      <main style={{ flex: 1, padding: '1rem' }}>
        {children} 
      </main>
    </div>
    </AuthGuard>
  );
}
