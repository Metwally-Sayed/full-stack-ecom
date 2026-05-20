export class AppError extends Error {
  statusCode: number;
  error: string;

  constructor(statusCode: number, error: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
