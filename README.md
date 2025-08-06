# Bistro Boss Server

A comprehensive food delivery API with SSL Commerz payment integration, admin configuration management, and order processing system.

## 🚀 Live Demo

**API Base URL:** [https://bistro-boss-server-tau-three.vercel.app](https://bistro-boss-server-tau-three.vercel.app)

## 📋 Features

- 🔐 **User Authentication & Authorization**
- 🍽️ **Menu Management System**
- 📝 **Blog & Review System**
- 🛒 **Shopping Cart & Wishlist**
- 💳 **SSL Commerz Payment Integration**
- 📦 **Order Management**
- ⚙️ **Admin Configuration Dashboard**
- 🚚 **Shipping & Delivery Management**
- 🔧 **Maintenance Mode**

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **Payment:** SSL Commerz
- **Deployment:** Vercel
- **Security:** Helmet, CORS, Rate Limiting

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd bistro-boss-server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Start development server
npm run dev
```

## 🚀 Quick Start

### **Local Development:**
```bash
# Start the server locally
npm run dev

# Test the server
npm test

# Deploy to Vercel
npm run deploy
```

### **What you'll see when running locally:**
```
╔══════════════════════════════════════════════════════════════╗
║                    🍕 BISTRO BOSS SERVER 🍕                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🚀 Server Status: RUNNING                                   ║
║  📍 Local URL: http://localhost:5000                        ║
║  🌐 Live URL: https://bistro-boss-server-tau-three.vercel.app ║
║  📚 API Base: http://localhost:5000/api/v1                  ║
║  🔧 Environment: development                                 ║
║  🗄️  Database: MongoDB                                      ║
║  💳 Payment: SSL Commerz                                    ║
║                                                              ║
║  📋 Available Endpoints:                                    ║
║  • GET / - Welcome message                                  ║
║  • GET /api/v1/config - Public configuration                ║
║  • GET /api/v1/menus - Get all menus                        ║
║  • POST /api/v1/auth/login - User login                     ║
║  • POST /api/v1/orders - Create order                       ║
║                                                              ║
║  🔐 Admin Endpoints:                                         ║
║  • GET /api/v1/admin/config - Admin config                  ║
║  • GET /api/v1/admin/orders - All orders                    ║
║                                                              ║
║  🛠️  Development Commands:                                    ║
║  • npm run dev - Start with nodemon                         ║
║  • npm run deploy - Deploy to Vercel                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## ⚙️ Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=bistro_boss

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-secret-key

# Server Configuration
PORT=5000
NODE_ENV=development

# SSL Commerz Configuration
SSL_COMMERZ_STORE_ID=testbox
SSL_COMMERZ_STORE_PASSWORD=qwerty
SSL_COMMERZ_IS_LIVE=false

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

## 🚀 Vercel Deployment

### 1. **Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 2. **Set Environment Variables in Vercel Dashboard**

Go to your Vercel project settings and add these environment variables:

```env
# Database (Use MongoDB Atlas for production)
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=bistro_boss

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-secret-key

# SSL Commerz
SSL_COMMERZ_STORE_ID=testbox
SSL_COMMERZ_STORE_PASSWORD=qwerty
SSL_COMMERZ_IS_LIVE=false

# URLs (Update with your Vercel domains)
FRONTEND_URL=https://your-frontend-domain.vercel.app
BACKEND_URL=https://your-backend-domain.vercel.app
```

## 📚 API Documentation

### **Base URL:** `https://bistro-boss-server-tau-three.vercel.app/api/v1`

### **Authentication Endpoints**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh JWT token

### **Menu Endpoints**
- `GET /menus` - Get all menus
- `GET /menus/:id` - Get menu by ID
- `POST /admin/menus` - Create menu (Admin)
- `PUT /admin/menus/:id` - Update menu (Admin)
- `DELETE /admin/menus/:id` - Delete menu (Admin)

### **Order Endpoints**
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order by ID
- `PUT /orders/:id/cancel` - Cancel order
- `GET /admin/orders` - Get all orders (Admin)
- `PUT /admin/orders/:id/status` - Update order status (Admin)

### **Admin Configuration**
- `GET /admin/config` - Get admin configuration
- `PUT /admin/config/ssl-commerz` - Update SSL Commerz settings
- `PUT /admin/config/payment-collection` - Update payment collection
- `POST /admin/config/test-ssl-commerz` - Test SSL Commerz connection

### **Public Endpoints**
- `GET /config` - Get public configuration
- `GET /menus/chef/:chefId` - Get menus by chef

## 🔐 SSL Commerz Integration

### **Payment Flow:**
1. User creates order with SSL Commerz payment
2. System creates payment session
3. User redirected to SSL Commerz gateway
4. Payment processed and callback received
5. Order status updated based on payment result

### **Callback URLs (Update in SSL Commerz Dashboard):**
- Success: `https://bistro-boss-server-tau-three.vercel.app/api/v1/orders/payment/success`
- Fail: `https://bistro-boss-server-tau-three.vercel.app/api/v1/orders/payment/fail`
- Cancel: `https://bistro-boss-server-tau-three.vercel.app/api/v1/orders/payment/cancel`
- IPN: `https://bistro-boss-server-tau-three.vercel.app/api/v1/orders/payment/ipn`

## 🧪 Testing

### **Test the API:**
```bash
# Test basic connectivity
curl https://bistro-boss-server-tau-three.vercel.app/

# Test public config
curl https://bistro-boss-server-tau-three.vercel.app/api/v1/config

# Test menu endpoints
curl https://bistro-boss-server-tau-three.vercel.app/api/v1/menus
```

## 📱 Frontend Integration

### **Example API Call:**
```javascript
const response = await fetch('https://bistro-boss-server-tau-three.vercel.app/api/v1/menus', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const menus = await response.json();
```

## 🔧 Admin Dashboard Features

- **SSL Commerz Settings Management**
- **Payment Collection Phone Number Management**
- **General Site Settings**
- **Notification Preferences**
- **Maintenance Mode Control**
- **Order Statistics & Analytics**

## 🛡️ Security Features

- JWT Authentication
- Role-based Authorization
- Rate Limiting
- CORS Protection
- XSS Protection
- MongoDB Injection Protection
- Helmet Security Headers

## 📊 Database Schema

- **Users** - User accounts and authentication
- **Menus** - Food items and categories
- **Orders** - Order management and payment
- **Carts** - Shopping cart functionality
- **Reviews** - User reviews and ratings
- **AdminConfig** - Admin configuration settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email: support@bistroboss.com

---

**Bistro Boss Server** - Delicious food delivery API with secure payment processing! 🍕🍔🍜 