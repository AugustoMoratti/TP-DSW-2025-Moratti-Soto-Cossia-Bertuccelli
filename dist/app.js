import express from 'express';
import { provinciaRouter } from './provincia/provincia.routes.js';
const app = express();
app.use(express.json());
app.use('/api/provincia', provinciaRouter);
app.use((_req, res, _next) => {
    return res.status(404).send({ message: 'Not found' });
});
app.listen(3000, () => {
    console.log('Server runnning on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map