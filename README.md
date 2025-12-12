# Agro Connect - E-Commerce Platform for Agricultural Products

A full-stack MERN e-commerce application for buying and selling agricultural products and farm equipment.

## Features

- 🔐 User Authentication (JWT-based)
- 🛍️ Product Catalog with Search & Filter
- 🛒 Shopping Cart Management
- 📦 Order Management System
- 👨‍💼 Seller Dashboard
- 📱 Responsive Modern UI

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Modern CSS

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT Authentication

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

4. Seed the database with products:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Default Credentials

After seeding:
- **Seller Account**: 
  - Email: `seller@agroconnect.test`
  - Password: `seller123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (seller/admin only)
- `PUT /api/products/:id` - Update product (seller/admin only)
- `DELETE /api/products/:id` - Delete product (seller/admin only)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update/:itemId` - Update cart item (protected)
- `DELETE /api/cart/remove/:itemId` - Remove cart item (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id/status` - Update order status (seller/admin only)

## Project Structure

```
agro-connect/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
├── server/          # Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── scripts/
```

## License

ISC


