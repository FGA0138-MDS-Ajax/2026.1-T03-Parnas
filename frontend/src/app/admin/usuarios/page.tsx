// page.tsx — Gestão de Usuários.
'use client';


export default function UsuariosPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#003366' }}>⚙️ Painel do Administrador - KeepUnB</h1>
      <p>Boas Vindas!</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button style={{ padding: '0.5rem 1rem' }}>Gerenciar Usuários</button>
        <button style={{ padding: '0.5rem 1rem' }}>Configurações</button>
      </div>
    </div>
  );
}
