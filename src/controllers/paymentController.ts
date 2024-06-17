import { NextFunction, Request, Response } from "express";
import paypal, { Payment as IPaypal } from 'paypal-rest-sdk';
import { CCARD_KEY, IFTHENPAY_API_URL_CREDIT_CART, IFTHENPAY_API_URL_MBWAY, IFTHENPAY_API_URL_SANDBOX_MULTIBANCO, MBWAY_KEY, MULTIBANCO_KEY } from "../config/constants";
import { ICreditCardRequest, IMbwayRequest, IMultibancoRequest, IPayment } from "../interfaces/payment";


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


  export async function paypalCallbackHandler(req: Request, res: Response) {
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
        amount: amount, // Amount values need to follow this pattern Ex: 15.50
        successUrl: 'http://localhost:3000/carrinho',
        errorUrl: 'http://localhost:3000/carrinho?payment_status=error',
        cancelUrl: 'http://localhost:3000/carrinho?payment_status=cancelled',
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
          .json({ message: 'Error conecting to ifthenpay' });
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

  export async function creditCardCallbackHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, amount, requestId, sk, orderId } = req.query;
      if (!sk) {
        res.status(400).json({ success: false ,message: 'Payment error!' });
      }
      const paymentData: IPayment = {
        id: id as string,
        amount: amount as string,
        requestId: requestId as string,
        sk: sk as string,
        isPaid: true,
        paymentType: 'credit_card',
        status: 'paid',
      };
     
      res.status(201).json({ success: true, message: paymentData });
    } catch (error) {
      res.status(500).json({ success: false , mesage: error });
    }
  }

/* Mb Way */

export async function mbWayPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId, amount, mobileNumber, email, description } =
        req.body as IMbwayRequest;
  
      const requestBody = {
        mbWayKey: MBWAY_KEY,
        orderId: orderId,
        amount: amount,
        mobileNumber: mobileNumber,
        email: email ?? '',
        description: description ?? '',
      };
  
      const response = await fetch(IFTHENPAY_API_URL_MBWAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      if (!responseData.RequestId || !responseData.Message) {
        throw new Error('Invalid response data from payment gateway');
      }
  
      const paymentData = {
        orderId: orderId,
        amount: responseData.Amount,
        message: responseData.Message,
        requestId: responseData.RequestId,
        status: 'pending',
        isPaid: false,
        paymentType: 'mbway',
      };
  
      res.status(200).json({ success: true, message: paymentData });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  export async function bankTransferPayment(req: Request, res: Response) {
    try {
      const {
        orderId,
        amount,
        description,
        url,
        clientCode,
        clientName,
        clientEmail,
        clientUsername,
        clientPhone,
        expiryDays,
      } = req.body as IMultibancoRequest;
  
      const requestBody = {
        mbKey: MULTIBANCO_KEY,
        orderId: orderId,
        amount: amount,
        description: description ?? '',
        url: url ?? '',
        clientCode: clientCode ?? '',
        clientName: clientName ?? '',
        clientEmail: clientEmail ?? '',
        clientUsername: clientUsername ?? '',
        clientPhone: clientPhone ?? '',
        expiryDays: expiryDays ?? 0,
      };
  
      const response = await fetch(IFTHENPAY_API_URL_SANDBOX_MULTIBANCO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = {
        status: response.status,
        data: await response.json(),
      };
  
      const paymentData = {
        status: 'pending',
        isPaid: false,
        paymentType: 'multibanco',
        orderId: responseData.data.OrderId,
        amount: responseData.data.Amount,
        entity: responseData.data.Entity,
        reference: responseData.data.Reference,
        requestId: responseData.data.RequestId,
        expiry_date: responseData.data.ExpiryDate,
      };


      res.status(200).json({success: true, message: paymentData});
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  export async function mbCallbackHandler(req: Request, res: Response) {
    try {
      const { orderId, amount, requestId, entity, reference, payment_datetime } =
        req.query as Record<string, string | undefined>;
  
      if (!orderId || !amount || !requestId || !payment_datetime) {
        return res.status(400).send('Missing required query parameters');
      }
      const paidOrder = {
        orderId,
        amount,
        requestId,
        entity,
        reference,
        payment_datetime
      }

      res.status(200).json({ success: true, message: paidOrder });
    } catch (error) {
      res.status(500).json({success: false, message: error});
    }
  }