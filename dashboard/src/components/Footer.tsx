import { Shield } from 'lucide-react';

const CONTRACT = 'CDA7HN45XE3EDAJJZQ4HBYM5E6G6SYIJZJIRPKQSMBLTDQAAXNEK76VQ';

export default function Footer() {
  return (
    <footer className="border-t border-ink-800 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div><div className="flex items-center gap-2.5"><Shield className="h-4 w-4 text-spectral" /><span className="font-display text-sm font-semibold text-spectral">PROVEIL</span></div><p className="mt-3 max-w-xs text-xs leading-relaxed text-zinc-600">Privacy-preserving compliance attestations on Stellar.</p></div>
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-14">
            <div><p className="coord-label">Protocol</p><div className="mt-3 flex flex-col gap-2 text-xs text-zinc-500"><a href="#proofs" className="hover:text-spectral">Proof library</a><a href="#protocol" className="hover:text-spectral">How it works</a><a href="#verify" className="hover:text-spectral">Verify</a></div></div>
            <div><p className="coord-label">Resources</p><div className="mt-3 flex flex-col gap-2 text-xs text-zinc-500"><a href="https://github.com/Stellar-privacy/Proveil" target="_blank" rel="noopener noreferrer" className="hover:text-spectral">GitHub</a><a href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT}`} target="_blank" rel="noopener noreferrer" className="hover:text-spectral">Stellar Expert</a></div></div>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-ink-800 pt-5 md:flex-row md:items-center"><p className="break-all font-mono text-[9px] text-zinc-700">CONTRACT / {CONTRACT}</p><p className="font-mono text-[9px] uppercase tracking-[.14em] text-zinc-700">Circom · SnarkJS · Soroban · Stellar</p></div>
      </div>
    </footer>
  );
}
