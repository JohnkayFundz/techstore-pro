🛒 TechStore Pro

A modern full-stack MERN e-commerce application built with React, Node.js, Express, and MongoDB.

TechStore Pro delivers a complete online shopping experience with secure authentication, product browsing, cart management, checkout, order tracking, and a powerful admin dashboard for store management.

---

🚀 Live Demo

🌐 Frontend:
https://techstore-pro-two.vercel.app/

⚙️ Backend API:
https://techstore-pro-zonk.onrender.com

---

✨ Features

👤 Customer Features

✅ User registration and authentication
✅ Secure JWT login system
✅ Browse products
✅ Product search
✅ Category filtering
✅ Product details pages
✅ Shopping cart with persistent storage
✅ Wishlist functionality
✅ Checkout process
✅ Order history
✅ Responsive mobile-friendly design

---

🛠️ Admin Features

✅ Admin dashboard
✅ Product management
✅ Create, update, and delete products
✅ Order management
✅ Update order status
✅ User management
✅ Store statistics overview

---

🧰 Tech Stack

Frontend

- React 19
- Vite
- React Router
- Context API
- Axios
- CSS3

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

cd client

npm install

npm run dev

Create:

client/.env

Add:

VITE_API_URL=http://localhost:5000/api

---

Backend Setup

Open another terminal:

cd server

npm install

npm run dev

Create:

server/.env

Add:

PORT=5000

NODE_ENV=development

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

---

🔐 Authentication

TechStore Pro uses:

- JWT authentication
- Protected routes
- Role-based authorization
- Admin middleware

User roles:

customer
admin

---

📦 API Overview

Authentication

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Products

GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

Orders

GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id

---

📸 Screenshots

Coming soon.

Recommended screenshots:

- Homepage
- Product details page
- Cart page
- Checkout page
- Admin dashboard

---

🎯 Future Improvements

- Stripe payment integration
- Product reviews and ratings
- Email notifications
- Advanced analytics dashboard
- Coupon system
- Inventory alerts
- Multi-vendor marketplace support

---

👨‍💻 Developer

Johnkay Fundz

Frontend Developer building modern web applications with React and JavaScript, with experience developing full-stack applications using Node.js, Express, and MongoDB.

Skills

- React
- JavaScript
- HTML
- CSS
- Node.js
- Express
- MongoDB
- Git/GitHub

Portfolio:
https://johnkayfundz.github.io/

GitHub:
https://github.com/JohnkayFundz

---

⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

Thanks for exploring TechStore Pro!