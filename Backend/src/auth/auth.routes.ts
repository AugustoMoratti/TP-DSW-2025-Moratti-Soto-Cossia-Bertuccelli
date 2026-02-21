import { Router } from 'express';
import { forgotPassword, resetPassword } from './auth.controller.js';

const authrouter = Router();

authrouter.post('/forgot-password', forgotPassword);
authrouter.post('/reset-password', resetPassword);

export default authrouter;