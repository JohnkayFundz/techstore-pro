🛒 TechStore Pro

"React" (https://img.shields.io/badge/React-19-blue)
"Node.js" (https://img.shields.io/badge/Node.js-Express-green)
"MongoDB" (https://img.shields.io/badge/MongoDB-Database-brightgreen)
"License" (https://img.shields.io/badge/License-MIT-yellow)

A modern full-stack MERN e-commerce application built with React, Node.js, Express.js, and MongoDB.

TechStore Pro is a production-style online shopping platform that demonstrates real-world full-stack development. It provides customers with a complete shopping experience including authentication, product discovery, cart management, checkout, and order tracking.

It also includes a powerful admin dashboard for managing products, orders, users, and store operations.

---

🚀 Live Demo

🌐 Frontend:
https://techstore-pro-two.vercel.app/

⚙️ Backend API:
https://techstore-pro-zonk.onrender.com

---

📸 Screenshots

Coming soon.

Recommended screenshots:

- Homepage
- Product listing page
- Product details page
- Shopping cart
- Checkout page
- Order history
- Admin dashboard

---

🎯 Project Purpose

TechStore Pro was built to demonstrate practical full-stack development skills, including:

- Building scalable React applications
- Creating REST APIs with Express.js
- Implementing secure authentication systems
- Managing application state with Context API
- Working with MongoDB databases
- Deploying full-stack applications

---

✨ Features

👤 Customer Features

✅ User registration and login
✅ Secure JWT authentication
✅ Protected user routes
✅ Browse products
✅ Product search
✅ Category filtering
✅ Product details pages
✅ Shopping cart system
✅ Persistent cart storage
✅ Wishlist functionality
✅ Checkout workflow
✅ Order history
✅ Responsive mobile-friendly design

---

🛠️ Admin Features

✅ Admin dashboard
✅ Store statistics overview
✅ Product management
✅ Create products
✅ Update products
✅ Delete products
✅ Order management
✅ Update order status
✅ User management
✅ Role-based authorization

---

🏗️ Application Architecture

TechStore Pro follows a full-stack client-server architecture.

Frontend

The React frontend handles:

- User interface
- Routing
- State management
- API communication
- Shopping experience

Communication with the backend is handled through Axios REST API requests.

---

Backend

The Node.js and Express.js backend handles:

- Authentication
- Business logic
- Product management
- Order processing
- User authorization
- Database operations

---

Database

MongoDB stores:

- Users
- Products
- Orders
- Application data

Mongoose is used for database modeling and queries.

---

🧰 Tech Stack

Frontend

- React 19
- Vite
- React Router
- Context API
- Axios
- CSS3

---

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Cookie Parser
- Helmet
- Morgan

---

Deployment & Tools

- Git
- GitHub
- MongoDB Atlas
- Cloudinary
- Vercel
- Render

---

📂 Project Structure

techstore-pro/

├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api/
│   │   └── utils/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
│
└── README.md

---

⚙️ Installation & Setup

Clone Repository

git clone https://github.com/JohnkayFundz/techstore-pro.git

cd techstore-pro

---

Frontend Setup

Navigate to client:

cd client

Install dependencies:

npm install

Create:

client/.env

Add:

VITE_API_URL=http://localhost:5000/api

Start development server:

npm run dev

Frontend runs on:

http://localhost:5173

---

Backend Setup

Open another terminal.

Navigate to server:

cd server

Install dependencies:

npm install

Create:

server/.env

Add:

PORT=5000

NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

Start backend:

npm run dev

Backend runs on:

http://localhost:5000

---

🔐 Authentication System

TechStore Pro uses:

- JWT authentication
- Protected routes
- Secure password hashing
- Role-based authorization
- Admin middleware

User roles:

customer
admin

---

📦 API Documentation

Authentication API

Method| Endpoint| Description
POST| "/api/auth/register"| Register new user
POST| "/api/auth/login"| Login user
POST| "/api/auth/logout"| Logout user
GET| "/api/auth/me"| Get current user

---

Products API

Method| Endpoint| Description
GET| "/api/products"| Get all products
GET| "/api/products/:id"| Get single product
POST| "/api/products"| Create product
PUT| "/api/products/:id"| Update product
DELETE| "/api/products/:id"| Delete product

---

Orders API

Method| Endpoint| Description
GET| "/api/orders"| Get user orders
POST| "/api/orders"| Create order
PUT| "/api/orders/:id"| Update order status

---

🚀 Deployment

Frontend:

- Hosted on Vercel

Backend:

- Hosted on Render

Database:

- Hosted on MongoDB Atlas

Images:

- Managed with Cloudinary

---

🧪 Development Commands

Frontend development:

npm run dev

Production build:

npm run build

Backend development:

npm run dev

---

🗺️ Future Improvements

Planned features:

⬜ Stripe payment integration
⬜ Product reviews and ratings
⬜ Email notifications
⬜ Advanced analytics dashboard
⬜ Coupon system
⬜ Inventory alerts
⬜ Multi-vendor marketplace
⬜ AI product recommendations

---

👨‍💻 Developer

Johnkay Fundz

Frontend Developer building modern web applications with React and JavaScript.

Experienced in developing full-stack applications using:

- React
- Node.js
- Express.js
- MongoDB

---

Skills

- React
- JavaScript
- HTML
- CSS
- Node.js
- Express.js
- MongoDB
- Git/GitHub

---

🌐 Links

Portfolio:

https://johnkayfundz.github.io/

GitHub:

https://github.com/JohnkayFundz

---

⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

Thank you for exploring TechStore Pro!

---

📄 License

This project is licensed under the MIT License.