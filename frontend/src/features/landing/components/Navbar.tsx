import React from 'react';
import Link from 'next/link';
import './landing.css';

export default function Navbar() {
  return (
    <nav className="nav-container">
      <div className="nav-logo">Keep<span>UnB</span></div>
      <ul className="nav-links">
        <li><a href="#features">Funcionalidades</a></li>
      </ul>
      <Link href="/login" className="nav-cta">Começar agora</Link>
    </nav>
  );
}
