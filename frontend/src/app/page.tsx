"use client";

import React from "react";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#f8fafc",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "40px 60px",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            margin: "0 0 10px 0",
            background: "linear-gradient(to right, #38bdf8, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.05em",
          }}
        >
          KeepUnB
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#94a3b8",
            margin: "0 0 30px 0",
            lineHeight: "1.6",
          }}
        >
          Gestão de Solicitações de Manutenção — FCTE/UnB
        </p>

        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)",
            margin: "20px 0",
          }}
        />

        <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              textAlign: "left",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#38bdf8", marginBottom: "5px" }}>
              Backend (FastAPI)
            </div>
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
              Pronto para receber conexões na porta 8000. Documentação disponível em{" "}
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#818cf8", textDecoration: "none" }}
              >
                /docs
              </a>.
            </div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              textAlign: "left",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#818cf8", marginBottom: "5px" }}>
              Frontend (Next.js)
            </div>
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
              Esta tela inicial e as rotas dos perfis já estão prontas para desenvolvimento.
            </div>
          </div>
        </div>

        <div style={{ marginTop: "40px", fontSize: "0.8rem", color: "#475569" }}>
          Desenvolvido para FGA0138-MDS-Ajax • 2026.1
        </div>
      </div>
    </main>
  );
}
