export class ProveilError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ProveilError';
  }
}

export class ProveilApiError extends ProveilError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response?: unknown,
  ) {
    super(message);
    this.name = 'ProveilApiError';
  }
}

export class ProveilContractError extends ProveilError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ProveilContractError';
  }
}
