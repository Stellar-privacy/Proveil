'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink, Loader2, Search, XCircle } from 'lucide-react';
import { StrKey } from '@stellar/stellar-sdk';
import { checkVerification } from '@/lib/api';
import { ProofType } from '@/types';
import { PROOF_CARDS } from '@/lib/proofConfig';

export default function VerifySection() {
  const [wallet, setWallet] = useState('');
  const [proofType, setProofType] = useState<ProofType>('age_over_18');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ verified: boolean } | null>(null);
  const [error, setError] = useState('');

  const verify = async () => {
    if (!StrKey.isValidEd25519PublicKey(wallet)) { setError('Enter a valid Stellar public key'); return; }
    setLoading(true); setResult(null); setError('');
    try { const response = await checkVerification(wallet, proofType); setResult({ verified: response.verified }); }
    catch { setError('Unable to query the verification record'); }
    finally { setLoading(false); }
  };

  return (
    <section id="verify" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="cream-panel grain rounded-[1.5rem] p-6 shadow-xl sm:p-10 md:p-14">
          <div className="grid gap-10 md:grid-cols-[.85fr_1.15fr] md:gap-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#1b1610]/50">03 / Public audit</p>
              <h2 className="mt-5 text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.02] text-[#1b1610]">Query an attestation.</h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#1b1610]/60">Read the Soroban verifier state for any Stellar wallet and supported proof type.</p>
              <div className="mt-8 space-y-3 border-t border-[#1b1610]/10 pt-6 font-mono text-[10px] text-[#1b1610]/50">
                <div className="flex justify-between gap-4"><span>NETWORK</span><span className="text-[#1b1610]">Stellar Testnet</span></div>
                <div className="flex justify-between gap-4"><span>VALIDITY</span><span className="text-[#1b1610]">30 days</span></div>
                <div className="flex justify-between gap-4"><span>CONTRACT</span><span className="text-[#1b1610]">CDA7...76VQ</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1b1610]/10 bg-[#1b1610] p-5 text-zinc-300 shadow-xl sm:p-6">
              <div><label className="label" htmlFor="verify-wallet">Wallet address</label><input id="verify-wallet" type="text" value={wallet} onChange={event => setWallet(event.target.value)} placeholder="GABC...XYZ" className="input input-mono" /></div>
              <div className="mt-4"><label className="label" htmlFor="verify-type">Proof type</label><select id="verify-type" value={proofType} onChange={event => setProofType(event.target.value as ProofType)} className="input">{PROOF_CARDS.map(card => <option key={card.id} value={card.id}>{card.icon} / {card.title}</option>)}</select></div>
              {error && <p role="alert" className="mt-3 text-xs text-red-300">{error}</p>}
              <button type="button" onClick={verify} disabled={loading} className="btn btn-primary mt-5 w-full py-3">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Querying contract</> : <><Search className="h-4 w-4" /> Check verification</>}</button>

              {result !== null && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 rounded-xl border p-4 ${result.verified ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-red-500/20 bg-red-500/10'}`}>
                  <div className="flex items-start gap-3">{result.verified ? <CheckCircle className="h-5 w-5 shrink-0 text-emerald-300" /> : <XCircle className="h-5 w-5 shrink-0 text-red-300" />}<div><p className="text-sm font-semibold text-zinc-100">{result.verified ? 'Active attestation' : 'No active attestation'}</p><p className="mt-1 text-xs leading-relaxed text-zinc-500">{result.verified ? 'A valid verification record exists for this wallet and proof type.' : 'No valid, unexpired record was returned by the contract.'}</p>{result.verified && <a href={`https://stellar.expert/explorer/testnet/account/${wallet}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-300 hover:underline">Open Stellar Expert <ExternalLink className="h-3 w-3" /></a>}</div></div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
