'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Check } from 'lucide-react';
import ProofTranscript from './ProofTranscript';

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-ink-800 px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44">
      <div className="pointer-events-none absolute left-[8%] top-24 h-[28rem] w-[28rem] rounded-full bg-spectral/[0.035] blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.05fr_.95fr] md:gap-16">
        <div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-9 flex items-center gap-3">
            <span className="coord-label">Protocol / Stellar Testnet</span>
            <span className="h-px w-10 bg-ink-600" />
            <span className="font-mono text-[10px] text-patina-300">ZK-01</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .65, delay: .05 }}
            className="display-hd text-[clamp(3.1rem,7.5vw,6.5rem)]"
          >
            Compliance<br />proven.<br />
            <span className="text-spectral/45">Identity concealed.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6, delay: .12 }}
            className="mt-8 max-w-lg text-[15px] leading-relaxed text-zinc-400 sm:text-base"
          >
            Generate cryptographic compliance attestations without publishing the personal data behind them. ProVeil binds zero-knowledge proofs to Stellar wallets through Soroban.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6, delay: .18 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a href="#proofs" className="btn btn-primary px-5 py-3">
              Generate proof <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#verify" className="btn btn-outline px-5 py-3">
              Query attestation <ArrowDownRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .32 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2"
          >
            {['6 production circuits', '30-day attestations', 'Public audit trail'].map(item => (
              <span key={item} className="flex items-center gap-2 text-[11px] text-zinc-500">
                <Check className="h-3 w-3 text-patina-300" /> {item}
              </span>
            ))}
          </motion.div>
        </div>

        <ProofTranscript />
      </div>
    </section>
  );
}
