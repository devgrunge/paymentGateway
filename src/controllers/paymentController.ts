import { NextFunction, Request, Response } from "express";
import paypal, { Payment as IPaypal } from 'paypal-rest-sdk';
import { CCARD_KEY, IFTHENPAY_API_URL_CREDIT_CART } from "../config/constants";
import { ICreditCardRequest, IPayment } from "../interfaces/payment";


/* Paypal methods */

export async function createPaypalOrder(req: Request, res: Response) {
    try {
      const { items, currency, total, description } = req.body;
  
      const create_payment_obj = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal',
        },
        redirect_urls: {
          return_url: 'http://localhost:3000/carrinho',
          cancel_url: `http://localhost:3000/carrinho?payment_status=cancelled`,
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
      paypal.payment.create(
        create_payment_obj,
        async (error, payment: IPaypal) => {
          if (error) {
            res.status(500).json({ error: error });
          } else {
            const approvalUrl = (payment.links as any).find(
              (link: any) => link.rel === 'approval_url'
            ).href;
  
            res.json({ success: true, message: approvalUrl });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ success: false,mesage: error });
    }
  }


  export async function getPaypalPayment(req: Request, res: Response) {
    try {
      const { paymentId, PayerID, token, orderId } = req.query as any;
      if (!token) {
        return res.status(401).json({ message: 'Could not validate request' });
      }
      const payment = paypal.payment.execute(
        paymentId,
        { payer_id: PayerID },
        async (error, payment: IPaypal) => {
          if (error) {
            res.status(500).json({ message: error.message });
          } else {
            let paymentUpdated = {
              orderId: orderId,
              amount: payment.transactions[0].amount.total,
              isPaid: true,
              paymentType: 'paypal',
              status: 'paid',
              requestId: paymentId,
            };
            // Use orderId wich is the same between the two collections to find and update both
            return res.json({ success: true, message: paymentUpdated });
          }
        }
      );
    } catch (error) {
      return res.status(500).json({success: false, mesage: error });
    }
  }


/* Ifthenpay methods */
/*
    Ifthenpay payment methods
*/
export async function creditCardPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId, amount, language } = req.body as ICreditCardRequest;
  
      const bodyRequest = {
        orderId: orderId,
        amount: amount, // Precisa de separador decinal Ex: 15.50
        successUrl: 'https://geonatlife.bdcadigital.dev/carrinho',
        errorUrl: 'https://geonatlife.bdcadigital.dev/carrinho?payment_status=',
        cancelUrl:
          'https://geonatlife.bdcadigital.dev/carrinho?payment_status=cancelled',
        // successUrl: 'http://localhost:3000/carrinho',
        // errorUrl: 'http://localhost:3000/carrinho?payment_status=',
        // cancelUrl: 'http://localhost:3000/carrinho?payment_status=cancelled',
        language: language ?? 'pt',
      };
  
      const response = await fetch(
        `${IFTHENPAY_API_URL_CREDIT_CART}/${CCARD_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify(bodyRequest),
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      if (!response.ok) {
        return res
          .status(500)
          .json({ message: 'Erro ao conectar-se à ifthenpay' });
      }
  
      const responseData = {
        status: response.status,
        data: await response.json(),
      };
  
      let paymentData: IPayment = {
        orderId: orderId,
        status: 'pending',
        amount: amount,
        isPaid: false,
        paymentType: 'credit_card',
        requestId: responseData.data.RequestId,
      };
  
  
      return res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ error: `Payment gateway error: ${error}` });
    }
  }



