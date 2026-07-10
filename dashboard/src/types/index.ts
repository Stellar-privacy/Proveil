export type ProofType =
  | 'age_over_18'
  | 'sanctions_check'
  | 'accredited_investor'
  | 'credit_score_range'
  | 'jurisdiction_check'
  | 'source_of_funds';

export interface ProofRequest {
  proofType: ProofType;
  walletAddress: string;
  data: Record<string, string | number>;
}

export interface ProofResponse {
  success: boolean;
  proofType?: string;
  walletAddress?: string;
  publicSignals?: string[];
  txHash?: string;
  message?: string;
  error?: string;
}

export interface VerifyResponse {
  wallet: string;
  proofType: string;
  verified: boolean;
}

export interface ProofCard {
  id: ProofType;
  title: string;
  description: string;
  icon: string;
  fields: ProofField[];
  color: string;
}

export interface ProofField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'date';
  hint?: string;
}
