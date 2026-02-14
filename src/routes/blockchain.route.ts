import { Router } from 'express';
import * as BlockchainController from '../controllers/merchant/blockchain.controller';
import { validateIntentThroughQuickNode, testQueueAndWorkers } from "../controllers/quickNode/quickNode.controller";



const blockchainRouter = Router();

    blockchainRouter.get('/getBlockchainDetails', BlockchainController.getBlockchainController);

    blockchainRouter.post('/getTokenDetails', BlockchainController.getTokensByChainIdController);
    
    blockchainRouter.get('/getAllTokensGroupedByChain', BlockchainController.getAllTokensGroupedByChainController);

    // blockchainRouter.post('/receive_quicknode_events',verifyQuickNodeToken, validateIntentThroughQuickNode );

    blockchainRouter.post('/receive_quicknode_events', validateIntentThroughQuickNode );

    blockchainRouter.post('/test-events', testQueueAndWorkers );



export default blockchainRouter;