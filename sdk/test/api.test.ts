import { describe, expect, it, vi } from 'vitest';
import { ProveilApiClient } from '../src/api';
import { ProveilApiError } from '../src/errors';

function client(fetch: typeof globalThis.fetch) {
  return new ProveilApiClient({
    apiUrl: 'https://proveil.example/api/',
    apiKey: 'secret',
    requestTimeoutMs: 1000,
    fetch,
  });
}

describe('ProveilApiClient', () => {
  it('generates a proof with typed request data', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          proofType: 'age_over_18',
          walletAddress: 'GTEST',
          publicSignals: ['1'],
          txHash: 'abc',
        }),
        { status: 200 },
      ),
    );

    const result = await client(fetch).generateProof({
      proofType: 'age_over_18',
      walletAddress: 'GTEST',
      data: {
        birthdate: new Date('2000-01-01T00:00:00Z'),
        currentDate: 1767225600n,
      },
    });

    expect(result.txHash).toBe('abc');
    expect(fetch).toHaveBeenCalledWith(
      'https://proveil.example/api/prove',
      expect.objectContaining({ method: 'POST' }),
    );
    const request = fetch.mock.calls[0]?.[1];
    expect(new Headers(request?.headers).get('Authorization')).toBe('Bearer secret');
    expect(JSON.parse(String(request?.body))).toEqual({
      proofType: 'age_over_18',
      walletAddress: 'GTEST',
      data: {
        birthdate: '946684800',
        currentDate: '1767225600',
      },
    });
  });

  it('surfaces API errors with status and response data', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(
      new Response(JSON.stringify({ error: 'unsupported proof type' }), { status: 400 }),
    );

    await expect(client(fetch).getCircuits()).rejects.toMatchObject({
      name: 'ProveilApiError',
      message: 'unsupported proof type',
      status: 400,
    } satisfies Partial<ProveilApiError>);
  });
});
