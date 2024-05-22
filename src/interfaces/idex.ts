export interface IPayment {
  items: IProduct[];
  currency: string;
  total: string;
  description: string;
}

export interface IProduct {
  name: string;
  quantity: number;
  price: number;
}

export interface IPayment {
  IProduct: {
    name: string;
    sku: string;
    price: string;
    currency?: string;
    quantity: number;
  }[];
  currency: string;
  total: string;
  description: string;
}
