import {
  Account,
  Address,
  BASE_FEE,
  Contract,
  nativeToScVal,
  rpc,
  scValToNative,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { ProveilContractError } from './errors';
import { ProofType, VerificationRecord, VerificationStatus } from './types';

interface StellarClientOptions {
  contractId: string;
  rpcUrl: string;
  networkPassphrase: string;
}

type NativeRecord = {
  verified: boolean;
  timestamp: bigint | number | string;
  public_signals_hash: Uint8Array | string;
};

export class ProveilStellarClient {
  private readonly server: rpc.Server;
  private readonly contract: Contract;

  constructor(private readonly options: StellarClientOptions) {
    this.server = new rpc.Server(options.rpcUrl);
    this.contract = new Contract(options.contractId);
  }

  async checkVerification<T extends ProofType>(
    walletAddress: string,
    proofType: T,
  ): Promise<VerificationStatus<T>> {
    const verified = await this.simulate<boolean>('is_verified', walletAddress, proofType);
    return { wallet: walletAddress, proofType, verified };
  }

  async getVerificationRecord(
    walletAddress: string,
    proofType: ProofType,
  ): Promise<VerificationRecord | null> {
    const record = await this.simulate<NativeRecord | null>(
      'get_record',
      walletAddress,
      proofType,
    );
    if (record === null) {
      return null;
    }
    return {
      verified: record.verified,
      timestamp: BigInt(record.timestamp),
      publicSignalsHash: bytesToHex(record.public_signals_hash),
    };
  }

  async getProofCount(): Promise<bigint> {
    const count = await this.simulate<bigint | number | string>('proof_count');
    return BigInt(count);
  }

  private async simulate<T>(
    method: string,
    walletAddress?: string,
    proofType?: ProofType,
  ): Promise<T> {
    try {
      const source = new Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0');
      const args = [];
      if (walletAddress !== undefined) {
        args.push(new Address(walletAddress).toScVal());
      }
      if (proofType !== undefined) {
        args.push(nativeToScVal(proofType, { type: 'string' }));
      }
      const transaction = new TransactionBuilder(source, {
        fee: BASE_FEE,
        networkPassphrase: this.options.networkPassphrase,
      })
        .addOperation(this.contract.call(method, ...args))
        .setTimeout(30)
        .build();
      const result = await this.server.simulateTransaction(transaction);
      if (!rpc.Api.isSimulationSuccess(result) || !result.result) {
        throw new ProveilContractError(
          `Soroban simulation failed for ${method}: ${simulationError(result)}`,
        );
      }
      return scValToNative(result.result.retval) as T;
    } catch (error) {
      if (error instanceof ProveilContractError) {
        throw error;
      }
      throw new ProveilContractError(
        error instanceof Error ? error.message : `Soroban simulation failed for ${method}`,
        error instanceof Error ? { cause: error } : undefined,
      );
    }
  }
}

function simulationError(result: rpc.Api.SimulateTransactionResponse): string {
  return 'error' in result && typeof result.error === 'string'
    ? result.error
    : 'unknown error';
}

function bytesToHex(value: Uint8Array | string): string {
  if (typeof value === 'string') {
    return value;
  }
  return Array.from(value, byte => byte.toString(16).padStart(2, '0')).join('');
}
