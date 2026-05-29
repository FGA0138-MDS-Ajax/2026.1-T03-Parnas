// page.tsx — Página de login. TODO: Implementar.
export default function LoginPage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Senha"
        />

        <button>
          Entrar
        </button>
      </div>
    </main>
  );
}