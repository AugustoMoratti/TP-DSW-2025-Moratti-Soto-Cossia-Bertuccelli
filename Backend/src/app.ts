import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { orm, syncSchema } from "../DB/orm.js";
import { Request, Response, NextFunction } from "express";
import { provinciaRouter } from "./provincia/provincia.routes.js";
import { profesionesRouter } from "./profesion/profesion.routes.js";
import { administradorRouter } from "./admin/admin.routes.js";
import { localidadesRouter } from "./localidad/localidad.routes.js";
import { usuarioRouter } from "./usuario/usuario.routes.js";
import { trabajosRouter } from "./trabajos/trabajos.routes.js";
import { reseniaRouter } from "./resenia/resenia.routes.js";
import { postRouter } from "./posteo/post.routes.js";
import { MPRouter } from "./utils/MP/mp.routes.js";
import { UPLOADS_DIR } from "./utils/upload.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./auth/auth.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // El dominio del front
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use("/uploads", express.static(UPLOADS_DIR));


app.use("/api/provincia", provinciaRouter);
app.use("/api/profesion", profesionesRouter);
app.use("/api/admin", administradorRouter);
app.use("/api/localidad", localidadesRouter);
app.use("/api/usuario", usuarioRouter);
app.use("/api/trabajos", trabajosRouter);
app.use("/api/resenia", reseniaRouter);
app.use("/api/post", postRouter);
app.use("/api/mp", MPRouter);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.use((_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).send({ message: "Ruta no encontrada" });
});

await syncSchema(); //never in production

app.listen(3000, () => {
  console.log("Server runnning on http://localhost:3000/");
});
