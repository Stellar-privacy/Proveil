import { describe, expect, it, vi } from 'vitest';
import { Proveil } from '../src';

describe('Proveil', () => {
  it('rejects an empty verification policy', async () => {
    const proveil = new Proveil({ fetch: vi.fn() });

    await expect(
      proveil.verify({ walletAddress: 'GTEST', requirements: [] }),
    ).rejects.toThrow('At least one verification requirement is required');
  });

  it('returns true only when every unique requirement is verified', async () => {
    const proveil = new Proveil({ fetch: vi.fn() });
    vi.spyOn(proveil.stellar, 'checkVerification')
      .mockResolvedValueOnce({
        wallet: 'GTEST',
        proofType: 'age_over_18',
        verified: true,
      })
      .mockResolvedValueOnce({
        wallet: 'GTEST',
        proofType: 'sanctions_check',
        verified: false,
      });

    const result = await proveil.verify({
      walletAddress: 'GTEST',
      requirements: ['age_over_18', 'age_over_18', 'sanctions_check'],
    });

    expect(result.compliant).toBe(false);
    expect(result.proofs).toEqual([
      { proofType: 'age_over_18', verified: true },
      { proofType: 'sanctions_check', verified: false },
    ]);
    expect(proveil.stellar.checkVerification).toHaveBeenCalledTimes(2);
  });
});
