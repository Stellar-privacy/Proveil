import axios, { AxiosError } from 'axios';
import { ProofRequest, ProofResponse, VerifyResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 min for proof generation
});

export async function generateProof(req: ProofRequest): Promise<ProofResponse> {
  try {
    const { data } = await client.post<ProofResponse>('/prove', req);
    return data;
  } catch (error) {
    throw new Error(getApiError(error, 'Proof generation failed'));
  }
}

export async function checkVerification(
  wallet: string,
  proofType: string,
): Promise<VerifyResponse> {
  try {
    const { data } = await client.get<VerifyResponse>(`/verify/${wallet}/${proofType}`);
    return data;
  } catch (error) {
    throw new Error(getApiError(error, 'Verification query failed'));
  }
}

export async function getCircuits(): Promise<{ supported: string[]; count: number }> {
  const { data } = await client.get('/circuits');
  return data;
}

function getApiError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as { error?: unknown } | undefined;
    if (typeof response?.error === 'string') return response.error;
    if (error.code === 'ECONNABORTED') return 'The proof request timed out. Please try again.';
    if (!error.response) return 'Unable to reach the ProVeil API. Confirm the API server is running.';
  }
  return error instanceof Error ? error.message : fallback;
}
