import { Router } from "express";
import * as MerchantConfigController from "../controllers/merchant/merchantConfig.controller";
import * as MerchantSubscriptionController from "../controllers/merchant/merchantSubscription";
import { verifyMerchantSelectionSchema } from "../validators/merchant.validator"; 
import { validateRequest } from "../middlewares/validateRequest";
import { createPaymentIntent } from '../controllers/merchant/paymentIntent.controller';
import { asyncHandler } from "../utils/asyncHandler.utils";
import { validateApiKey } from '../middlewares/authByApiKey';




const merchantRouter = Router();

merchantRouter.post('/createOrUpdateSelection', validateRequest(verifyMerchantSelectionSchema), MerchantSubscriptionController.createOrUpdateMerchantSelection);

merchantRouter.get('/getMySelection', MerchantSubscriptionController.getMerchantSubscriptionDetails);

merchantRouter.post('/createPaymentIntent',validateApiKey, asyncHandler(createPaymentIntent));

merchantRouter.post('/saveMerchantConfig', MerchantConfigController.saveMerchantConfig);

export default merchantRouter;