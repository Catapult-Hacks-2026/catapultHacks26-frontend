export class ApiError extends Error {
  status: number;

  path: string;

  details?: unknown;

  constructor(status: number, path: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
    this.details = details;
  }
}
