import { Request, Response } from 'express';
import { fetchLocalidadesByProvincia } from "../utils/localidades.georef.js";

export const getLocalidadesByProvincia = async (req: Request, res: Response) => {
  const { provinciaId } = req.params;

  if (!provinciaId) {
    return res.status(400).json({ message: 'Provincia requerida' });
  }

  const localidades = await fetchLocalidadesByProvincia(provinciaId);
  res.json(localidades);
};
