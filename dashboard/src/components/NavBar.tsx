'use client';
import { Shield, Zap, GitBranch } from 'lucide-react';

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-stellar-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="w-8 h-8 text-stellar-purple" />
            <div className="absolute inset-0 text-stellar-purple opacity-50 blur-sm">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              Pro<span className="text-stellar-purple glow-text">Veil</span>
            </span>
            <div className="text-[10px] text-stellar-muted font-mono tracking-widest uppercase">
              ZK Compliance Protocol
            </div>
          </div>
        </div>

        {/* Center status */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border border-stellar-green/30 bg-stellar-green/5">
          <div className="w-2 h-2 rounded-full bg-stellar-green animate-pulse" />
          <span className="text-xs font-mono text-stellar-green">TESTNET LIVE</span>
          <Zap className="w-3 h-3 text-stellar-green" />
        </div>

        {/* Right links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Stellar-P/Proveil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-stellar-muted hover:text-white transition-colors text-sm"
          >
            <GitBranch className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <div className="text-xs font-mono text-stellar-muted border border-stellar-border rounded px-2 py-1">
            Groth16 · BN254
          </div>
        </div>
      </div>
    </nav>
  );
}
