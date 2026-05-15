"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-[#7A0019] p-2 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-[#FFD700]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#7A0019]">TVK <span className="text-slate-800">Verify</span></span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="outline" className="border-[#7A0019] text-[#7A0019]">Admin Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
