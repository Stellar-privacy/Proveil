import axios from 'axios';
import { ProofRequest, ProofResponse, VerifyResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 min for proof generation
});

export async function generateProof(req: ProofRequest): Promise<ProofResponse> {
  const { data } = await client.post<ProofResponse>('/prove', req);
  return data;
}

export async function checkVerification(
  wallet: string,
  proofType: string,
): Promise<VerifyResponse> {
  const { data } = await client.get<VerifyResponse>(`/verify/${wallet}/${proofType}`);
  return data;
}

export async function getCircuits(): Promise<{ supported: string[]; count: number }> {
  const { data } = await client.get('/circuits');
  return data;
}
