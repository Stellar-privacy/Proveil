# @proveil/sdk

TypeScript client for generating ProVeil compliance proofs through the ProVeil API and querying verification attestations on Stellar testnet.

## Installation

```bash
npm install @proveil/sdk
```

## Usage

```ts
import { Proveil } from '@proveil/sdk';

const proveil = new Proveil({
  apiUrl: 'https://api.example.com/api',
});

const proof = await proveil.generateProof({
  proofType: 'age_over_18',
  walletAddress: 'G...',
  data: { birthdate: new Date('1990-01-01T00:00:00Z') },
});

const status = await proveil.checkVerification(
  proof.walletAddress,
  'age_over_18',
);
```

`checkVerification` queries the deployed Soroban contract by default. Pass `api` as the third argument to query through the ProVeil API instead.

```ts
const status = await proveil.checkVerification(walletAddress, 'age_over_18', 'api');
```

Use `verify` to check several requirements and calculate an aggregate compliance result.

```ts
const result = await proveil.verify({
  walletAddress,
  requirements: ['age_over_18', 'sanctions_check'],
});
```

Circuit inputs can be prepared independently for local circuit integrations.

```ts
const input = proveil.buildCircuitInputs('credit_score_range', {
  creditScore: 720,
  minimumScore: 650,
});
```

The default contract is the deployed ProVeil verifier on Stellar testnet. `contractId`, `rpcUrl`, `networkPassphrase`, `requestTimeoutMs`, and a custom `fetch` implementation can be supplied through the constructor.
