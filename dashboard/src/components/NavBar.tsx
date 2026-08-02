'use client';

import { useState } from 'react';
import { GitBranch, Menu, Shield, X } from 'lucide-react';

const LINKS = [
  { label: 'Proofs', href: '#proofs' },
  { label: 'Protocol', href: '#protocol' },
  { label: 'Verify', href: '#verify' },
  { label: 'SDK', href: 'https://github.com/Stellar-privacy/Proveil/tree/main/sdk' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-ink-800 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="ProVeil home">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-spectral/25 bg-spectral/10">
            <Shield className="h-4 w-4 text-spectral" strokeWidth={1.8} />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-spectral">PROVEIL</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map(link => (
            <a key={link.label} href={link.href} className="text-xs font-medium text-zinc-400 transition-colors hover:text-spectral">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] tracking-[0.14em] text-emerald-300">TESTNET LIVE</span>
          </div>
          <a
            href="https://github.com/Stellar-privacy/Proveil"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost grid h-9 w-9 place-items-center rounded-lg"
            aria-label="View ProVeil on GitHub"
          >
            <GitBranch className="h-4 w-4" />
          </a>
          <button
            type="button"
            className="btn-ghost grid h-9 w-9 place-items-center rounded-lg md:hidden"
            onClick={() => setOpen(value => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-800 bg-ink-950 px-5 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col">
            {LINKS.map(link => (
              <a key={link.label} href={link.href} onClick={() => setOpen(false)} className="border-b border-ink-800 py-3 text-sm text-zinc-300 last:border-0">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
