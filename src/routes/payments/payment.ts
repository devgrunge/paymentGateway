import { Router } from "express"
import * as PaymentController from '../../controllers/paymentController'

const router = Router();

/* Create paypal order */
router.post('/paypal', PaymentController.createPaypalOrder)

/* Paypal callback to confirm payment */
router.get('/paypal', PaymentController.getPaypalPayment)

router.post('/credit', PaymentController.creditCardPayment)

export default router
