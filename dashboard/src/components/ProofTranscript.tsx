'use client';

import { motion } from 'framer-motion';
import { Check, Lock, Radio, ShieldCheck } from 'lucide-react';

const EVENTS = [
  { time: '00.000', label: 'Private input accepted', detail: 'birthdate · non-public', icon: Lock },
  { time: '00.184', label: 'Circuit witness computed', detail: 'age_over_18 · 65 constraints', icon: Radio },
  { time: '01.422', label: 'Groth16 proof verified', detail: 'BN254 · valid', icon: ShieldCheck },
  { time: '03.091', label: 'Attestation recorded', detail: 'Stellar testnet · 30d TTL', icon: Check },
];

export default function ProofTranscript() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .7, delay: .2 }}
      className="card relative overflow-hidden"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.035]" />
      <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
        <div>
          <p className="coord-label">Example proof transcript</p>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">SESSION / PV-AGE-01</p>
        </div>
        <span className="badge border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Valid
        </span>
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="absolute bottom-12 left-[38px] top-12 w-px bg-ink-700 sm:left-[42px]" />
        <div className="space-y-6">
          {EVENTS.map((event, index) => (
            <motion.div
              key={event.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: .35 + index * .13 }}
              className="relative grid grid-cols-[36px_1fr] gap-4 sm:grid-cols-[40px_1fr]"
            >
              <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-ink-600 bg-ink-900 text-spectral">
                <event.icon className="h-3.5 w-3.5" />
              </span>
              <div className={`min-w-0 pb-5 ${index < EVENTS.length - 1 ? 'border-b border-ink-800' : ''}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-100">{event.label}</p>
                  <span className="shrink-0 font-mono text-[9px] text-zinc-600">{event.time}s</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-zinc-500">{event.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-ink-700 bg-ink-900/50">
        {[
          ['PROTOCOL', 'Groth16'],
          ['CURVE', 'BN254'],
          ['NETWORK', 'Testnet'],
        ].map(([label, value]) => (
          <div key={label} className="border-r border-ink-700 px-4 py-3 last:border-0">
            <p className="font-mono text-[8px] tracking-[.16em] text-zinc-600">{label}</p>
            <p className="mt-1 text-xs font-medium text-zinc-300">{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
