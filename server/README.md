# Server - Local Development

## Setup

1. Copy `.env.example` to `.env` and fill in your values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server in development mode:
   ```bash
   npm run dev
   ```

The server will run on [http://localhost:5000](http://localhost:5000) by default.

## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `PORT`: Port for the server (default: 5000)
- `STRIPE_SECRET_KEY`: Stripe secret key
