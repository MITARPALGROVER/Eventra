# Eventra Backend Setup Guide

## 📋 Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one option:
   - **Local MongoDB**: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud - Free): [Sign up here](https://www.mongodb.com/cloud/atlas/register)

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd Backend
npm install
```

### Step 2: Configure Environment Variables

The `.env` file is already created with default settings:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eventra
JWT_SECRET=eventra-super-secret-key-change-in-production
```

**For MongoDB Atlas (Cloud):**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventra?retryWrites=true&w=majority
   ```

**For Local MongoDB:**
- Make sure MongoDB is running on your machine
- Default connection works: `mongodb://localhost:27017/eventra`

### Step 3: Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
```

---

## 📡 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### **Products**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/:id` - Update product (vendor only)
- `DELETE /api/products/:id` - Delete product (vendor only)
- `GET /api/products/vendor/:vendorId` - Get vendor's products

### **Bookings**
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/vendor/orders` - Get vendor orders

### **Users**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/favorites/:productId` - Add to favorites
- `DELETE /api/users/favorites/:productId` - Remove from favorites
- `GET /api/users/favorites` - Get favorites

### **Health Check**
- `GET /api/health` - Check API status

---

## 🧪 Testing the API

### Using Browser (for GET requests):
```
http://localhost:5000/api/health
http://localhost:5000/api/products
```

### Using Postman or Thunder Client:

**1. Register User:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "accountType": "vendor",
  "phone": "9876543210"
}
```

**2. Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**3. Create Product (use token from login):**
```
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Premium Sofa Set",
  "category": "furniture",
  "description": "Luxurious 3-seater sofa",
  "priceValue": 2500,
  "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
  "stock": 5
}
```

---

## 🔧 Troubleshooting

### MongoDB Connection Issues:

**Error: "MongoNetworkError"**
- Make sure MongoDB is running locally
- Or check your MongoDB Atlas connection string

**Local MongoDB not starting:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

**Check if MongoDB is running:**
```bash
# Windows
tasklist /FI "IMAGENAME eq mongod.exe"

# Mac/Linux
ps aux | grep mongod
```

### Port Already in Use:

If port 5000 is already in use, change it in `.env`:
```env
PORT=5001
```

---

## 📁 Project Structure

```
Backend/
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   ├── User.js           # User model
│   ├── Product.js        # Product model
│   └── Booking.js        # Booking model
├── routes/
│   ├── auth.js           # Auth routes
│   ├── products.js       # Product routes
│   ├── bookings.js       # Booking routes
│   └── users.js          # User routes
├── .env                  # Environment variables
├── package.json          # Dependencies
└── server.js             # Main server file
```

---

## 🔐 Security Notes

- Change `JWT_SECRET` in production to a secure random string
- Never commit `.env` file to version control
- Use HTTPS in production
- Implement rate limiting for production
- Add input validation and sanitization

---

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ORM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **nodemon** - Development auto-restart

---

## 🎯 Next Steps

1. Install MongoDB (local or Atlas)
2. Run `npm install` in Backend folder
3. Configure `.env` file
4. Start server with `npm run dev`
5. Test API endpoints
6. Connect frontend to backend (update API URLs in frontend)

---

## ✅ Success Checklist

- [ ] MongoDB installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured correctly
- [ ] Server starts without errors
- [ ] Can register a new user
- [ ] Can login and receive token
- [ ] Can create products (as vendor)
- [ ] Can fetch products

---

## 💡 Tips

- Use **MongoDB Compass** to visually inspect your database
- Use **Postman** or **Thunder Client** (VS Code extension) to test APIs
- Check `console.log` in terminal for debugging
- MongoDB Atlas free tier is perfect for development

---

Need help? Check the error messages in the terminal - they usually point to the issue!
