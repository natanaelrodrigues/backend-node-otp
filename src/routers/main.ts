import { Router } from "express";
import * as pingController from '../controllers/ping'
export const maintRouter = Router();

maintRouter.get('/ping', pingController.ping)