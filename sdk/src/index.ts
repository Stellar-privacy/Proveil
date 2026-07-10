export type VerifyRequest = {
  walletAddress: string;
  requirements: string[];
};

export class Proveil {
  constructor(private readonly config: { apiKey: string }) {}

  async verify(_request: VerifyRequest) {
    return { compliant: false, proofs: [] as unknown[] };
  }

  async generateProof(_request: { proofType: string; privateInputs: Record<string, unknown> }) {
    return { proof: null, publicInputs: [] as unknown[] };
  }
}
