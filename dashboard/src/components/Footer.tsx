import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-stellar-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-stellar-purple" />
          <span className="font-bold text-white">Pro<span className="text-stellar-purple">Veil</span></span>
          <span className="text-stellar-muted text-sm">· ZK Compliance on Stellar</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs font-mono text-stellar-muted">CONTRACT</p>
          <p className="text-xs font-mono text-stellar-text">
            CDA7HN45XE3EDAJJZQ4HBYM5E6G6SYIJZJIRPKQSMBLTDQAAXNEK76VQ
          </p>
        </div>

        <div className="text-xs text-stellar-muted text-center">
          Built with Circom · SnarkJS · Soroban
          <br />
          <span className="text-stellar-purple">Stellar Hacks: ZK 2026</span>
        </div>
      </div>
    </footer>
  );
}
