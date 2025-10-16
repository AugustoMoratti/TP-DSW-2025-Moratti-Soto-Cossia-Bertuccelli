import { Router } from 'express';
import { register, login, me } from './auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
// ...otros endpoints

export default router;