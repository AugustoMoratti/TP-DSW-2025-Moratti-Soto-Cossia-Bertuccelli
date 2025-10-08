import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (res.headersSent) return;
  const status = err?.status ?? 500;
  res.status(status).json({ error: err?.message ?? 'Internal Server Error' });
};