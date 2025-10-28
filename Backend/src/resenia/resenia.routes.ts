import { Router } from "express";
import { findOne, findAll, add, /*remove,*/ update, sanitizeReseniaInput } from "./resenia.controller.js";

export const reseniaRouter = Router()

reseniaRouter.get("/", findAll);
reseniaRouter.get("/:id", findOne);
reseniaRouter.post("/", sanitizeReseniaInput, add);
reseniaRouter.put("/:id", sanitizeReseniaInput, update);
reseniaRouter.patch("/:id", sanitizeReseniaInput, update);
//reseniaRouter.delete("/:id", remove);

export default reseniaRouter;