import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import 'reflect-metadata'
import { orm, syncSchema } from '../DB/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { Request, Response, NextFunction } from 'express'
import { provinciaRouter } from './provincia/provincia.routes.js'
import { profesionesRouter } from './profesion/profesion.routes.js'
import { administradorRouter } from './admin/admin.routes.js'
import { localidadesRouter } from './localidad/localidad.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { trabajosRouter } from './trabajos/trabajos.routes.js'


const app = express()
app.use(cors({
  origin: "http://localhost:5173", // El dominio del front
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json())
app.use(cookieParser());
//Despues de los middlewares de express
app.use((req: Request, res: Response, next: NextFunction) => {
  RequestContext.create(orm.em, next)
})
//Antes de los middlewares de rutas

app.use('/api/provincia', provinciaRouter)
app.use('/api/profesion', profesionesRouter)
app.use('/api/admin', administradorRouter)
app.use('/api/localidad', localidadesRouter)
app.use('/api/usuario', usuarioRouter)
app.use('/api/trabajos', trabajosRouter)

app.use((_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).send({ message: 'Not found' })
})

await syncSchema() //never in production

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})