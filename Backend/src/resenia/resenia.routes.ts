import { Router } from "express";
import { findOne, findAll, add, remove, update, sanitizeReseniaInput } from "./resenia.controller.js";

export const routerResenia = Router()

routerResenia.get("/", findAll);
routerResenia.get("/:id", findOne);
routerResenia.post("/", sanitizeReseniaInput, add);
routerResenia.put("/:id", sanitizeReseniaInput, update);
routerResenia.patch("/:id", sanitizeReseniaInput, update);
routerResenia.delete("/:id", remove);

export default routerResenia;