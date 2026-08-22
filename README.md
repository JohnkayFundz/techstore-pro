# 🛒 TechStore Pro

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?logo=cloudinary&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern full-stack MERN eCommerce application built with **React, Node.js, Express, and MongoDB**.

TechStore Pro demonstrates real-world full-stack development with authentication, product management, shopping cart functionality, wishlists, checkout, order management, admin features, image uploads, and responsive UI.

---

## 🌐 Live Demo

- **Frontend:** https://techstore-pro-two.vercel.app/
- **Backend API:** https://techstore-pro-zonk.onrender.com/

---

## 📸 Preview

Screenshots will be added soon.

Planned screenshots:

- Home Page
- Product Details
- Shopping Cart
- Checkout
- Admin Dashboard

---

# ✨ Features

## 👤 Customer Features

- User registration
- Secure login and logout
- JWT authentication
- Protected routes
- Browse products
- Product search
- Category filtering
- Product details
- Shopping cart
- Wishlist
- Checkout
- Place orders
- Order history
- Order cancellation
- Responsive design
- Toast notifications

## 🛠 Admin Features

- Admin dashboard
- Dashboard statistics
- Product CRUD
- Product image uploads
- User management
- Order management
- Protected admin routes
- Role-based authorization

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- JavaScript ES6+
- React Router DOM
- Context API
- Axios
- Framer Motion
- Chart.js
- Recharts
- Swiper
- Lucide React
- React Icons
- CSS3
- Responsive Design

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cookie Parser
- Helmet
- CORS
- Compression
- Morgan
- Express Rate Limit
- Multer
- Cloudinary
- Validator

## Development & Deployment Tools

- Git
- GitHub
- VS Code
- Postman
- Vercel
- Render
- MongoDB Atlas
- Cloudinary

---

# 🚀 Getting Started

Follow these steps to run TechStore Pro locally.

## 1. Clone the Repository

```bash
git clone https://github.com/JohnkayFundz/techstore-pro.git
cd techstore-pro
```

---

## 2. Install Frontend Dependencies

From the project root:

```bash
npm install
```

---

## 3. Install Backend Dependencies

Move into the server directory:

```bash
cd server
npm install
```

---

# 🔐 Environment Variables

TechStore Pro uses environment variables for:

- Frontend API configuration
- MongoDB database connection
- JWT authentication
- Cloudinary image storage
- Server configuration

## 4. Configure Frontend Environment Variables

From the project root, create:

```text
.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Configure Backend Environment Variables

Inside the `server` directory, create:

```text
server/.env
```

Add:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### ⚠️ Important

Never commit `.env` files or real credentials to GitHub.

Use the provided `.env.example` files as templates.

---

# 🗄️ Database Seeding

## 6. Seed the Database

From the `server` directory:

```bash
npm run seed
```

The seed command:

1. Connects to MongoDB.
2. Validates the seed data.
3. Removes existing product records.
4. Inserts the seed product dataset.
5. Displays the inserted products.
6. Closes the MongoDB connection.

### ⚠️ Warning

The seed command **deletes existing product records** before inserting the seed data.

Do not run the seed command against a production database unless you intentionally want to replace the existing product records.

---

# ▶️ Running the Application

## 7. Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend API will run at:

```text
http://localhost:5000
```

### Health Check

```text
http://localhost:5000/health
```

---

## 8. Start the Frontend

Open a **second terminal**.

Return to the project root:

```bash
cd ..
```

Then start the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

# 📂 Project Structure

```text
techstore-pro/
│
├── public/
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── utils/
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   ├── seeder.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# 🔐 Authentication

TechStore Pro uses **JWT-based authentication**.

Authentication includes:

- User registration
- User login
- User logout
- JWT token generation
- HTTP-only authentication cookies
- Bearer token authentication
- Protected API routes
- Admin authorization
- Role-based authorization
- Session restoration
- Login rate limiting
- Registration rate limiting

---

# 📦 API Overview

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/me` | Get current authenticated user |

---

## Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/:id` | Get a single product |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |

---

## Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create order |
| `GET` | `/api/orders/my-orders` | Get current user's orders |
| `GET` | `/api/orders/:id` | Get a specific order |
| `PATCH` | `/api/orders/:id/cancel` | Cancel an order |

---

## Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | API health check |

---

# ☁️ Deployment

## Frontend

The frontend is deployed using **Vercel**.

https://techstore-pro-two.vercel.app/

## Backend

The backend is deployed using **Render**.

https://techstore-pro-zonk.onrender.com/

## Database

**MongoDB Atlas** is used for database hosting.

## Image Storage

**Cloudinary** is used for product image storage and uploads.

---

# 🧪 Development

## Start Backend

```bash
cd server
npm run dev
```

## Start Frontend

Open another terminal from the project root:

```bash
npm run dev
```

## Create Production Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# 🔒 Security

The backend includes several security and performance measures:

- Helmet security headers
- CORS configuration
- JWT authentication
- HTTP-only cookies
- Password hashing with bcryptjs
- Login rate limiting
- Registration rate limiting
- Global API rate limiting
- Request compression
- Input validation
- Protected API routes
- Protected admin routes
- Role-based authorization
- Environment variables for sensitive credentials

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your changes.
5. Commit your changes.
6. Push your branch.
7. Open a Pull Request.

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ **Star on GitHub**.

It helps others discover the project and supports continued development.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

## John Kalumba

### GitHub

https://github.com/JohnkayFundz

### Portfolio

https://johnkayfundz.github.io/

---

Thank you for checking out **TechStore Pro!** 🚀