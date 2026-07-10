'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Loader2, CheckCircle, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { ProofCard, ProofResponse } from '@/types';
import { generateProof } from '@/lib/api';
import { COLOR_MAP } from '@/lib/proofConfig';

interface ProofModalProps {
  card: ProofCard;
  onClose: () => void;
}

type Step = 'input' | 'generating' | 'success' | 'error';

export default function ProofModal({ card, onClose }: ProofModalProps) {
  const [step, setStep] = useState<Step>('input');
  const [walletAddress, setWalletAddress] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ProofResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const colors = COLOR_MAP[card.color];

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (key: string, value: string) => {
    // Convert date string to Unix timestamp
    if (value) {
      const ts = Math.floor(new Date(value).getTime() / 1000);
      setFieldValues(prev => ({ ...prev, [key]: String(ts) }));
    }
  };

  const handleSubmit = async () => {
    setStep('generating');
    try {
      const response = await generateProof({
        proofType: card.id,
        walletAddress,
        data: fieldValues,
      });
      setResult(response);
      setStep(response.success ? 'success' : 'error');
    } catch (err: any) {
      setResult({ success: false, error: err.message });
      setStep('error');
    }
  };

  const copyTxHash = () => {
    if (result?.txHash) {
      navigator.clipboard.writeText(result.txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid = walletAddress.startsWith('G') &&
    walletAddress.length === 56 &&
    card.fields.every(f => fieldValues[f.key]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-stellar-dark border border-stellar-border rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 0 60px rgba(123,47,255,0.2)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stellar-border">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{card.icon}</span>
              <div>
                <h2 className="text-lg font-bold text-white">{card.title}</h2>
                <p className="text-xs text-stellar-muted font-mono">{card.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stellar-border rounded-lg transition-colors text-stellar-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'input' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Wallet input */}
                <div>
                  <label className="block text-sm font-medium text-stellar-text mb-1.5">
                    Stellar Wallet Address
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={e => setWalletAddress(e.target.value)}
                    placeholder="GABC...XYZ (56 characters)"
                    className="w-full px-4 py-3 bg-stellar-black border border-stellar-border rounded-xl text-stellar-text placeholder-stellar-muted focus:outline-none focus:border-stellar-purple/60 font-mono text-sm transition-colors"
                  />
                </div>

                {/* Dynamic fields */}
                {card.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-stellar-text mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type === 'date' ? 'date' : 'text'}
                      placeholder={field.placeholder}
                      onChange={e =>
                        field.type === 'date'
                          ? handleDateChange(field.key, e.target.value)
                          : handleFieldChange(field.key, e.target.value)
                      }
                      className="w-full px-4 py-3 bg-stellar-black border border-stellar-border rounded-xl text-stellar-text placeholder-stellar-muted focus:outline-none focus:border-stellar-purple/60 font-mono text-sm transition-colors"
                    />
                    {field.hint && (
                      <p className="mt-1 text-xs text-stellar-muted">{field.hint}</p>
                    )}
                  </div>
                ))}

                {/* Privacy note */}
                <div className="flex gap-2 p-3 rounded-lg bg-stellar-purple/5 border border-stellar-purple/20">
                  <Shield className="w-4 h-4 text-stellar-purple shrink-0 mt-0.5" />
                  <p className="text-xs text-stellar-muted">
                    Your private inputs never leave your browser. Only the ZK proof and public signals are sent to the API.
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                    isFormValid
                      ? `${colors.button} hover:shadow-[0_0_20px_rgba(123,47,255,0.4)]`
                      : 'bg-stellar-border cursor-not-allowed text-stellar-muted'
                  }`}
                >
                  Generate ZK Proof
                </button>
              </motion.div>
            )}

            {step === 'generating' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center gap-6 text-center"
              >
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-stellar-purple animate-spin" />
                  <div className="absolute inset-0 text-stellar-purple opacity-30 blur-md">
                    <Loader2 className="w-16 h-16 animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-semibold mb-2">Generating ZK Proof</p>
                  <p className="text-sm text-stellar-muted font-mono">
                    Running Groth16 circuit witness generation...
                  </p>
                </div>
                <div className="w-full space-y-2">
                  {['Computing witness', 'Generating Groth16 proof', 'Verifying locally', 'Attesting on Stellar'].map((s, i) => (
                    <div key={s} className="flex items-center gap-3 text-xs font-mono text-stellar-muted">
                      <Loader2 className="w-3 h-3 animate-spin text-stellar-purple shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
                      {s}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'success' && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <CheckCircle className="w-16 h-16 text-stellar-green" />
                  <div>
                    <p className="text-white font-bold text-lg">Proof Verified!</p>
                    <p className="text-sm text-stellar-muted">Successfully attested on Stellar testnet</p>
                  </div>
                </div>

                {/* Public signals */}
                {result.publicSignals && (
                  <div className="p-3 rounded-lg bg-stellar-black border border-stellar-border">
                    <p className="text-xs text-stellar-muted font-mono mb-2">PUBLIC SIGNALS</p>
                    {result.publicSignals.map((sig, i) => (
                      <div key={i} className="text-xs font-mono text-stellar-green">
                        [{i}] {sig}
                      </div>
                    ))}
                  </div>
                )}

                {/* Tx hash */}
                {result.txHash && (
                  <div className="p-3 rounded-lg bg-stellar-black border border-stellar-border">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-stellar-muted font-mono">TX HASH</p>
                      <div className="flex gap-2">
                        <button onClick={copyTxHash} className="text-stellar-muted hover:text-white transition-colors">
                          {copied ? <Check className="w-3 h-3 text-stellar-green" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${result.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stellar-muted hover:text-stellar-purple transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <p className="text-xs font-mono text-stellar-text break-all">{result.txHash}</p>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border border-stellar-border text-stellar-muted hover:text-white hover:border-stellar-purple/50 transition-all font-medium"
                >
                  Close
                </button>
              </motion.div>
            )}

            {step === 'error' && result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <AlertCircle className="w-16 h-16 text-stellar-red" />
                  <div>
                    <p className="text-white font-bold text-lg">Proof Failed</p>
                    <p className="text-sm text-stellar-red">{result.error}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep('input')}
                  className="w-full py-3 rounded-xl bg-stellar-purple hover:bg-purple-600 text-white font-medium transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
