'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { PROOF_CARDS, COLOR_MAP } from '@/lib/proofConfig';
import ProofModal from './ProofModal';
import { ProofCard } from '@/types';

export default function ProofGrid() {
  const [selectedCard, setSelectedCard] = useState<ProofCard | null>(null);

  return (
    <section id="proofs" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stellar-purple/30 bg-stellar-purple/5 text-stellar-purple text-xs font-mono mb-4">
            <Shield className="w-3 h-3" />
            ZERO KNOWLEDGE PROOFS
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-stellar-purple to-stellar-cyan">Proof Type</span>
          </h2>
          <p className="text-stellar-muted max-w-xl mx-auto">
            Select a compliance proof to generate. Your private data never leaves your browser.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROOF_CARDS.map((card, i) => {
            const colors = COLOR_MAP[card.color];
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedCard(card)}
                className={`proof-card rounded-2xl p-6 cursor-pointer ${colors.border} ${colors.hover} ${colors.glow} transition-all duration-300`}
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{card.icon}</span>
                  <span className={`text-xs font-mono px-2 py-1 rounded-full border ${colors.badge}`}>
                    ZK PROOF
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-stellar-muted leading-relaxed mb-4">{card.description}</p>

                {/* Fields preview */}
                <div className="space-y-1 mb-6">
                  {card.fields.map(f => (
                    <div key={f.key} className="flex items-center gap-2 text-xs text-stellar-muted font-mono">
                      <div className={`w-1 h-1 rounded-full ${colors.icon.replace('text-', 'bg-')}`} />
                      {f.label}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition-all ${colors.button}`}>
                  Generate Proof →
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedCard && (
        <ProofModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </section>
  );
}
