# 🛒 TechStore Pro

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite\&logoColor=white)

A modern **full-stack MERN eCommerce application** built with **React**, **Node.js**, **Express**, and **MongoDB**.

TechStore Pro is a responsive online shopping platform that demonstrates real-world full-stack development. Customers can browse products, search by category, manage their shopping cart and wishlist, securely place orders, and view their order history. Administrators can manage products, users, and orders through a protected admin dashboard.

---

# 🌐 Live Demo

### Frontend

https://techstore-pro-two.vercel.app/

### Backend API

https://techstore-pro-zonk.onrender.com/

---

# 📸 Preview

> Screenshots will be added soon.

* Home Page
* Product Details
* Shopping Cart
* Checkout
* Admin Dashboard

---

# ✨ Features

## 👤 Customer Features

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes
* Browse Products
* Product Search
* Category Filtering
* Product Details Page
* Shopping Cart
* Wishlist
* Checkout
* Place Orders
* Order History
* Cancel Orders
* Responsive Design
* Toast Notifications

---

## 🛠 Admin Features

* Admin Dashboard
* Dashboard Statistics
* Product Management (CRUD)
* User Management
* Order Management
* Protected Admin Routes

---

# 🛠 Tech Stack

## Frontend

* React 19
* Vite
* JavaScript (ES6+)
* React Router DOM
* Context API
* Axios
* CSS3
* Responsive Design

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Cookie Parser
* Helmet
* Morgan
* Multer
* Cloudinary

## Development Tools

* Git
* GitHub
* VS Code
* Postman
* Render
* Vercel

---

# 📂 Project Structure

```text
techstore-pro/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running this project, ensure you have:

* Node.js (v18 or later)
* npm
* MongoDB Atlas account
* Cloudinary account
* Git

---

## Clone the Repository

```bash
git clone https://github.com/JohnkayFundz/techstore-pro.git

cd techstore-pro
```

---

## Install Dependencies

### Install Frontend

```bash
cd client
npm install
```

### Install Backend

```bash
cd ../server
npm install
```

---

# ⚙ Environment Variables

Inside the **server** folder, create a `.env` file.

The easiest way is:

### Linux / macOS

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Then update the values:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# ▶ Running the Application

## Start Backend

```bash
cd server
npm run dev
```

Server runs at:

```text
http://localhost:5000
```

---

## Start Frontend

```bash
cd client
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

# 🔌 REST API

## Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |
| POST   | `/api/auth/logout`   |
| GET    | `/api/auth/me`       |

---

## Products

| Method | Endpoint                      |
| ------ | ----------------------------- |
| GET    | `/api/products`               |
| GET    | `/api/products/:id`           |
| POST   | `/api/products` *(Admin)*     |
| PUT    | `/api/products/:id` *(Admin)* |
| DELETE | `/api/products/:id` *(Admin)* |

---

## Orders

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | `/api/orders`            |
| GET    | `/api/orders/my-orders`  |
| GET    | `/api/orders/:id`        |
| PATCH  | `/api/orders/:id/cancel` |

---

## Users

Protected user management endpoints are available for administrators.

---

# 🔒 Authentication

The application uses:

* JSON Web Tokens (JWT)
* Protected Routes
* Role-Based Authorization
* HTTP Cookies
* Password Hashing with bcryptjs

---

# 🚀 Deployment

## Frontend

Hosted on **Vercel**

## Backend

Hosted on **Render**

## Database

MongoDB Atlas

## Image Storage

Cloudinary

---

# 🧪 Future Improvements

* Stripe Payment Integration
* Paystack Payment Integration
* Product Reviews & Ratings
* Email Verification
* Forgot Password via Email
* Coupon & Discount System
* Inventory Management
* Sales Analytics Dashboard
* Product Recommendations
* Recently Viewed Products
* Multi-language Support
* Dark Mode

---

# 📚 Learning Outcomes

This project strengthened my understanding of:

* React Architecture
* Component-Based Development
* Context API
* State Management
* REST API Development
* Express.js
* MongoDB & Mongoose
* Authentication & Authorization
* CRUD Operations
* File Uploads
* Cloudinary Integration
* Responsive Web Design
* Git & GitHub Workflow
* Full-Stack Application Deployment

---

# 👨‍💻 Developer

## John Kalumba

Full-Stack JavaScript Developer passionate about building scalable, responsive, and user-friendly web applications using React, Node.js, Express, and MongoDB.

### Portfolio

https://johnkayfundz.github.io/

### GitHub

https://github.com/JohnkayFundz

### LinkedIn

https://www.linkedin.com/in/john-kalumba-96b437323/

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# ⭐ Support

If you found this project useful, please consider giving it a **⭐ Star** on GitHub. It helps others discover the project and motivates continued development.

---

# 📄 License

This project is licensed under the **MIT License**.

---

Thank you for checking out **TechStore Pro**! 🚀
