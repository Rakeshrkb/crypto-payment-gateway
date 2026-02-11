import { Router } from 'express';
import { signUp, signIn } from '../controllers/auth/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { verifySignUpSchema } from '../validators/auth.validator';


const authRouter = Router();


    authRouter.post('/signUp', validateRequest(verifySignUpSchema), signUp);

    authRouter.post('/signIn',validateRequest(verifySignUpSchema), signIn);

export default authRouter;