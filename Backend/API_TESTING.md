# 🧪 API Testing Examples

## Test these endpoints in your browser or Postman!

### 1. Health Check (Browser)
```
http://localhost:5000/api/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "message": "Eventra Backend API is running",
  "timestamp": "2025-11-20T..."
}
```

---

### 2. Register a Vendor (Postman/Thunder Client)

**POST** `http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "Raj",
  "lastName": "Kumar",
  "email": "raj@eventra.com",
  "password": "SecurePass123!",
  "accountType": "vendor",
  "phone": "9876543210"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "Raj",
      "lastName": "Kumar",
      "email": "raj@eventra.com",
      "accountType": "vendor",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**💡 Save the token! You'll need it for authenticated requests.**

---

### 3. Login (Postman/Thunder Client)

**POST** `http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "raj@eventra.com",
  "password": "SecurePass123!"
}
```

---

### 4. Create a Product (Requires Token)

**POST** `http://localhost:5000/api/products`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "title": "Luxury Wedding Sofa",
  "category": "furniture",
  "description": "Beautiful 3-seater sofa perfect for wedding stages",
  "priceValue": 3500,
  "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  "stock": 8
}
```

---

### 5. Get All Products (Browser or Postman)

**GET** `http://localhost:5000/api/products`

You can also filter:
- `http://localhost:5000/api/products?category=furniture`
- `http://localhost:5000/api/products?status=available`
- `http://localhost:5000/api/products?search=sofa`

---

### 6. Create a Booking (Requires Token)

**POST** `http://localhost:5000/api/bookings`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body:**
```json
{
  "items": [
    {
      "productId": "PRODUCT_ID_HERE",
      "title": "Luxury Wedding Sofa",
      "price": "₹3,500/hr",
      "quantity": 2,
      "image": "https://..."
    }
  ],
  "eventType": "wedding",
  "eventDate": "2025-12-25",
  "eventTime": "18:00",
  "rentalDuration": 6,
  "firstName": "Priya",
  "lastName": "Sharma",
  "email": "priya@example.com",
  "phone": "9876543210",
  "address": "123 MG Road",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "pricing": {
    "subtotal": 21000,
    "gst": 3780,
    "delivery": 500,
    "grandTotal": 25280
  }
}
```

---

## 🔑 Using Authorization Token

In Postman/Thunder Client:
1. Go to **Headers** tab
2. Add new header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

---

## 🌐 Install VS Code Extension

**Thunder Client** (recommended)
1. Open VS Code Extensions
2. Search "Thunder Client"
3. Install
4. Click Thunder Client icon in sidebar
5. Create new requests easily!

---

## 📝 Quick Test Script

Save this as `test.http` and use REST Client extension:

```http
### Health Check
GET http://localhost:5000/api/health

### Register Vendor
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "Vendor",
  "email": "vendor@test.com",
  "password": "Password123!",
  "accountType": "vendor",
  "phone": "9999999999"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "vendor@test.com",
  "password": "Password123!"
}

### Get Products
GET http://localhost:5000/api/products
```

---

## ✅ Testing Checklist

- [ ] Health endpoint works
- [ ] Can register a new vendor
- [ ] Can login and get token
- [ ] Can create a product with token
- [ ] Can view all products
- [ ] Can create a booking
- [ ] Can view user's bookings

---

Your backend is ready! 🎉
