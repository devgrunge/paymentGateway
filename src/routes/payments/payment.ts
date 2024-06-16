import { Router } from "express"
import * as PaymentController from '../../controllers/paymentController'

const router = Router();

/* POST Routes */
router.post('/paypal', PaymentController.createPaypalOrder)
router.post('/credit', PaymentController.creditCardPayment)
router.post('/mbway', PaymentController.mbWayPayment)
router.post('/multibanco', PaymentController.bankTransferPayment)


/* GET Routes */
router.get('/paypal', PaymentController.paypalCallbackHandler)
router.get('/credit', PaymentController.creditCardCallbackHandler)
router.get('/multibanco', PaymentController.mbCallbackHandler)

export default router
