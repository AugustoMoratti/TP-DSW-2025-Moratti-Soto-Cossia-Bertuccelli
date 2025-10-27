import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import 'reflect-metadata'
import { syncSchema } from '../DB/orm.js'
import { Request, Response, NextFunction } from 'express'
import { provinciaRouter } from './provincia/provincia.routes.js'
import { profesionesRouter } from './profesion/profesion.routes.js'
import { administradorRouter } from './admin/admin.routes.js'
import { localidadesRouter } from './localidad/localidad.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { trabajosRouter } from './trabajos/trabajos.routes.js'
import { reseniaRouter } from './resenia/resenia.routes.js';
import { UPLOADS_DIR } from './utils/upload.js';

const app = express()
app.use(cors({
  origin: "http://localhost:5173", // El dominio del front
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json())
app.use(cookieParser());

// configurar multer
/*const uploadsDir = path.join(process.cwd(), "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
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

app.use('/api/provincia', provinciaRouter)
app.use('/api/profesion', profesionesRouter)
app.use('/api/admin', administradorRouter)
app.use('/api/localidad', localidadesRouter)
app.use('/api/usuario', usuarioRouter)
app.use('/api/trabajos', trabajosRouter)
app.use('/api/resenia', reseniaRouter)

app.use((_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).send({ message: 'Not found' })
})

await syncSchema() //never in production

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})