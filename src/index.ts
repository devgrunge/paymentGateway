import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan'
import paypal from 'paypal-rest-sdk'
import router from './routes';
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from './config/constants';
import { logger } from './config/logger';
import databaseConnection from './config/db';


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

  

/* Paypal config */
paypal.configure({
  mode: 'sandbox',
  client_id: PAYPAL_CLIENT_ID as string,
  client_secret: PAYPAL_CLIENT_SECRET as string,
});


app.get('/', (req, res) => {
  res.send('payment gateway');
});

app.use(router)

databaseConnection()
  .then(() => {
    app.listen(port, () => logger.info(`app running on port ${port}`));
  })
  .catch((err) => {
    logger.error('SERVER error', err);
  });


export default app;
