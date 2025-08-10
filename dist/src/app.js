import express from 'express';
import 'reflect-metadata';
import { orm, syncSchema } from '../DB/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { provinciaRouter } from './provincia/provincia.routes.js';
import { profesionesRouter } from './profesion/profesion.routes.js';
import { administradorRouter } from './admin/admin.routes.js';
import { localidadesRouter } from './localidad/localidad.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { trabajosRouter } from './trabajos/trabajos.routes.js';
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
await syncSchema(); //never in production
app.use('/api/provincia', provinciaRouter);
app.use('/api/profesion', profesionesRouter);
app.use('/api/admin', administradorRouter);
app.use('/api/localidad', localidadesRouter);
app.use('/api/usuario', usuarioRouter);
app.use('/api/trabajos', trabajosRouter);
app.use((_req, res, _next) => {
    return res.status(404).send({ message: 'Not found' });
});
app.listen(3000, () => {
    console.log('Server runnning on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map