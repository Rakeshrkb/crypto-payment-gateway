import { Router, raw } from "express";
import * as BlockchainController from "../controllers/merchant/blockchain.controller";
import {
  validateIntentThroughQuickNode,
  testQueueAndWorkers,
} from "../controllers/quickNode/quickNode.controller";
import { verifyQuickNodePayload } from "../middlewares/authQuickNode";

const blockchainRouter = Router();

blockchainRouter.get(
  "/getBlockchainDetails",
  BlockchainController.getBlockchainController,
);

blockchainRouter.get(
  "/tokens",
  BlockchainController.getTokensByChainIdController,
);

blockchainRouter.get(
  "/getAllTokensGroupedByChain",
  BlockchainController.getAllTokensGroupedByChainController,
);

// blockchainRouter.post('/receive_quicknode_events', verifyQuickNodeToken, validateIntentThroughQuickNode );

blockchainRouter.post(
  "/receive_quicknode_events",
  raw({ type: "application/json" }),
  verifyQuickNodePayload,
  validateIntentThroughQuickNode,
);

blockchainRouter.post("/test-events", testQueueAndWorkers);

export default blockchainRouter;
