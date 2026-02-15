# crypto-payment-gateway

### 🚀 Real-time Crypto Payment Gateway
A high-performance, event-driven crypto payment gateway backend built using Node.js, TypeScript, MongoDB, and QuickNode Streams.

Instead of inefficiently polling the blockchain for updates, this project utilizes QuickNode's KV Store to map expected payments to on-chain events in real-time.

### 🏗️ Architecture Flow
Merchant creates a payment intent (amount, token, recipient address).

Backend generates a unique intentId, calculates the exact token amount, and stores a composite key recipientAddress_exactAmount in QuickNode KV Store with the intentId as the value.

QuickNode Stream monitors the blockchain. When a transfer matches the compositeKey, the KV Store triggers a match.

QuickNode Webhook sends the matched intentId to our backend.

Backend updates the database to SUCCESS and notifies the frontend via Socket.io.

### 🛠️ Tech Stack
Runtime: Node.js

Language: TypeScript

Database: MongoDB (with Mongoose)

Blockchain Monitoring: QuickNode Streams & KV Store

Real-time Updates: Socket.io

Tunneling: Ngrok (for local testing)

### 📋 Prerequisites
Node.js (v18+)

MongoDB Atlas Account

QuickNode Account (with Streams add-on)


### ⚙️ Setup Instructions


```bash
git clone https://github.com/Rakeshrkb/crypto-payment-gateway.git
cd crypto-payment-gateway
npm install
```


Create a .env file in the root directory and add the following:

```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
INR_PER_USD=83.5
QUICKNODE_API_KEY=your_quicknode_api_key
```
```bash
npm run dev
```

To receive webhooks from QuickNode locally:
ngrok http 5000

Copy the https://...ngrok-free.dev URL and update your QuickNode Stream destination URL to YOUR_NGROK_URL/api/blockchains/receive_quicknode_events.

## API Reference

## AUTHENTICATION
```bash
POST /api/auth/signUp     # Register with email/password
POST /api/auth/signIn     # Login email/password
```
## GETTERS
```bash
GET /api/blockchains/getBlockchainDetails  # returns supported blockchains on the platforms
POST /api/blockchains/getTokenDetails?chainId=1  #returns supported tokens on that chain
```
## SETTERS
```bash
GET /api/merchant/getMySelection               # Returns chain and token selection 
POST /api/merchant/createOrUpdateSelection     # Creats or updates selections of blockchain and tokens 
POST /api/merchant/saveMerchantConfig          # Saves configurations for a merchant/user
```

### QUICKNODE EVENT LISTENER
```bash
POST /api/blockchains/receive_quicknode_events  # when a transaction matches with KV store, quicknode pushes here
``` 



## FUNCTIONALITIES
```bash 
POST /api/merchant/createPaymentIntent         # Creates an payment intent that server listens and updates on
```


### 📄 License
MIT