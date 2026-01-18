import express from "express";
import cors from "cors";
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
import { UPLOADS_DIR } from "./utils/upload.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { Trabajo } from "./trabajos/trabajos.entity.js";
import mercadopago from "mercadopago";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mpClient = new MercadoPagoConfig({
  accessToken: "APP_USR-462668344377533-011720-8d9514ed9fb2ecbacc3f084c1260f5fc-3141372906",
});

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

// configurar multer
/*const uploadsDir = path.join(process.cwd(), "uploads");
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (err: Error | null, destination: string) => void) => {
    cb(null, uploadsDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (err: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// servir archivos subidos
app.use("/uploads", express.static(uploadsDir));

// RequestContext middleware debe ir antes de las rutas
app.use((req: Request, res: Response, next: NextFunction) => {
  RequestContext.create(orm.em, next);
});

// ahora rutas y handlers (ya tienen RequestContext)
app.post("/upload", upload.single("image"), async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const { userId } = req.body;

    if (userId) {
      const em = RequestContext.getEntityManager(); // ahora disponible
      if (!em) {
        return res.status(500).json({ message: "EntityManager not available" });
      }
      const user = await em.findOne(Usuario, { id: String(userId) });
      if (!user) return res.status(404).json({ message: "User not found" });
      user.fotoUrl = imageUrl;
      await em.persistAndFlush(user);
    }

    return res.json({ imageUrl });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

//Despues de los middlewares de express
app.use((req: Request, res: Response, next: NextFunction) => {
  RequestContext.create(orm.em, next)
})
//Antes de los middlewares de rutas
*/

app.use("/uploads", express.static(UPLOADS_DIR));

//ENDPOINT para crear preferencia de pago
app.post("/create-preference", async (req: Request, res: Response) => {
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
});



app.use("/api/provincia", provinciaRouter);
app.use("/api/profesion", profesionesRouter);
app.use("/api/admin", administradorRouter);
app.use("/api/localidad", localidadesRouter);
app.use("/api/usuario", usuarioRouter);
app.use("/api/trabajos", trabajosRouter);
app.use("/api/resenia", reseniaRouter);
app.use(errorHandler);

app.use((_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).send({ message: "Ruta no encontrada" });
});

await syncSchema(); //never in production

app.listen(3000, () => {
  console.log("Server runnning on http://localhost:3000/");
});
