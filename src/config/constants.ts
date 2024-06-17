import dotenv from 'dotenv'

dotenv.config()

const IFTHENPAY_API_URL_CREDIT_CART = process.env.IFTHENPAY_API_URL_CREDIT_CART as string
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET as string;
const PAYPAL_API_URL = process.env.PAYPAL_API_URL as string;
const CCARD_KEY = process.env.CCARD_KEY as string;
const IFTHENPAY_API_URL_MBWAY = process.env.IFTHENPAY_API_URL_MBWAY as string
const MBWAY_KEY = process.env.MBWAY_KEY as string
const IFTHENPAY_API_URL_SANDBOX_MULTIBANCO = process.env.IFTHENPAY_API_URL_SANDBOX_MULTIBANCO as string
const MULTIBANCO_KEY = process.env.MULTIBANCO_KEY as string
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING as string;
const DB_PASSWORRD = process.env.DB_PASSWORRD as string;
const DB_USERNAME = process.env.DB_USERNAME as string;

export { 
    IFTHENPAY_API_URL_CREDIT_CART,
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET,
    PAYPAL_API_URL,
    CCARD_KEY,
    IFTHENPAY_API_URL_MBWAY,
    MBWAY_KEY,
    IFTHENPAY_API_URL_SANDBOX_MULTIBANCO,
    MULTIBANCO_KEY,
    DB_CONNECTION_STRING,
    DB_PASSWORRD,
    DB_USERNAME
}