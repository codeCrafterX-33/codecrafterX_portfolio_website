export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const getHttpErrorStatus = (error: unknown): number => {
  if (!(error instanceof Error)) return 500;

  const status = "status" in error ? error.status : undefined;
  return typeof status === "number" &&
    Number.isInteger(status) && status >= 400 && status <= 599
    ? status
    : 500;
};
