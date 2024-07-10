# Payment Gateway

This is a Payment Gateway application built with Node.js, Express, and TypeScript. It includes features such as PayPal payment integration and MongoDB for data storage.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
- [License](#license)

## Features

- PayPal payment integration
- MongoDB connection
- User model and basic routes
- Paypal Integration
- Ifthenpay Integration (Portuguese payment gategway)

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v18 or higher)
- [npm](https://www.npmjs.com/get-npm) (v6 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (for local development)

## Installation

Follow these steps to clone the repository, install dependencies, and run the application.

### 1. Clone the repository

```sh
git clone https://github.com/your-username/paymentGateway.git
cd paymentGateway
```

## 2. Install dependencies
```sh
npm install
```

## Running the application

```sh
npm run dev
```

## Environment Variables
Create a .env file in the root directory of the project and add the following variables:

```sh
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
MONGO_URI=your_mongo_db_connection_string
PORT=8000
```

## Endpoints
Payment Routes

 - POST /payment/paypal - Create a PayPal payment
 - POST /payment/paypal/execute - Execute a PayPal payment
 - GET /payment/paypal/plans - List all PayPal subscription plans
 - POST /payment/paypal/plans - Create a PayPal subscription plan
 - POST /payment/paypal/subscriptions - Create a PayPal subscription
 - GET /payment/paypal/subscriptions - List all active PayPal subscriptions


## License
This project is licensed under the MIT License. See the LICENSE file for details.
```sh
This README provides instructions for cloning, installing, and running the application, along with setting up environment variables and information about available endpoints.
```
