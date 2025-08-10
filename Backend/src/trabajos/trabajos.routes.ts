import { Router } from "express";
import { sanitizeTrabajoInput, findAll, findOne, add, update, remove } from "./trabajos.controler.js";

export const trabajosRouter = Router();

trabajosRouter.get("/", findAll);
trabajosRouter.get("/:id", findOne);
trabajosRouter.post("/", sanitizeTrabajoInput, add);
trabajosRouter.put("/:id", sanitizeTrabajoInput, update);
trabajosRouter.patch("/:id", sanitizeTrabajoInput, update);
trabajosRouter.delete("/:id", remove);

export default trabajosRouter;