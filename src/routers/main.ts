import { Router } from "express";
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'

export const maintRouter = Router();

maintRouter.get('/ping', pingController.ping);

maintRouter.post('/auth/signin', authController.signin)
maintRouter.post('/auth/signup', authController.signup)