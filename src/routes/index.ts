import  blockchainRoutes  from './blockchain.route';
import  authRoutes  from './auth.route';
import merchantRouter from './merchant.route';
import { Router } from 'express';
import { authAndAttachUser } from '../middlewares/authAndAttachUser';


const mainRouter = Router();

mainRouter.use('/auth', authRoutes);
mainRouter.use(authAndAttachUser);
mainRouter.use('/blockchains', blockchainRoutes);
mainRouter.use('/merchant', merchantRouter);


export default mainRouter;

