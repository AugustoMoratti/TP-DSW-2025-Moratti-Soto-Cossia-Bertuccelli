import { Request, Response } from 'express';
import { fetchProvincias } from "../utils/provincias.georef.js";

export const getProvincias = async (_req: Request, res: Response) => {
  const provincias = await fetchProvincias();
  res.json(provincias);
};