'use client';
import { motion } from 'framer-motion';
import { Lock, Cpu, CheckCircle, Globe } from 'lucide-react';

const STEPS = [
  {
    icon: Lock,
    title: 'Enter Private Data',
    description: 'Provide your sensitive data locally. It never leaves your browser or gets transmitted.',
    color: 'text-stellar-purple',
    bg: 'bg-stellar-purple/10',
    border: 'border-stellar-purple/20',
  },
  {
    icon: Cpu,
    title: 'Generate ZK Proof',
    description: 'A Groth16 circuit computes a cryptographic proof that your data satisfies the condition.',
    color: 'text-stellar-cyan',
    bg: 'bg-stellar-cyan/10',
    border: 'border-stellar-cyan/20',
  },
  {
    icon: CheckCircle,
    title: 'Verify Locally',
    description: 'The proof is verified using snarkjs before any blockchain interaction occurs.',
    color: 'text-stellar-green',
    bg: 'bg-stellar-green/10',
    border: 'border-stellar-green/20',
  },
  {
    icon: Globe,
    title: 'Attest on Stellar',
    description: 'The verified result is attested immutably on Stellar testnet via a Soroban smart contract.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-white mb-4">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-stellar-purple to-stellar-cyan">ProVeil</span> Works
          </h2>
          <p className="text-stellar-muted max-w-xl mx-auto">
            A four-step pipeline from private input to immutable on-chain attestation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl border ${step.border} ${step.bg}`}
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-stellar-dark border border-stellar-border flex items-center justify-center text-xs font-mono text-stellar-muted">
                {i + 1}
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-stellar-muted z-10">
                  →
                </div>
              )}

              <step.icon className={`w-8 h-8 ${step.color} mb-4`} />
              <h3 className="font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-stellar-muted leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
