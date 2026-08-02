'use client';

import { motion } from 'framer-motion';
import { Check, Cpu, Globe, Lock } from 'lucide-react';

const STEPS = [
  { number: '01', icon: Lock, title: 'Private evidence', description: 'Sensitive values are sent to the proof service, but excluded from public signals and the Stellar attestation.' },
  { number: '02', icon: Cpu, title: 'Circuit execution', description: 'A Groth16 circuit evaluates the claim against the selected compliance requirement.' },
  { number: '03', icon: Check, title: 'Proof verification', description: 'The proof and its compliance output are checked before any blockchain interaction. Invalid claims do not proceed.' },
  { number: '04', icon: Globe, title: 'Stellar attestation', description: 'A verified result is recorded through Soroban with a 30-day validity window.' },
];

export default function HowItWorks() {
  return (
    <section id="protocol" className="border-b border-ink-800 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[.75fr_1.25fr] md:gap-20">
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="coord-label">01 / Protocol</p>
          <h2 className="mt-5 max-w-md text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.02] text-spectral">
            From private input to public proof.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-500">
            ProVeil separates the claim from the information that proves it. The network receives an attestation, not a profile.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute bottom-8 left-[15px] top-8 w-px bg-gradient-to-b from-patina-400/70 via-ink-600 to-transparent" />
          <div className="space-y-8">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * .08 }}
                className="relative grid grid-cols-[32px_1fr] gap-5"
              >
                <div className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-ink-600 bg-ink-950 text-patina-300">
                  <step.icon className="h-3.5 w-3.5" />
                </div>
                <div className={`pb-8 ${index < STEPS.length - 1 ? 'border-b border-ink-800' : ''}`}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] text-zinc-600">{step.number}</span>
                    <h3 className="text-base font-semibold text-zinc-100">{step.title}</h3>
                  </div>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-500">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
