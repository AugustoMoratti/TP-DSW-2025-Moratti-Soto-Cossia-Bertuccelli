import { Request, Response } from 'express';
import { orm } from '../../../DB/orm.js';
import { Trabajo } from '../../trabajos/trabajos.entity.js';
import { Preference, MercadoPagoConfig } from 'mercadopago';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

async function create_preference(req: Request, res: Response) {

  try {
    const { trabajoId } = req.body;

    const em = orm.em.fork();
    const trabajo = await em.findOne(Trabajo, { id: trabajoId });

    if (!trabajo) {
      return res.status(404).json({ message: "Trabajo no encontrado" });
    }

    if (trabajo.fechaPago) {
      return res.status(400).json({ message: "El trabajo ya está pago" });
    }

    if (trabajo.montoTotal == null || trabajo.montoTotal <= 0) {
      return res.status(400).json({ message: "Monto inválido" });
    }

    const preference = new Preference(mpClient);

    const result = await preference.create({
      body: {
        items: [
          {
            title: `Pago servicio trabajo ${trabajo.id}`,
            quantity: 1,
            unit_price: Number(trabajo.montoTotal),
            currency_id: "ARS",
          } as any,
        ],
        external_reference: String(trabajo.id),
      },
    });


    const preferenceId =
      (result as any).id ?? (result as any).body?.id;

    const initPoint =
      (result as any).init_point ?? (result as any).body?.init_point;

    return res.status(200).json({
      preferenceId,
      initPoint,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Error creando preferencia",
      error: error.message,
    });
  }
};

export { create_preference };