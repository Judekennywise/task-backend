import express from "express";
import { InitializePayment, webHook } from "../../controller/payment/payment.controller";

const paymentRouter = express.Router()

paymentRouter.post("/initialize-payment", InitializePayment);
paymentRouter.post("/webhook", webHook);

export default paymentRouter;