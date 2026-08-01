export const PROOF_TYPES = [
  'age_over_18',
  'sanctions_check',
  'accredited_investor',
  'credit_score_range',
  'jurisdiction_check',
  'source_of_funds',
] as const;

export type ProofType = (typeof PROOF_TYPES)[number];
export type CircuitValue = string | number | bigint;

export interface AgeOver18Data {
  birthdate: CircuitValue | Date;
  currentDate?: CircuitValue | Date;
}

export interface SanctionsCheckData {
  identityHash: CircuitValue;
  merkleRoot: CircuitValue;
  pathNumber: CircuitValue;
  siblings: readonly CircuitValue[];
}

export interface AccreditedInvestorData {
  netWorth: CircuitValue;
  threshold?: CircuitValue;
}

export interface CreditScoreRangeData {
  creditScore: CircuitValue;
  minimumScore?: CircuitValue;
}

export interface JurisdictionCheckData {
  countryCode: CircuitValue;
  allowedCountryCode: CircuitValue;
}

export interface SourceOfFundsData {
  transactionHistoryHash: CircuitValue;
  compliancePolicyHash: CircuitValue;
  salt?: CircuitValue;
}

export interface ProofDataMap {
  age_over_18: AgeOver18Data;
  sanctions_check: SanctionsCheckData;
  accredited_investor: AccreditedInvestorData;
  credit_score_range: CreditScoreRangeData;
  jurisdiction_check: JurisdictionCheckData;
  source_of_funds: SourceOfFundsData;
}

export interface CircuitInput {
  proofType: ProofType;
  privateInputs: Record<string, string | string[]>;
  publicInputs: Record<string, string>;
}

export interface GenerateProofRequest<T extends ProofType = ProofType> {
  proofType: T;
  walletAddress: string;
  data: ProofDataMap[T];
}

export interface GenerateProofResponse<T extends ProofType = ProofType> {
  success: true;
  proofType: T;
  walletAddress: string;
  publicSignals: string[];
  txHash: string;
  message?: string;
}

export interface VerificationStatus<T extends ProofType = ProofType> {
  wallet: string;
  proofType: T;
  verified: boolean;
}

export interface VerificationRecord {
  verified: boolean;
  timestamp: bigint;
  publicSignalsHash: string;
}

export interface VerifyRequest {
  walletAddress: string;
  requirements: readonly ProofType[];
  source?: 'api' | 'contract';
}

export interface VerificationRequirement {
  proofType: ProofType;
  verified: boolean;
}

export interface VerifyResult {
  walletAddress: string;
  compliant: boolean;
  proofs: VerificationRequirement[];
}

export interface CircuitListResponse {
  supported: ProofType[];
  count: number;
}

export interface HealthResponse {
  status: string;
  contractId: string;
  network: string;
  timestamp: string;
}

export interface ProveilConfig {
  apiUrl?: string;
  apiKey?: string;
  contractId?: string;
  rpcUrl?: string;
  networkPassphrase?: string;
  requestTimeoutMs?: number;
  fetch?: typeof globalThis.fetch;
}
