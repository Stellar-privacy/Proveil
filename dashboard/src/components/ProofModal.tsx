'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, CheckCircle, Copy, ExternalLink, Loader2, Lock, Shield, X } from 'lucide-react';
import { StrKey } from '@stellar/stellar-sdk';
import { ProofCard, ProofResponse } from '@/types';
import { generateProof } from '@/lib/api';

interface ProofModalProps { card: ProofCard; onClose: () => void; }
type Step = 'input' | 'generating' | 'success' | 'error';

const STAGES = ['Input', 'Prove', 'Verify', 'Attest'];

export default function ProofModal({ card, onClose }: ProofModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>('input');
  const [walletAddress, setWalletAddress] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ProofResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])') ?? []);
    focusable()[0]?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const setField = (key: string, value: string) => setFieldValues(previous => ({ ...previous, [key]: value }));
  const setDate = (key: string, value: string) => setField(key, value ? String(Math.floor(new Date(value).getTime() / 1000)) : '');
  const isFormValid = StrKey.isValidEd25519PublicKey(walletAddress) && card.fields.every(field => fieldValues[field.key]);

  const submit = async () => {
    setStep('generating');
    try {
      const response = await generateProof({ proofType: card.id, walletAddress, data: fieldValues });
      setResult(response);
      setStep(response.success ? 'success' : 'error');
    } catch (error: unknown) {
      setResult({ success: false, error: error instanceof Error ? error.message : 'Proof generation failed' });
      setStep('error');
    }
  };

  const copyHash = async () => {
    if (!result?.txHash) return;
    await navigator.clipboard.writeText(result.txHash);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="proof-dialog-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={event => event.target === event.currentTarget && onClose()}
      >
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 20, scale: .98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: .98 }}
          className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-ink-700 bg-ink-900 shadow-2xl sm:rounded-2xl"
        >
          <header className="sticky top-0 z-10 border-b border-ink-700 bg-ink-900/95 px-5 py-4 backdrop-blur-md sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl text-patina-300">{card.icon}</span>
                <div>
                  <h2 id="proof-dialog-title" className="text-base font-semibold text-zinc-100">{card.title}</h2>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[.16em] text-zinc-600">{card.id}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="btn-ghost grid h-8 w-8 place-items-center rounded-lg" aria-label="Close proof module"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-1">
              {STAGES.map((stage, index) => {
                const active = step === 'input' ? index === 0 : step === 'generating' ? index <= 2 : step === 'success' ? true : index === 0;
                return <div key={stage}><div className={`h-px ${active ? 'bg-patina-400' : 'bg-ink-700'}`} /><p className={`mt-2 font-mono text-[8px] uppercase tracking-[.14em] ${active ? 'text-zinc-300' : 'text-zinc-600'}`}>{stage}</p></div>;
              })}
            </div>
          </header>

          <div className="p-5 sm:p-6">
            {step === 'input' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div><label className="label" htmlFor="proof-wallet">Stellar wallet address</label><input id="proof-wallet" type="text" value={walletAddress} onChange={event => setWalletAddress(event.target.value)} placeholder="GABC...XYZ (56 characters)" className="input input-mono" /></div>
                 {(['private', 'public'] as const).map(visibility => {
                   const fields = card.fields.filter(field => field.visibility === visibility);
                   if (!fields.length) return null;
                   return (
                     <div key={visibility} className="space-y-4">
                       <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-ink-700" /><span className="font-mono text-[9px] uppercase tracking-[.16em] text-zinc-600">{visibility} inputs</span><span className="h-px flex-1 bg-ink-700" /></div>
                       {visibility === 'public' && <p className="text-[11px] leading-relaxed text-amber-300/80">Testnet demo: public policy parameters are editable here. Production integrations should supply them from a trusted verifier.</p>}
                       {fields.map(field => (
                         <div key={field.key}>
                           <label className="label flex items-center gap-1.5" htmlFor={`proof-${field.key}`}>{field.visibility === 'private' ? <Lock className="h-3 w-3" /> : <span className="text-[9px] text-patina-300">PUB</span>} {field.label}</label>
                           <input id={`proof-${field.key}`} type={field.type === 'date' ? 'date' : 'text'} placeholder={field.placeholder} onChange={event => field.type === 'date' ? setDate(field.key, event.target.value) : setField(field.key, event.target.value)} className="input input-mono" />
                           {field.hint && <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-600">{field.hint}</p>}
                         </div>
                       ))}
                     </div>
                   );
                 })}
                 <div className="flex gap-3 rounded-xl border border-patina-500/20 bg-patina-500/10 p-3.5"><Shield className="mt-0.5 h-4 w-4 shrink-0 text-patina-300" /><p className="text-[11px] leading-relaxed text-zinc-400">Private evidence is sent to the proof service for computation. Public parameters become part of the proof signals and attestation context.</p></div>
                <div className="flex items-center justify-between pt-2"><span className="font-mono text-[9px] uppercase tracking-[.14em] text-zinc-600">Estimated 15–30 seconds</span><button type="button" onClick={submit} disabled={!isFormValid} className="btn btn-primary px-5 py-3">Generate proof</button></div>
              </motion.div>
            )}

            {step === 'generating' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-patina-500/30 bg-patina-500/10"><Loader2 className="h-6 w-6 animate-spin text-patina-300" /></div>
                <div className="mt-5 text-center"><p className="font-display text-lg font-semibold text-zinc-100">Constructing proof</p><p className="mt-1 text-xs text-zinc-500">Witness generation and verification are in progress.</p></div>
                <div className="mx-auto mt-8 max-w-sm space-y-2">
                  {['Computing circuit witness', 'Generating Groth16 proof', 'Verifying proof', 'Submitting Stellar attestation'].map((stage, index) => <div key={stage} className="flex items-center gap-3 border-b border-ink-800 py-2.5 text-xs text-zinc-500"><span className="font-mono text-[9px] text-patina-300">0{index + 1}</span>{stage}</div>)}
                </div>
              </motion.div>
            )}

            {step === 'success' && result && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center"><CheckCircle className="mx-auto h-9 w-9 text-emerald-300" /><p className="mt-3 font-display font-semibold text-zinc-100">Attestation recorded</p><p className="mt-1 text-xs text-zinc-500">Proof verified on Stellar testnet.</p></div>
                {result.publicSignals && <div className="rounded-xl border border-ink-700 bg-ink-950/50 p-4"><p className="coord-label">Public signals</p><div className="mt-3 space-y-1">{result.publicSignals.map((signal, index) => <p key={index} className="break-all font-mono text-[10px] text-emerald-300">[{index}] {signal}</p>)}</div></div>}
                {result.txHash && <div className="rounded-xl border border-ink-700 bg-ink-950/50 p-4"><div className="flex items-center justify-between"><p className="coord-label">Transaction hash</p><div className="flex gap-3"><button type="button" onClick={copyHash} className="text-zinc-500 hover:text-spectral" aria-label="Copy transaction hash">{copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}</button><a href={`https://stellar.expert/explorer/testnet/tx/${result.txHash}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-spectral" aria-label="View transaction"><ExternalLink className="h-3.5 w-3.5" /></a></div></div><p className="mt-3 break-all font-mono text-[10px] leading-relaxed text-zinc-300">{result.txHash}</p></div>}
                <button type="button" onClick={onClose} className="btn btn-outline w-full py-3">Close receipt</button>
              </motion.div>
            )}

            {step === 'error' && result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-5 text-center"><AlertCircle className="mx-auto h-10 w-10 text-red-300" /><p className="mt-3 font-display font-semibold text-zinc-100">Proof generation failed</p><p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-red-300">{result.error}</p><button type="button" onClick={() => setStep('input')} className="btn btn-primary mt-6">Return to inputs</button></motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
