import { ProveilApiError } from './errors';
import { buildCircuitInputs } from './circuits';
import {
  CircuitListResponse,
  GenerateProofRequest,
  GenerateProofResponse,
  HealthResponse,
  ProofType,
  VerificationStatus,
} from './types';

interface ApiClientOptions {
  apiUrl: string;
  apiKey?: string;
  requestTimeoutMs: number;
  fetch: typeof globalThis.fetch;
}

export class ProveilApiClient {
  private readonly apiUrl: string;

  constructor(private readonly options: ApiClientOptions) {
    this.apiUrl = options.apiUrl.replace(/\/+$/, '');
  }

  async generateProof<T extends ProofType>(
    request: GenerateProofRequest<T>,
  ): Promise<GenerateProofResponse<T>> {
    const circuitInput = buildCircuitInputs(request.proofType, request.data);
    return this.request<GenerateProofResponse<T>>('/prove', {
      method: 'POST',
      body: JSON.stringify({
        proofType: request.proofType,
        walletAddress: request.walletAddress,
        data: {
          ...circuitInput.privateInputs,
          ...circuitInput.publicInputs,
        },
      }),
    });
  }

  async checkVerification<T extends ProofType>(
    walletAddress: string,
    proofType: T,
  ): Promise<VerificationStatus<T>> {
    return this.request<VerificationStatus<T>>(
      `/verify/${encodeURIComponent(walletAddress)}/${encodeURIComponent(proofType)}`,
    );
  }

  async getCircuits(): Promise<CircuitListResponse> {
    return this.request<CircuitListResponse>('/circuits');
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options.requestTimeoutMs);
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (init.body !== undefined) {
      headers.set('Content-Type', 'application/json');
    }
    if (this.options.apiKey) {
      headers.set('Authorization', `Bearer ${this.options.apiKey}`);
    }

    try {
      const response = await this.options.fetch(`${this.apiUrl}${path}`, {
        ...init,
        headers,
        signal: controller.signal,
      });
      const body = await readResponse(response);
      if (!response.ok) {
        const message = getErrorMessage(body) ?? `ProVeil API request failed (${response.status})`;
        throw new ProveilApiError(message, response.status, body);
      }
      return body as T;
    } catch (error) {
      if (error instanceof ProveilApiError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ProveilApiError('ProVeil API request timed out', 408);
      }
      throw new ProveilApiError(
        error instanceof Error ? error.message : 'ProVeil API request failed',
        0,
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}

async function readResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(body: unknown): string | undefined {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const error = (body as { error?: unknown }).error;
    return typeof error === 'string' ? error : undefined;
  }
  return typeof body === 'string' ? body : undefined;
}
