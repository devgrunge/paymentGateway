import { Router } from 'express'
import paymentRouter from './payments/payment'

const router = Router();


router.use('/payments', paymentRouter)


export default router;