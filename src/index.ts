import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import paypal from 'paypal-rest-sdk';
import { IPayment } from './interfaces/idex';
import dotenv from 'dotenv';

dotenv.config();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL } = process.env;

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('payment gateway');
});

/* 
Paypal configuration
*/
paypal.configure({
  mode: 'sandbox',
  client_id: PAYPAL_CLIENT_ID as string,
  client_secret: PAYPAL_CLIENT_SECRET as string,
});

/*
Paypal payments
*/
app.post('/', async (req: Request, res: Response) => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS');
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET
    ).toString('base64');
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return res.send(200).json(data.access_token);
  } catch (error) {
    console.error('Failed to generate Access Token:', error);
  }
});

app.post('/payments/paypal', (req: Request, res: Response) => {
  try {
    const { items, currency, total, description } = req.body as IPayment;

    const create_payment_obj = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        // return_url: 'http://localhost:3004/store/payment/execute-payment',
        return_url: `http://localhost:3000/payment/execute-payment`,
        cancel_url: `http://localhost:3000/store/payment/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: items.map((item: any) => ({
              name: item.name,
              sku: item.sku,
              price: item.price,
              currency: item.currency || currency,
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: currency,
            total: total,
          },
          description: description,
        },
      ],
    };

    paypal.payment.create(create_payment_obj, (error, payment) => {
      console.log('payment ===> ', payment);
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        // Redirect the user to the approval URL
        const approvalUrl = (payment.links as any).find(
          (link: any) => link.rel === 'approval_url'
        ).href;
        res.json({ approvalUrl });
      }
    });
  } catch (error) {
    res.send(500).json(`Internal server error : ${error}`);
    throw error;
  }
});

app.get('/payments/paypal-callback', (req: Request, res: Response) => {
  try {
    const { paymentId, payerId } = req.query as any;
    paypal.payment.execute(
      paymentId,
      { payer_id: payerId },
      (error, payment) => {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          console.log('payment ==>  ', payment);
          res.json({ success: true, data: payment });
          // save the reponse at the db
        }
      }
    );
  } catch (error) {
    throw error;
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
