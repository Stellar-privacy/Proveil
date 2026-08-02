'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Lock } from 'lucide-react';
import { PROOF_CARDS, COLOR_MAP } from '@/lib/proofConfig';
import ProofModal from './ProofModal';
import { ProofCard } from '@/types';

export default function ProofGrid() {
  const [selectedCard, setSelectedCard] = useState<ProofCard | null>(null);

  return (
    <section id="proofs" className="border-b border-ink-800 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="coord-label">02 / Proof library</p>
            <h2 className="mt-5 max-w-xl text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.02] text-spectral">Select a claim. Keep the evidence private.</h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-500">Six Circom circuits for common compliance requirements. Each card exposes the claim, not the data behind it.</p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROOF_CARDS.map((card, index) => {
            const colors = COLOR_MAP[card.color];
            return (
              <motion.button
                type="button"
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * .06 }}
                onClick={() => setSelectedCard(card)}
                className={`group card text-left transition-all duration-200 hover:-translate-y-0.5 ${colors.border} ${colors.hover}`}
              >
                <div className="flex items-start justify-between border-b border-ink-800 p-5">
                  <span className={`font-mono text-2xl font-medium ${colors.icon}`}>{card.icon}</span>
                  <span className={`badge border font-mono uppercase ${colors.badge}`}>Groth16</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-zinc-100">{card.title}</h3>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-spectral" />
                  </div>
                  <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-zinc-500">{card.description}</p>
                  <div className="mt-5 space-y-2 border-t border-ink-800 pt-4">
                    {card.fields.map(field => (
                      <div key={field.key} className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
                        {field.visibility === 'private' ? <Lock className="h-3 w-3 text-zinc-600" /> : <span className="grid h-3 w-3 place-items-center text-[8px] text-patina-300">P</span>} {field.label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-ink-800 pt-4">
                    <span className="font-mono text-[9px] uppercase tracking-[.16em] text-zinc-600">Private + public inputs</span>
                    <span className="text-xs font-medium text-zinc-400 transition-colors group-hover:text-spectral">Open module →</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      {selectedCard && <ProofModal card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </section>
  );
}
