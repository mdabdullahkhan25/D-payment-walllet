# D-Payment Wallet

A digital payment wallet application built with the MERN stack (MongoDB, Express.js, React, Node.js) integrated with a payment gateway.

## Features

- User authentication (login and registration)
- Secure wallet management
- Fund transfers between users
- Payment processing via Stripe
- Transaction history and reporting
- Responsive UI with dark/light mode

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB for data storage
- JWT for authentication
- Stripe for payment processing

### Frontend
- React with Vite
- React Router for navigation
- Context API for state management
- Material UI, Chakra UI, and Bulma for UI components
- SASS for styling and animations

## Getting Started

### Prerequisites
- Node.js (v14 or newer)
- MongoDB (local or Atlas)
- Stripe account for API keys

### Installation

1. Clone the repository
```bash
git clone https://github.com/mdabdullahkhan25/D-payment-walllet
cd d-payment-wallet
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Set up environment variables
Create a `.env` file in the backend folder with the following contents:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

5. Start the development servers

For backend:
```bash
cd backend
npm run dev
```

For frontend:
```bash
cd frontend
npm run dev
```

## Usage

1. Register a new account
2. Log in to access your wallet
3. Add funds to your wallet using the Stripe payment gateway
4. Transfer funds to other users
5. View your transaction history

## Project Structure

```
d-payment-wallet/
├── backend/              # Express.js server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── server.js         # Entry point
│
└── frontend/             # React application
    ├── public/           # Static files
    └── src/              # Source files
        ├── components/   # React components
        ├── contexts/     # Context providers
        ├── pages/        # Page components
        ├── services/     # API services
        ├── styles/       # SASS styles
        └── utils/        # Utility functions
```

## Future Enhancements

- Multi-currency support
- Scheduled transfers
- Mobile app with React Native
- Enhanced analytics and reporting
- Integration with more payment providers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Stripe for payment processing
- MongoDB Atlas for database hosting
- Chakra UI, Material UI, and Bulma for UI components 