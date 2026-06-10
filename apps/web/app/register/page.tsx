"use client";

import React from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto justify-center">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-6">
        <h1 className="text-3xl font-black text-red-500 tracking-tighter">REGISTER</h1>
        <p className="text-sm text-slate-400">Registration is currently not required for local play.</p>
        <Link 
          href="/" 
          className="block w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all text-center"
        >
          Go to Game
        </Link>
      </div>
    </main>
  );
}
