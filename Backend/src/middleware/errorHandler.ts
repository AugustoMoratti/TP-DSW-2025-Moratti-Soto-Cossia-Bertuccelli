import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/HttpError';

export function errorHandlert(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
      }
    });
  }
}
