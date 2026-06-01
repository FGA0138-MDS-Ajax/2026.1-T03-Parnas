import React from 'react';
import Navbar from '@/features/landing/components/Navbar';
import Hero from '@/features/landing/components/Hero';
import Features from '@/features/landing/components/Features';
import Footer from '@/features/landing/components/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </>
  );
}
