# 🛒 TechStore Pro

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

**TechStore Pro** is a modern full-stack **MERN e-commerce application** built with React, Node.js, Express.js, and MongoDB.

The project demonstrates real-world full-stack development through customer authentication, product discovery, shopping cart management, checkout, order tracking, wishlist functionality, and an administrative dashboard.

It was designed as a production-style application to demonstrate practical frontend, backend, database, authentication, API, and deployment skills.

---

## 🚀 Live Demo

### 🌐 Frontend

https://techstore-pro-two.vercel.app/

### ⚙️ Backend API

https://techstore-pro-zonk.onrender.com

### 💻 GitHub Repository

https://github.com/JohnkayFundz/techstore-pro

---

## 📸 Screenshots

> Screenshots coming soon.

Recommended screenshots:

* 🏠 Homepage
* 🛍️ Product listing
* 📦 Product details
* 🛒 Shopping cart
* 💳 Checkout
* 📋 Order history
* 🛠️ Admin dashboard
* 📊 Admin management pages

---

## 🎯 Project Purpose

TechStore Pro was built to demonstrate practical full-stack development skills, including:

* Building scalable React applications
* Creating RESTful APIs with Express.js
* Implementing JWT authentication
* Protecting routes and resources
* Managing application state with React Context API
* Designing MongoDB data models
* Building CRUD functionality
* Implementing role-based authorization
* Connecting frontend applications to backend APIs
* Deploying full-stack applications

---

# ✨ Features

## 👤 Customer Features

* ✅ User registration
* ✅ User login/logout
* ✅ JWT authentication
* ✅ Protected user routes
* ✅ Browse products
* ✅ Product search
* ✅ Category filtering
* ✅ Product details
* ✅ Shopping cart
* ✅ Persistent cart storage
* ✅ Wishlist functionality
* ✅ Checkout workflow
* ✅ Order creation
* ✅ Order history
* ✅ Order details
* ✅ Order cancellation
* ✅ Responsive design

---

## 🛠️ Admin Features

* ✅ Admin dashboard
* ✅ Store statistics
* ✅ Product management
* ✅ Create products
* ✅ Update products
* ✅ Delete products
* ✅ Order management
* ✅ Update order status
* ✅ User management
* ✅ Role-based authorization
* ✅ Protected admin routes

---

# 🏗️ Application Architecture

TechStore Pro uses a **client-server architecture**.

```text
┌──────────────────────────────┐
│          React Client        │
│                              │
│  Pages • Components • State  │
│  Context API • Axios • Router│
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│      Node.js / Express       │
│                              │
│ Auth • Products • Orders     │
│ Users • Admin • Middleware   │
└──────────────┬───────────────┘
               │
               │ Mongoose
               ▼
┌──────────────────────────────┐
│           MongoDB            │
│                              │
│ Users • Products • Orders    │
└──────────────────────────────┘
```

---

# 🎨 Frontend

The React frontend is responsible for:

* User interface
* Application routing
* Product browsing
* Shopping cart
* Wishlist
* Authentication state
* Checkout workflow
* Order history
* API communication
* Responsive layouts

### Frontend Technologies

* React 19
* Vite
* React Router
* Context API
* Axios
* JavaScript
* HTML5
* CSS3

---

# ⚙️ Backend

The Express.js backend provides the REST API and handles:

* User authentication
* Password hashing
* JWT authentication
* Authorization
* Product CRUD operations
* Order creation
* Order management
* User management
* Database operations
* Request validation
* Security middleware

### Backend Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token
* bcryptjs
* Cookie Parser
* Helmet
* Morgan
* CORS
* Multer

---

# 🗄️ Database

MongoDB is used as the primary database.

Mongoose provides schema modeling and database interaction.

### Main Collections

```text
Users
Products
Orders
```

---

# 🧰 Tech Stack

| Category            | Technologies              |
| ------------------- | ------------------------- |
| Frontend            | React, Vite, React Router |
| State Management    | Context API               |
| API Communication   | Axios                     |
| Backend             | Node.js, Express.js       |
| Database            | MongoDB, Mongoose         |
| Authentication      | JWT, bcryptjs             |
| Security            | Helmet, CORS              |
| File Uploads        | Multer                    |
| Image Management    | Cloudinary                |
| Development         | Git, GitHub               |
| Frontend Deployment | Vercel                    |
| Backend Deployment  | Render                    |
| Database Hosting    | MongoDB Atlas             |

---

# 📂 Project Structure

```text
techstore-pro/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   │
│   └── public/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   └── server.js
│
├── package.json
└── README.md
```

---

# ⚡ Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/JohnkayFundz/techstore-pro.git
```

```bash
cd techstore-pro
```

---

## 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

## 3. Configure environment variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Never commit your real `.env` file to GitHub.

---

## 4. Start the backend

From the `server` directory:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## 5. Start the frontend

From the `client` directory:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Authentication & Authorization

TechStore Pro implements a JWT-based authentication system.

### Security Features

* JWT authentication
* Protected routes
* Password hashing with bcryptjs
* Authentication middleware
* Admin authorization middleware
* Role-based access control
* HTTP security headers with Helmet
* Environment-based secret configuration

### User Roles

```text
customer
admin
```

---

# 📦 API Documentation

## Authentication API

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user            |
| POST   | `/api/auth/login`    | Login user                     |
| POST   | `/api/auth/logout`   | Logout user                    |
| GET    | `/api/auth/me`       | Get current authenticated user |

---

## Products API

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/products`     | Get all products     |
| GET    | `/api/products/:id` | Get a single product |
| POST   | `/api/products`     | Create a product     |
| PUT    | `/api/products/:id` | Update a product     |
| DELETE | `/api/products/:id` | Delete a product     |

> Product creation, updating, and deletion require administrator authorization.

---

## Orders API

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| POST   | `/api/orders`            | Create an order           |
| GET    | `/api/orders/my-orders`  | Get current user's orders |
| GET    | `/api/orders/:id`        | Get a specific order      |
| PATCH  | `/api/orders/:id/cancel` | Cancel an order           |

---

# 🚀 Deployment

### Frontend

**Vercel**

https://techstore-pro-two.vercel.app/

### Backend

**Render**

https://techstore-pro-zonk.onrender.com

### Database

**MongoDB Atlas**

### Image Management

**Cloudinary**

---

# 🧪 Development Commands

### Start frontend

```bash
npm run dev
```

### Create production build

```bash
npm run build
```

### Start backend development server

```bash
npm run dev
```

---

# 🗺️ Future Improvements

The following features are planned for future versions:

* ⬜ Stripe payment integration
* ⬜ Product reviews and ratings
* ⬜ Email notifications
* ⬜ Advanced analytics dashboard
* ⬜ Coupon and discount system
* ⬜ Inventory alerts
* ⬜ Multi-vendor marketplace
* ⬜ AI-powered product recommendations
* ⬜ Advanced product filtering
* ⬜ Improved order tracking

---

# 👨‍💻 Developer

## John Kalumba

**Frontend Developer | React & JavaScript**

I build modern web applications with a focus on clean user interfaces, practical functionality, and full-stack development.

### Technical Skills

* React
* JavaScript
* HTML5
* CSS3
* Node.js
* Express.js
* MongoDB
* REST APIs
* Git & GitHub
* Vite
* JWT Authentication

---

# 🌐 Links

### Portfolio

https://johnkayfundz.github.io/

### GitHub

https://github.com/JohnkayFundz

### TechStore Pro

https://techstore-pro-two.vercel.app/

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

Your support is appreciated!

---

# 📄 License

This project is licensed under the **MIT License**.