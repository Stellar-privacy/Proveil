import { Networks } from '@stellar/stellar-sdk';
import { ProveilApiClient } from './api';
import { buildCircuitInputs } from './circuits';
import { ProveilStellarClient } from './stellar';
import {
  GenerateProofRequest,
  GenerateProofResponse,
  PROOF_TYPES,
  ProofType,
  ProveilConfig,
  VerifyRequest,
  VerifyResult,
} from './types';

const DEFAULT_API_URL = 'http://localhost:3001/api';
const DEFAULT_CONTRACT_ID = 'CDA7HN45XE3EDAJJZQ4HBYM5E6G6SYIJZJIRPKQSMBLTDQAAXNEK76VQ';
const DEFAULT_RPC_URL = 'https://soroban-testnet.stellar.org';
const DEFAULT_REQUEST_TIMEOUT = 120000;

export class Proveil {
  readonly api: ProveilApiClient;
  readonly stellar: ProveilStellarClient;

  constructor(config: ProveilConfig = {}) {
    const fetchImplementation = config.fetch ?? globalThis.fetch;
    if (!fetchImplementation) {
      throw new TypeError('A fetch implementation is required');
    }

    this.api = new ProveilApiClient({
      apiUrl: config.apiUrl ?? DEFAULT_API_URL,
      apiKey: config.apiKey,
      requestTimeoutMs: config.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT,
      fetch: fetchImplementation,
    });
    this.stellar = new ProveilStellarClient({
      contractId: config.contractId ?? DEFAULT_CONTRACT_ID,
      rpcUrl: config.rpcUrl ?? DEFAULT_RPC_URL,
      networkPassphrase: config.networkPassphrase ?? Networks.TESTNET,
    });
  }

  buildCircuitInputs = buildCircuitInputs;

  async generateProof<T extends ProofType>(
    request: GenerateProofRequest<T>,
  ): Promise<GenerateProofResponse<T>> {
    return this.api.generateProof(request);
  }

  async checkVerification<T extends ProofType>(
    walletAddress: string,
    proofType: T,
    source: 'api' | 'contract' = 'contract',
  ) {
    const client = source === 'api' ? this.api : this.stellar;
    return client.checkVerification(walletAddress, proofType);
  }

  async verify(request: VerifyRequest): Promise<VerifyResult> {
    const uniqueRequirements = [...new Set(request.requirements)];
    if (uniqueRequirements.length === 0) {
      throw new TypeError('At least one verification requirement is required');
    }
    const proofs = await Promise.all(
      uniqueRequirements.map(async proofType => ({
        proofType,
        verified: (
          await this.checkVerification(
            request.walletAddress,
            proofType,
            request.source ?? 'contract',
          )
        ).verified,
      })),
    );

    return {
      walletAddress: request.walletAddress,
      compliant: proofs.every(proof => proof.verified),
      proofs,
    };
  }
}

export { buildCircuitInputs, PROOF_TYPES, ProveilApiClient, ProveilStellarClient };
export * from './errors';
export type * from './types';
