# Proveil

Privacy-Preserving KYC/AML Verification Infrastructure for Stellar.

Based on Stellar Protocol 25 (X-Ray), with BN254 elliptic curve and Poseidon hash support available as Soroban host functions.

## Project Goal

Proveil provides a zero-knowledge compliance stack so users can prove regulatory properties (like age or sanctions non-membership) without revealing underlying personal data.

## Core Stack

- **Stellar + Soroban** for on-chain verification and credential state.
- **Circom** for zero-knowledge circuit definitions.
- **SnarkJS** for off-chain proving and local verification workflows.
- **Rust** for Soroban smart contracts.
- **TypeScript/Node.js** for API, SDK, and CLI surfaces.
- **Next.js** for the developer dashboard.

## Monorepo Structure

```text
proveil/
├── circuits/          # Circom ZK circuits
├── contracts/         # Soroban smart contracts (Rust)
├── sdk/               # JavaScript/TypeScript SDK
├── api/               # Backend API server (Node.js)
├── dashboard/         # React/Next.js developer dashboard
├── cli/               # CLI tool
└── docs/              # Documentation
```

## Build Phases (Roadmap Summary)

### Phase 0 — Environment Setup

Install Rust, Soroban CLI, Node.js (18+), SnarkJS, Circom, and optional RISC Zero tooling. Configure Stellar testnet keys and scaffold the monorepo.

### Phase 1 — ZK Circuit Development

Create proof circuits, beginning with `age_over_18.circom`, then sanctions and additional compliance templates.

Target proof templates include:

- `age_over_18.circom`
- `sanctions_check.circom`
- `accredited_investor.circom`
- `credit_score_range.circom`
- `jurisdiction_check.circom`
- `source_of_funds.circom`

Compile circuits and generate proving/verification artifacts using Circom + SnarkJS.

### Phase 2 — Soroban Smart Contracts

Implement three contracts:

- **Verifier** contract for on-chain BN254 proof verification.
- **Credential Registry** contract for proof-hash credential records.
- **Revocation** contract for issuer-driven credential revocation checks.

Deploy to Stellar testnet and capture contract IDs for SDK/API integration.

### Phase 3 — Proof Generation API

Implement backend endpoints for proof generation, verification submission flow, and wallet credential retrieval.

Design requirement: private inputs must not be logged, stored, or persisted beyond proof generation.

### Phase 4 — Developer SDK

Provide TypeScript SDK APIs for:

- `generateProof(...)`
- `verify(...)`

Then extend packaging for Python, Rust, and Go wrappers in later phases.

### Phase 5 — Developer Dashboard

Build Next.js dashboard with template browsing, builder flow, deploy/test flows, API key management, analytics, and docs/editor surfaces.

### Phase 6 — CLI Tool

Provide CLI commands for proof generation, verification, contract deployment, and template management.

### Phase 7 — Launch Templates

Ship five end-to-end templates at launch:

1. Age 18+
2. OFAC sanctions non-membership
3. Accredited investor status
4. Credit score range
5. KYC completion at institution

### Phase 8 — Testing Strategy

Cover:

- Circuit witness/proof validation.
- Soroban contract unit tests.
- End-to-end flow from API proof generation to on-chain verification and SDK checks.

### Phase 9 — Security Hardening

Key checklist:

- MPC-grade trusted setup for production.
- No PII storage anywhere.
- Proof/public-input binding integrity.
- Sanctions root freshness strategy.
- Contract audit before institutional rollout.
- Strong API key and key-management boundaries.

### Phase 10 — Go-To-Market

Developer adoption, anchor pilots, and enterprise monetization tiers.

## Reference Links

- Stellar Developers: https://stellar.org/developers
- Soroban Docs: https://soroban.stellar.org
- Circom Docs: https://docs.circom.io
- SnarkJS: https://github.com/iden3/snarkjs
- Circomlib: https://github.com/iden3/circomlib
- BN254 reference (EIP-197): https://eips.ethereum.org/EIPS/eip-197
