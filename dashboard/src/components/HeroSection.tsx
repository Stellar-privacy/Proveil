'use client';
import { motion } from 'framer-motion';
import { Lock, Shield, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-glow-purple" />
      <div className="absolute inset-0 bg-glow-cyan" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stellar-purple/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-stellar-cyan/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stellar-purple/40 bg-stellar-purple/10 text-stellar-purple text-sm font-mono mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-stellar-purple animate-pulse" />
          Powered by Stellar Protocol · Groth16 ZK Proofs
          <Zap className="w-3 h-3" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-6"
        >
          <span className="text-white">Privacy</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-stellar-purple via-violet-400 to-stellar-cyan">
            Without Compromise
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-stellar-muted max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Generate zero-knowledge proofs for KYC compliance and attest them
          immutably on Stellar. Prove what you need to prove — nothing more.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          {[
            { label: 'Proof Types', value: '6', icon: Shield },
            { label: 'ZK Circuit', value: 'Groth16', icon: Lock },
            { label: 'On-Chain', value: 'Stellar', icon: Zap },
            { label: 'Privacy', value: '100%', icon: Shield },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-stellar-muted font-mono uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#proofs"
            className="px-8 py-4 bg-stellar-purple hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(123,47,255,0.5)] flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Generate a Proof
          </a>
          <a
            href="#verify"
            className="px-8 py-4 border border-stellar-border hover:border-stellar-purple/50 text-stellar-text rounded-xl transition-all duration-300 hover:bg-stellar-purple/5"
          >
            Verify On-Chain
          </a>
        </motion.div>

        {/* Contract ID */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-stellar-card border border-stellar-border"
        >
          <div className="w-2 h-2 rounded-full bg-stellar-green" />
          <span className="text-xs text-stellar-muted font-mono">Contract:</span>
          <span className="text-xs font-mono text-stellar-text truncate max-w-xs">
            CDA7HN45XE3EDAJJZQ4HBYM5E6G6SYIJZJIRPKQSMBLTDQAAXNEK76VQ
          </span>
        </motion.div>
      </div>
    </section>
  );
}
