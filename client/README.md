# Client - Local Development

## Setup

1. Copy `.env.example` to `.env` and fill in your values if needed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the client:
   ```bash
   npm start
   ```

The client will run on [http://localhost:3000](http://localhost:3000) by default and proxy API requests to the backend.

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)
