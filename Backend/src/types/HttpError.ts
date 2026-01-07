export class HttpError extends Error {
  public status: number;
  public code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;

    //necesario para que instaceOf funcione bien
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}