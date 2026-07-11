# ProVeil

> Privacy-preserving KYC compliance using zero-knowledge proofs on Stellar

ProVeil lets users prove compliance statements — age, accredited investor status, credit score, jurisdiction, source of funds, sanctions clearance — without revealing the underlying private data. Proofs are generated using Groth16 circuits and attested immutably on Stellar testnet via a Soroban smart contract.

**Live contract:** `CDA7HN45XE3EDAJJZQ4HBYM5E6G6SYIJZJIRPKQSMBLTDQAAXNEK76VQ`
**Network:** Stellar Testnet
**ZK Framework:** Circom + SnarkJS (Groth16, BN254)

---

## How It Works

1. User enters private data in the browser (birthdate, net worth, credit score, etc.)
2. A Groth16 ZK circuit generates a cryptographic proof locally
3. The proof is verified off-chain using snarkjs
4. The verified result is attested on-chain via the Soroban verifier contract
5. Anyone can query the contract to check if a wallet holds a valid attestation

Private data never leaves the user's machine. Only the proof and public signals are transmitted.

---

## Proof Types

| Proof | Private Input | Public Input | Constraints |
|-------|--------------|--------------|-------------|
| Age 18+ | Birthdate | Current timestamp | 65 |
| Accredited Investor | Net worth | Threshold ($1M) | 65 |
| Credit Score Range | Credit score | Minimum score | 329 |
| Jurisdiction Check | Country code | Allowed code | 2 |
| Source of Funds | Tx history hash + salt | Policy hash | 245 |
| Sanctions Check | Identity hash | Merkle root + path | 2715 |

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Next.js UI    │────▶│  Express API     │────▶│  Stellar Testnet    │
│  (Port 3000)    │     │  (Port 3001)     │     │  Soroban Contract   │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │  Circom Circuits  │
         │              │  SnarkJS Groth16  │
         └─────────────▶│  6 ZK Circuits   │
                        └──────────────────┘
```

### Stack

- **ZK Circuits:** Circom 2.2.3, SnarkJS 0.7.6, Groth16, BN254
- **Smart Contract:** Rust, Soroban SDK 22.0.0, Stellar CLI 27.0.0
- **API:** Node.js, Express, TypeScript
- **Frontend:** Next.js, React, TailwindCSS, Framer Motion

---

## Repository Structure

```
Proveil/
├── circuits/              # Circom ZK circuits + build artifacts
│   ├── age_over_18.circom
│   ├── accredited_investor.circom
│   ├── credit_score_range.circom
│   ├── jurisdiction_check.circom
│   ├── source_of_funds.circom
│   ├── sanctions_check.circom
│   └── build/             # Compiled wasm + verification keys
├── contracts/
│   └── proveil-verifier/  # Soroban smart contract (Rust)
│       └── src/lib.rs
├── api/                   # Express API server (TypeScript)
│   └── src/
│       ├── services/      # proof.service.ts, stellar.service.ts
│       ├── routes/        # proof.routes.ts
│       └── middleware/    # validate.ts
├── dashboard/             # Next.js frontend
│   └── src/
│       ├── app/           # layout.tsx, page.tsx
│       ├── components/    # 8 UI components
│       └── lib/           # api.ts, proofConfig.ts
└── docs/
```

---

## Smart Contract

The Soroban verifier contract stores attestation results on-chain with:
- **30-day TTL** — verifications expire automatically
- **Trusted verifier model** — only the authorized verifier address can attest
- **SHA-256 commitments** — public signals hashed for audit trail
- **6 proof types** supported natively

Key functions:
```rust
// Attest a verified proof result
verify_proof(verifier, wallet, proof_type, public_signals) -> bool

// Check if wallet holds active verification
is_verified(wallet, proof_type) -> bool

// Get full attestation record
get_record(wallet, proof_type) -> Option
```

---

## Running Locally

### Prerequisites

- Node.js 20+
- Rust + Cargo
- Circom 2.2.3
- SnarkJS 0.7.6
- Stellar CLI 27.0.0

### 1. Circuits

```bash
cd circuits
npm install          # installs circomlib
# Build artifacts already committed in circuits/build/
```

### 2. Smart Contract

```bash
cd contracts/proveil-verifier
cargo test           # run 4 contract tests
cargo build --target wasm32-unknown-unknown --release
```

### 3. API

```bash
cd api
npm install
cp .env.example .env   # fill in VERIFIER_SECRET_KEY and CONTRACT_ID
npm run dev            # starts on port 3001
```

### 4. Dashboard

```bash
cd dashboard
npm install
npm run dev            # starts on port 3000
```

Open `http://localhost:3000`

---

## API Endpoints

```
POST /api/prove
  Body: { proofType, walletAddress, data }
  Returns: { success, publicSignals, txHash }

GET  /api/verify/:wallet/:proofType
  Returns: { wallet, proofType, verified }

GET  /api/circuits
  Returns: { supported, count }

GET  /api/health
  Returns: { status, contractId, network, timestamp }
```

---

## Example: Age Proof

```bash
curl -X POST http://localhost:3001/api/prove \
  -H "Content-Type: application/json" \
  -d '{
    "proofType": "age_over_18",
    "walletAddress": "GABC...XYZ",
    "data": { "birthdate": "631152000" }
  }'

# Response
{
  "success": true,
  "proofType": "age_over_18",
  "publicSignals": ["1", "1783064111"],
  "txHash": "5fa7b77293e73510847ec1691995122be417d5b74f77d11b6576b5ca16571496",
  "message": "Proof verified and attested on Stellar testnet"
}
```

---

## ZK Circuit Design

All circuits use Groth16 over BN254. Private inputs are never revealed — only the proof and public outputs are shared.

**Age verification circuit:**
```circom
template AgeOver18() {
    signal input birthdate;     // private
    signal input currentDate;   // public
    signal output valid;

    signal age;
    age <== currentDate - birthdate;

    component gte = GreaterEqThan(64);
    gte.in[0] <== age;
    gte.in[1] <== 568036800;  // 18 years in seconds

    valid <== gte.out;
}
```

---

## Contract Verification

View the deployed contract on Stellar Expert:

[https://stellar.expert/explorer/testnet/contract/CDA7HN45XE3EDAJJZQ4HBYM5E6G6SYIJZJIRPKQSMBLTDQAAXNEK76VQ](https://stellar.expert/explorer/testnet/contract/CDA7HN45XE3EDAJJZQ4HBYM5E6G6SYIJZJIRPKQSMBLTDQAAXNEK76VQ)

View the first proof attestation transaction:

[https://stellar.expert/explorer/testnet/tx/5fa7b77293e73510847ec1691995122be417d5b74f77d11b6576b5ca16571496](https://stellar.expert/explorer/testnet/tx/5fa7b77293e73510847ec1691995122be417d5b74f77d11b6576b5ca16571496)

---

## License

MIT
