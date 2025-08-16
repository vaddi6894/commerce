# 🛍️ Shoppie - Full-Stack E-Commerce Platform

A modern, feature-rich e-commerce platform built with React, Node.js, and MongoDB. Shoppie provides a complete online shopping experience with user authentication, product management, shopping cart, wishlist, payment processing, and admin dashboard.

## ✨ Features

### 🛒 Customer Features
- **Product Browsing**: Browse products with search and category filtering
- **Product Details**: View detailed product information with ratings
- **Shopping Cart**: Add/remove items with quantity management
- **Wishlist**: Save favorite products for later
- **User Authentication**: Secure registration and login system
- **User Profile**: Manage personal information and addresses
- **Order Management**: View order history and track orders
- **Secure Checkout**: Stripe-powered payment processing
- **Responsive Design**: Mobile-first design with Tailwind CSS

### 👨‍💼 Admin Features
- **Dashboard**: Overview of sales, orders, and user statistics
- **Product Management**: Add, edit, and delete products
- **Order Management**: Process and update order status
- **User Management**: View and manage user accounts
- **Inventory Control**: Track product stock levels

### 🛠️ Technical Features
- **Real-time Updates**: Live cart and wishlist synchronization
- **Search & Filtering**: Advanced product search with category filtering
- **Payment Integration**: Secure Stripe payment processing
- **Email Notifications**: Order confirmations and updates
- **PWA Ready**: Progressive Web App capabilities
- **SEO Optimized**: Meta tags and structured data

## 🏗️ Architecture

### Frontend (React)
- **React 19** with modern hooks and context API
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Heroicons** for beautiful icons
- **Context API** for state management
- **Stripe Elements** for payment processing

### Backend (Node.js)
- **Express.js** RESTful API
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Stripe** for payment processing
- **Nodemailer** for email notifications
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
commerce/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── api/           # API configuration
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd commerce
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically seed sample products on first run

5. **Start the application**
   ```bash
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend (from client directory)
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin only)

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

### Reviews
- `POST /api/reviews` - Add product review
- `GET /api/reviews/:productId` - Get product reviews

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for production and development
- **Environment Variables**: Sensitive data stored in .env
- **Stripe Security**: PCI-compliant payment processing

## 🎨 UI/UX Features

- **Modern Design**: Clean, minimalist interface
- **Responsive Layout**: Works on all device sizes
- **Smooth Animations**: CSS transitions and micro-interactions
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Customization

### Styling
The project uses Tailwind CSS for styling. Customize the design by modifying:
- `client/tailwind.config.js` - Tailwind configuration
- `client/src/index.css` - Global styles
- Component-specific CSS classes

### Features
- Add new product categories in the product model
- Extend user roles in the user model
- Add new payment methods in payment controller
- Customize email templates in utils/email.js

## 📦 Deployment

### Frontend Deployment
```bash
cd client
npm run build
```
Deploy the `build` folder to your hosting service (Vercel, Netlify, etc.)

### Backend Deployment
```bash
cd server
npm start
```
Deploy to platforms like Heroku, Railway, or DigitalOcean.

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Stripe](https://stripe.com/) - Payment processing
- [Heroicons](https://heroicons.com/) - Icons

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Shopping! 🛍️**
