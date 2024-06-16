export interface ICreditCardRequest {
    orderId: string;
    amount: string;
    successUrl: string;
    errorUrl: string;
    cancelUrl: string;
    language: string;
  }
  
  export interface IMbwayRequest {
    mbWayKey: string;
    orderId: string;
    amount: string;
    mobileNumber: string;
    email?: string;
    description?: string;
  }
  
  export interface IMultibancoRequest {
    mbKey: string;
    orderId: string;
    amount: string;
    description?: string;
    url?: string;
    clientCode?: string;
    clientName?: string;
    clientEmail?: string;
    clientUsername?: string;
    clientPhone?: string;
    expiryDays: number;
  }

  export interface IPayment {
    id?: string;
    amount: string;
    requestId?: string;
    sk?: string;
    error?: string;
    credit_card_brand?: string;
    pan?: string;
    message?: string;
    orderId?: string;
    status?: 'pending' | 'paid' | 'expired';
    entity?: string;
    reference?: string;
    key?: string;
    paymentDatetime?: string;
    expiry_date?: string;
    isPaid: boolean;
    paymentType: 'credit_card' | 'multibanco' | 'mbway' | 'paypal' | 'cashOnDelivery';
  }