import React from 'react';
import Link from 'next/link';
import './landing.css';

export default function Navbar() {
  return (
    <nav className="nav-container">
      <div className="nav-logo">
        <img src="/keep-unb-ln.png" alt="KeepUnB Logo" className="logo-img" />
      </div>
      <div className="nav-right">
        <a href="#features" className="nav-link-item">Funcionalidades</a>
        <Link href="/login" className="nav-cta">Login</Link>
      </div>
    </nav>
  );
}
