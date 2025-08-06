# 🍕 Bistro Boss Server

<div align="center">

![Bistro Boss Server](https://img.shields.io/badge/Bistro%20Boss-Server%20API-blue?style=for-the-badge&logo=node.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.21+-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue?style=for-the-badge&logo=mongodb)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)
![SSL Commerz](https://img.shields.io/badge/Payment-SSL%20Commerz-orange?style=for-the-badge)

**A comprehensive, production-ready food delivery API with advanced payment integration, real-time order management, and scalable architecture.**

[🚀 Live Demo](https://bistro-boss-server-tau-three.vercel.app) • [📚 API Docs](#-api-documentation) • [🛠️ Tech Stack](#-tech-stack) • [📦 Installation](#-installation)

</div>

---

## 🌟 **Project Highlights**

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **Authentication** | JWT-based auth with role-based access control | ✅ Complete |
| 💳 **Payment Gateway** | SSL Commerz integration with webhook handling | ✅ Complete |
| 📦 **Order Management** | Real-time order tracking & status updates | ✅ Complete |
| 🛒 **Shopping Cart** | Persistent cart with item management | ✅ Complete |
| 📊 **Admin Dashboard** | Dynamic configuration & analytics | ✅ Complete |
| 🚚 **Shipping System** | Multi-zone shipping with cost calculation | ✅ Complete |
| 🔧 **Maintenance Mode** | Zero-downtime maintenance capability | ✅ Complete |
| 📱 **RESTful API** | 20+ endpoints with comprehensive CRUD | ✅ Complete |

---

## 🚀 **Live Demo & Quick Start**

<div align="center">

### **🌐 Production API**
**Base URL:** `https://bistro-boss-server-tau-three.vercel.app`

[![Try it now](https://img.shields.io/badge/Try%20it%20now-Live%20API-brightgreen?style=for-the-badge&logo=vercel)](https://bistro-boss-server-tau-three.vercel.app)

### **📱 Quick API Test**
```bash
# Test the live API
curl https://bistro-boss-server-tau-three.vercel.app/api/v1/menus
```

</div>

---

## 🛠️ **Tech Stack & Architecture**

<div align="center">

### **Backend Technologies**
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.21+-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.0+-880000?style=flat-square&logo=mongoose&logoColor=white)

### **Security & Performance**
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=json-web-tokens&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-Security-000000?style=flat-square&logo=helmet&logoColor=white)
![Rate Limiting](https://img.shields.io/badge/Rate%20Limiting-Enabled-red?style=flat-square)
![CORS](https://img.shields.io/badge/CORS-Enabled-blue?style=flat-square)

### **Payment & Deployment**
![SSL Commerz](https://img.shields.io/badge/SSL%20Commerz-Payment%20Gateway-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-Serverless-black?style=flat-square&logo=vercel&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP%20Client-5A29E4?style=flat-square&logo=axios&logoColor=white)

</div>

---

## 📊 **System Architecture**

```mermaid
graph TB
    A[Client App] --> B[Load Balancer]
    B --> C[API Gateway]
    C --> D[Authentication]
    C --> E[Menu Service]
    C --> F[Order Service]
    C --> G[Payment Service]
    C --> H[Admin Service]
    
    D --> I[(MongoDB)]
    E --> I
    F --> I
    G --> J[SSL Commerz]
    H --> I
    
    style A fill:#e1f5fe
    style I fill:#f3e5f5
    style J fill:#fff3e0
```

---

## 🚀 **Features Overview**

### **🔐 Authentication & Authorization**
- **JWT-based authentication** with refresh tokens
- **Role-based access control** (User, Chef, Admin)
- **Secure password hashing** with bcrypt
- **Token validation middleware**

### **🍽️ Menu Management System**
- **CRUD operations** for menu items
- **Category management** with nested structures
- **Image handling** with cloud storage
- **Search and filtering** capabilities
- **Chef-specific menu management**

### **💳 Payment Integration**
- **SSL Commerz payment gateway** integration
- **Secure payment processing** with webhooks
- **Transaction verification** and validation
- **Refund processing** capabilities
- **Payment status tracking**

### **📦 Order Management**
- **Real-time order tracking** with status updates
- **Order history** and analytics
- **Email notifications** for order updates
- **Order cancellation** with refund processing
- **Delivery time estimation**

### **🛒 Shopping Cart System**
- **Persistent cart** across sessions
- **Item quantity management**
- **Price calculation** with discounts
- **Cart synchronization** across devices

### **⚙️ Admin Configuration**
- **Dynamic SSL Commerz settings** management
- **Payment collection** phone number updates
- **Site configuration** from dashboard
- **Maintenance mode** control
- **Analytics and reporting**

---

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js 18+ 
- MongoDB Atlas account
- SSL Commerz merchant account

### **Quick Installation**

```bash
# Clone the repository
git clone https://github.com/parvejme24/bistro-boss-server.git
cd bistro-boss-server

# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Start development server
npm run dev
```

### **Environment Configuration**

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

---

## 🚀 **Deployment**

### **Vercel Deployment (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### **Environment Variables in Vercel**

Set these environment variables in your Vercel dashboard:

```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=bistro_boss
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
SSL_COMMERZ_STORE_ID=testbox
SSL_COMMERZ_STORE_PASSWORD=qwerty
SSL_COMMERZ_IS_LIVE=false
```

---

## 📚 **API Documentation**

### **Base URL:** `https://bistro-boss-server-tau-three.vercel.app/api/v1`

### **🔐 Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | User registration | ❌ |
| `POST` | `/auth/login` | User login | ❌ |
| `POST` | `/auth/refresh-token` | Refresh JWT token | ✅ |

### **🍽️ Menu Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/menus` | Get all menus | ❌ |
| `GET` | `/menus/:id` | Get menu by ID | ❌ |
| `POST` | `/admin/menus` | Create menu (Admin) | ✅ |
| `PUT` | `/admin/menus/:id` | Update menu (Admin) | ✅ |
| `DELETE` | `/admin/menus/:id` | Delete menu (Admin) | ✅ |

### **📦 Order Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/orders` | Create order | ✅ |
| `GET` | `/orders` | Get user orders | ✅ |
| `GET` | `/orders/:id` | Get order by ID | ✅ |
| `PUT` | `/orders/:id/cancel` | Cancel order | ✅ |
| `GET` | `/admin/orders` | Get all orders (Admin) | ✅ |
| `PUT` | `/admin/orders/:id/status` | Update order status (Admin) | ✅ |

### **⚙️ Admin Configuration**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/admin/config` | Get admin configuration | ✅ |
| `PUT` | `/admin/config/ssl-commerz` | Update SSL Commerz settings | ✅ |
| `PUT` | `/admin/config/payment-collection` | Update payment collection | ✅ |
| `POST` | `/admin/config/test-ssl-commerz` | Test SSL Commerz connection | ✅ |

---

## 🔐 **SSL Commerz Integration**

### **Payment Flow Architecture**

```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant S as SSL Commerz
    participant D as Database
    
    U->>A: Create Order
    A->>D: Save Order
    A->>S: Create Payment Session
    S->>U: Redirect to Payment Gateway
    U->>S: Complete Payment
    S->>A: Payment Callback
    A->>D: Update Order Status
    A->>U: Payment Confirmation
```

### **Callback URLs Configuration**

Configure these URLs in your SSL Commerz dashboard:

- **Success:** `https://bistro-boss-server-tau-three.vercel.app/api/v1/orders/payment/success`
- **Fail:** `https://bistro-boss-server-tau-three.vercel.app/api/v1/orders/payment/fail`
- **Cancel:** `https://bistro-boss-server-tau-three.vercel.app/api/v1/orders/payment/cancel`
- **IPN:** `https://bistro-boss-server-tau-three.vercel.app/api/v1/orders/payment/ipn`

---

## 🧪 **Testing**

### **API Testing**

```bash
# Test basic connectivity
curl https://bistro-boss-server-tau-three.vercel.app/

# Test menu endpoints
curl https://bistro-boss-server-tau-three.vercel.app/api/v1/menus

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://bistro-boss-server-tau-three.vercel.app/api/v1/orders
```

### **Local Testing**

```bash
# Start the server
npm run dev

# Run tests
npm test

# Test specific endpoints
curl http://localhost:5000/api/v1/menus
```

---

## 📊 **Database Schema**

### **Core Collections**

| Collection | Purpose | Key Features |
|------------|---------|--------------|
| **Users** | User accounts & authentication | JWT tokens, role-based access |
| **Menus** | Food items & categories | Image handling, pricing, categories |
| **Orders** | Order management & payment | Status tracking, payment integration |
| **Carts** | Shopping cart functionality | Persistent storage, item management |
| **Reviews** | User reviews & ratings | Rating system, moderation |
| **AdminConfig** | Admin configuration settings | Dynamic settings management |

---

## 🛡️ **Security Features**

<div align="center">

![Security](https://img.shields.io/badge/Security-Hardened-red?style=for-the-badge&logo=shield)

</div>

- **🔐 JWT Authentication** with secure token management
- **🛡️ Helmet Security Headers** for protection against common vulnerabilities
- **🔄 Rate Limiting** to prevent abuse and DDoS attacks
- **🌐 CORS Protection** for cross-origin request security
- **🧹 XSS Protection** with input sanitization
- **💉 MongoDB Injection Protection** with parameterized queries
- **🔒 Role-based Authorization** with granular permissions
- **🛡️ Input Validation** with comprehensive sanitization

---

## 📈 **Performance & Scalability**

- **⚡ Serverless Architecture** for automatic scaling
- **🗄️ MongoDB Atlas** for cloud database management
- **🔄 Connection Pooling** for optimal database performance
- **📦 Efficient Data Models** with proper indexing
- **🚀 CDN Integration** for static asset delivery
- **📊 Monitoring & Logging** for performance tracking

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Development Guidelines**

- Follow **ESLint** configuration
- Write **comprehensive tests**
- Update **documentation** for new features
- Follow **conventional commit messages**

---

## 📄 **License**

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 **Support & Contact**

<div align="center">

**Need help? Get in touch!**

[![Email](https://img.shields.io/badge/Email-support@bistroboss.com-blue?style=flat-square&logo=gmail)](mailto:support@bistroboss.com)
[![GitHub](https://img.shields.io/badge/GitHub-Issues-black?style=flat-square&logo=github)](https://github.com/parvejme24/bistro-boss-server/issues)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/parvejme24)

</div>

---

<div align="center">

### **🍕 Bistro Boss Server**

**Delicious food delivery API with enterprise-grade security and payment processing!**

[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/parvejme24/bistro-boss-server)

**Built with modern technologies for scalable, secure, and maintainable code.**

</div> 