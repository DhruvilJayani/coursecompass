import express from "express";
import { getUserController, loginController, registerController } from "../controllers/authController.js";
import { errorHandler } from "../error-handler.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const authRouter = express.Router();

authRouter.post('/register', rateLimiter, errorHandler(registerController))
authRouter.post('/login', rateLimiter, errorHandler(loginController))
authRouter.get('/me', authMiddleware, errorHandler(getUserController))

export default authRouter;