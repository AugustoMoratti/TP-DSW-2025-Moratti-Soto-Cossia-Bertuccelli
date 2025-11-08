import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeTrabajoInput, trabajosFinalizados, trabajosPendientes, trabajosFinalizadosContratados, trabajosPendientesContratados } from "./trabajos.controler.js";

export const trabajosRouter = Router();

trabajosRouter.get("/", findAll);
trabajosRouter.get("/finalizados/:id", trabajosFinalizados);
trabajosRouter.get("/pendientes/:id", trabajosPendientes);
trabajosRouter.get("/finalizados/contratados/:id", trabajosFinalizadosContratados);
trabajosRouter.get("/pendientes/contratados/:id", trabajosPendientesContratados);
trabajosRouter.get("/:id", findOne);
trabajosRouter.post("/", sanitizeTrabajoInput, add);
trabajosRouter.put("/:id", sanitizeTrabajoInput, update);
trabajosRouter.patch("/:id", sanitizeTrabajoInput, update);
trabajosRouter.delete("/:id", remove);

export default trabajosRouter;