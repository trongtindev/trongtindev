export class Result<T> {
  value: T;
  error: Error;

  public get code(): string {
    return typeof this.error.cause == 'string' ? this.error.cause : 'unknown';
  }

  public get message(): string {
    return this.error.message;
  }

  constructor(value: T | Error) {
    if (value instanceof Error) {
      this.error = value;
    } else {
      this.value = value;
    }
  }

  get isOk() {
    if (this.value) return true;
    return false;
  }

  get isError() {
    if (this.error) return true;
    return false;
  }

  ensureSuccessful() {
    if (!this.error) return;
    throw this.error;
  }

  static ok<T>(value: T): Result<T> {
    return new Result(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static err(error: string | Error): Result<any> {
    return new Result(error);
  }
}
