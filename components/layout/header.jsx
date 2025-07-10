"use client";

import Link from "next/link";
import { Menu, Users } from "lucide-react";
import { useState } from "react";
import { GlowButton } from "@/components/ui/glow-button";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/30 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-white tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                YouTrait
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-white font-medium">
            <Link href="/dashboard" className="hover:text-pink-400 transition">
              Explore My Traits
            </Link>
            <Link href="/about" className="hover:text-pink-400 transition">
              About
            </Link>
            <Link href="/faq" className="hover:text-pink-400 transition">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-pink-400 transition">
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex">
            <Link href="/auth">
              <GlowButton size="sm" className="group">
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Get My Trait Cloud
              </GlowButton>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/80 text-white px-4 pb-4 space-y-3">
          <Link href="/explore" onClick={() => setOpen(false)}>
            Explore My Traits
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/faq" onClick={() => setOpen(false)}>
            FAQ
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <GlowButton size="sm" className="w-full justify-center">
              <Users className="w-4 h-4" />
              Get My Trait Cloud
            </GlowButton>
          </Link>
        </div>
      )}
    </header>
  );
}
