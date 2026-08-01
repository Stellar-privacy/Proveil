import { describe, expect, it, vi } from 'vitest';
import { buildCircuitInputs } from '../src/circuits';

describe('buildCircuitInputs', () => {
  it('builds age inputs from Date values', () => {
    const result = buildCircuitInputs(
      'age_over_18',
      { birthdate: new Date('2000-01-01T00:00:00Z') },
      new Date('2026-01-01T00:00:00Z'),
    );

    expect(result).toEqual({
      proofType: 'age_over_18',
      privateInputs: { birthdate: '946684800' },
      publicInputs: { currentDate: '1767225600' },
    });
  });

  it('applies the accredited investor threshold default', () => {
    expect(buildCircuitInputs('accredited_investor', { netWorth: 150000000n })).toEqual({
      proofType: 'accredited_investor',
      privateInputs: { netWorth: '150000000' },
      publicInputs: { threshold: '100000000' },
    });
  });

  it('rejects invalid credit score inputs', () => {
    expect(() =>
      buildCircuitInputs('credit_score_range', {
        creditScore: 900,
        minimumScore: 650,
      }),
    ).toThrow('creditScore must be between 300 and 850');
  });

  it('requires a complete sanctions Merkle path', () => {
    expect(() =>
      buildCircuitInputs('sanctions_check', {
        identityHash: 1,
        merkleRoot: 2,
        pathNumber: 3,
        siblings: ['0'],
      }),
    ).toThrow('siblings must contain 10 values');
  });

  it('generates a source-of-funds salt when omitted', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (values: Uint32Array) => values.set([1, 2]),
    });

    const result = buildCircuitInputs('source_of_funds', {
      transactionHistoryHash: 10,
      compliancePolicyHash: 20,
    });

    expect(result.privateInputs.salt).toBe('4294967298');
    vi.unstubAllGlobals();
  });
});
