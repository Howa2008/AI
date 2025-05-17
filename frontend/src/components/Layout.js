import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-grow pb-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
