// layout.tsx — Layout do Administrador. TODO: Implementar.
'use client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex' }}>
      {/*barra lateral*/}
      <aside style={{ width: '250px', background: '#eee', padding: '1rem' }}>
        <h3>Menu Admin</h3>
      </aside>
      
      <main style={{ flex: 1, padding: '1rem' }}>
        {children} 
      </main>
    </div>
  );
}