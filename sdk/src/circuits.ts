import {
  CircuitInput,
  CircuitValue,
  ProofDataMap,
  ProofType,
} from './types';

const DEFAULT_ACCREDITED_INVESTOR_THRESHOLD = '100000000';
const DEFAULT_MINIMUM_CREDIT_SCORE = '650';
const SANCTIONS_TREE_DEPTH = 10;
const UINT64_MAX = 18446744073709551615n;

function toInteger(value: CircuitValue, name: string): string {
  let integer: bigint;

  try {
    if (typeof value === 'bigint') {
      integer = value;
    } else if (typeof value === 'number') {
      if (!Number.isSafeInteger(value)) {
        throw new Error();
      }
      integer = BigInt(value);
    } else if (/^\d+$/.test(value)) {
      integer = BigInt(value);
    } else {
      throw new Error();
    }
  } catch {
    throw new TypeError(`${name} must be a non-negative integer`);
  }

  if (integer < 0n) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }

  return integer.toString();
}

function toUint64(value: CircuitValue, name: string): string {
  const integer = BigInt(toInteger(value, name));
  if (integer > UINT64_MAX) {
    throw new RangeError(`${name} must fit in an unsigned 64-bit integer`);
  }
  return integer.toString();
}

function toUnixSeconds(value: CircuitValue | Date, name: string): string {
  if (value instanceof Date) {
    const milliseconds = value.getTime();
    if (!Number.isFinite(milliseconds)) {
      throw new TypeError(`${name} must be a valid date`);
    }
    return String(Math.floor(milliseconds / 1000));
  }
  return toUint64(value, name);
}

function randomSalt(): string {
  const bytes = new Uint32Array(2);
  globalThis.crypto.getRandomValues(bytes);
  return ((BigInt(bytes[0]!) << 32n) | BigInt(bytes[1]!)).toString();
}

export function buildCircuitInputs<T extends ProofType>(
  proofType: T,
  data: ProofDataMap[T],
  now: Date = new Date(),
): CircuitInput {
  switch (proofType) {
    case 'age_over_18': {
      const input = data as ProofDataMap['age_over_18'];
      return {
        proofType,
        privateInputs: { birthdate: toUnixSeconds(input.birthdate, 'birthdate') },
        publicInputs: {
          currentDate: toUnixSeconds(input.currentDate ?? now, 'currentDate'),
        },
      };
    }

    case 'accredited_investor': {
      const input = data as ProofDataMap['accredited_investor'];
      return {
        proofType,
        privateInputs: { netWorth: toUint64(input.netWorth, 'netWorth') },
        publicInputs: {
          threshold: toUint64(
            input.threshold ?? DEFAULT_ACCREDITED_INVESTOR_THRESHOLD,
            'threshold',
          ),
        },
      };
    }

    case 'credit_score_range': {
      const input = data as ProofDataMap['credit_score_range'];
      const creditScore = Number(toInteger(input.creditScore, 'creditScore'));
      const minimumScore = Number(
        toInteger(input.minimumScore ?? DEFAULT_MINIMUM_CREDIT_SCORE, 'minimumScore'),
      );
      if (creditScore < 300 || creditScore > 850) {
        throw new RangeError('creditScore must be between 300 and 850');
      }
      if (minimumScore < 300 || minimumScore > 850) {
        throw new RangeError('minimumScore must be between 300 and 850');
      }
      return {
        proofType,
        privateInputs: { creditScore: String(creditScore) },
        publicInputs: { minimumScore: String(minimumScore) },
      };
    }

    case 'jurisdiction_check': {
      const input = data as ProofDataMap['jurisdiction_check'];
      return {
        proofType,
        privateInputs: { countryCode: toInteger(input.countryCode, 'countryCode') },
        publicInputs: {
          allowedCountryCode: toInteger(input.allowedCountryCode, 'allowedCountryCode'),
        },
      };
    }

    case 'source_of_funds': {
      const input = data as ProofDataMap['source_of_funds'];
      return {
        proofType,
        privateInputs: {
          transactionHistoryHash: toInteger(
            input.transactionHistoryHash,
            'transactionHistoryHash',
          ),
          salt: input.salt === undefined ? randomSalt() : toInteger(input.salt, 'salt'),
        },
        publicInputs: {
          compliancePolicyHash: toInteger(
            input.compliancePolicyHash,
            'compliancePolicyHash',
          ),
        },
      };
    }

    case 'sanctions_check': {
      const input = data as ProofDataMap['sanctions_check'];
      if (input.siblings.length !== SANCTIONS_TREE_DEPTH) {
        throw new RangeError(`siblings must contain ${SANCTIONS_TREE_DEPTH} values`);
      }
      const pathNumber = Number(toInteger(input.pathNumber, 'pathNumber'));
      if (pathNumber >= 2 ** SANCTIONS_TREE_DEPTH) {
        throw new RangeError('pathNumber must be between 0 and 1023');
      }
      return {
        proofType,
        privateInputs: {
          identityHash: toInteger(input.identityHash, 'identityHash'),
          siblings: input.siblings.map((value, index) =>
            toInteger(value, `siblings[${index}]`),
          ),
        },
        publicInputs: {
          merkleRoot: toInteger(input.merkleRoot, 'merkleRoot'),
          pathNumber: String(pathNumber),
        },
      };
    }
  }
}
