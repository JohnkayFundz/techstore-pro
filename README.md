# 🛒 TechStore Pro

### Full-Stack MERN E-Commerce Application

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb\&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7)
![License](https://img.shields.io/badge/License-MIT-yellow)

**TechStore Pro** is a modern full-stack **MERN e-commerce application** built with React, Node.js, Express.js, and MongoDB.

The project demonstrates practical full-stack development through authentication, product discovery, shopping cart management, wishlist functionality, checkout, order management, role-based authorization, and an administrative dashboard.

It was built as a production-style project to demonstrate skills across **frontend development, backend APIs, databases, authentication, security, state management, and cloud deployment**.

---

## 🚀 Live Demo

### 🌐 Frontend

**[Open TechStore Pro](https://techstore-pro-two.vercel.app/)**

### ⚙️ Backend API

**[Open Backend API](https://techstore-pro-zonk.onrender.com)**

### 💻 Repository

**[View Source Code](https://github.com/JohnkayFundz/techstore-pro)**

---

## 📸 Screenshots

> Screenshots will be added soon.

Planned screenshots include:

* 🏠 Homepage
* 🛍️ Product listing
* 📦 Product details
* 🛒 Shopping cart
* 💳 Checkout
* 📋 Order history
* 🛠️ Admin dashboard
* 📊 Admin management pages

---

## 🎯 Project Highlights

TechStore Pro was created to demonstrate the ability to build a complete full-stack application from frontend to backend and database.

### What this project demonstrates

* ⚛️ Modern React application development
* 🔌 RESTful API development with Express.js
* 🔐 JWT-based authentication
* 👮 Protected routes and role-based authorization
* 🗄️ MongoDB database design with Mongoose
* 🛒 State management with React Context API
* ✏️ Full CRUD functionality
* 📦 Order and user management
* 🔗 Frontend/backend API integration
* 🛡️ Backend security middleware
* ☁️ Full-stack cloud deployment

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
* ✅ Responsive interface

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

TechStore Pro follows a **client-server architecture**.

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

MongoDB is used as the primary database, with Mongoose providing schema modeling and database interaction.

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
cd techstore-pro
```

---

## 2. Install dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../server
npm install
```

---

## 3. Configure environment variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

> ⚠️ Never commit real environment variables or secrets to GitHub.

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

Open another terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Authentication & Authorization

TechStore Pro implements JWT-based authentication and role-based authorization.

### Security Features

* JWT authentication
* Protected routes
* Password hashing with bcryptjs
* Authentication middleware
* Admin authorization middleware
* Role-based access control
* HTTP security headers with Helmet
* Environment-based secret configuration
* CORS configuration

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

**[TechStore Pro Frontend](https://techstore-pro-two.vercel.app/)**

### Backend

**Render**

**[TechStore Pro Backend API](https://techstore-pro-zonk.onrender.com)**

### Database

**MongoDB Atlas**

### Image Management

**Cloudinary**

---

# 🧪 Development Commands

### Frontend development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Backend development

```bash
npm run dev
```

---

# 🗺️ Roadmap

Planned improvements for future versions:

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

**Full-Stack JavaScript Developer | MERN Stack**

I build modern web applications with a focus on clean interfaces, practical functionality, and full-stack development.

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

* 🌐 **[Portfolio](https://johnkayfundz.github.io/portfolio-website/)**
* 💻 **[GitHub](https://github.com/JohnkayFundz)**
* 🛒 **[TechStore Pro Live Demo](https://techstore-pro-two.vercel.app/)**

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

Your support is appreciated!

---

# 📄 License

This project is licensed under the **MIT License**.
