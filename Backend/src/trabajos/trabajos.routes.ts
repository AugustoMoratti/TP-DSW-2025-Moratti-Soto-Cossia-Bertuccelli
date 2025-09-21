import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./trabajos.controler.js";

export const trabajosRouter = Router();

trabajosRouter.get("/", findAll);
trabajosRouter.get("/:id", findOne);
trabajosRouter.post("/", add);
trabajosRouter.put("/:id", update);
trabajosRouter.patch("/:id", update);
trabajosRouter.delete("/:id", remove);

export default trabajosRouter;