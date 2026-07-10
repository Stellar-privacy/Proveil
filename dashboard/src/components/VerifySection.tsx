'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { checkVerification } from '@/lib/api';
import { ProofType } from '@/types';
import { PROOF_CARDS } from '@/lib/proofConfig';

export default function VerifySection() {
  const [wallet, setWallet] = useState('');
  const [proofType, setProofType] = useState<ProofType>('age_over_18');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ verified: boolean } | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!wallet || wallet.length !== 56) {
      setError('Enter a valid 56-character Stellar address');
      return;
    }
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await checkVerification(wallet, proofType);
      setResult({ verified: res.verified });
    } catch {
      setError('Failed to check verification status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="verify" className="py-24 px-6 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-stellar-purple/3 to-transparent pointer-events-none" />

      <div className="max-w-2xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stellar-cyan/30 bg-stellar-cyan/5 text-stellar-cyan text-xs font-mono mb-4">
            <Search className="w-3 h-3" />
            ON-CHAIN VERIFICATION
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-stellar-cyan to-stellar-purple">On-Chain Status</span>
          </h2>
          <p className="text-stellar-muted">
            Check if any Stellar wallet holds a valid ZK compliance attestation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 glow-border space-y-6"
        >
          {/* Wallet input */}
          <div>
            <label className="block text-sm font-medium text-stellar-text mb-2">Stellar Wallet Address</label>
            <input
              type="text"
              value={wallet}
              onChange={e => setWallet(e.target.value)}
              placeholder="GABC...XYZ"
              className="w-full px-4 py-3 bg-stellar-black border border-stellar-border rounded-xl text-stellar-text placeholder-stellar-muted focus:outline-none focus:border-stellar-cyan/60 font-mono text-sm transition-colors"
            />
          </div>

          {/* Proof type selector */}
          <div>
            <label className="block text-sm font-medium text-stellar-text mb-2">Proof Type</label>
            <select
              value={proofType}
              onChange={e => setProofType(e.target.value as ProofType)}
              className="w-full px-4 py-3 bg-stellar-black border border-stellar-border rounded-xl text-stellar-text focus:outline-none focus:border-stellar-cyan/60 font-mono text-sm transition-colors"
            >
              {PROOF_CARDS.map(card => (
                <option key={card.id} value={card.id}>
                  {card.icon} {card.title}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-stellar-red font-mono">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-4 bg-stellar-cyan hover:bg-cyan-500 text-stellar-black font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Checking...</>
            ) : (
              <><Search className="w-5 h-5" /> Check Verification</>
            )}
          </button>

          {/* Result */}
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-xl border flex flex-col items-center gap-3 text-center ${
                result.verified
                  ? 'bg-stellar-green/5 border-stellar-green/30'
                  : 'bg-stellar-red/5 border-stellar-red/30'
              }`}
            >
              {result.verified ? (
                <>
                  <CheckCircle className="w-12 h-12 text-stellar-green" />
                  <p className="text-white font-bold">Verification Active</p>
                  <p className="text-sm text-stellar-muted">
                    This wallet holds a valid {proofType.replace(/_/g, ' ')} attestation on Stellar testnet.
                  </p>
                  <a
                    href={`https://stellar.expert/explorer/testnet/account/${wallet}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-stellar-cyan hover:underline font-mono"
                  >
                    View on Stellar Expert <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 text-stellar-red" />
                  <p className="text-white font-bold">Not Verified</p>
                  <p className="text-sm text-stellar-muted">
                    No active {proofType.replace(/_/g, ' ')} attestation found for this wallet.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
