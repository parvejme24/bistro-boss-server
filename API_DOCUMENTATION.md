# Bistro Boss Server API Documentation

## 🔐 Authentication APIs

### Register User
- **POST** `/api/auth/register`
- **Description**: Register a new user
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "country": "USA",
    "state": "California",
    "region": "West Coast",
    "zipcode": "90210",
    "city": "Los Angeles",
    "detailsAddress": "123 Main St"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered",
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
  ```

### Login User
- **POST** `/api/auth/login`
- **Description**: Login user with email and password
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
  ```

### Get Current User
- **GET** `/api/auth/me`
- **Description**: Get current user data (complete user data including password)
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "User data retrieved",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "hashed_password",
      "phone": "+1234567890",
      "country": "USA",
      "state": "California",
      "region": "West Coast",
      "zipcode": "90210",
      "city": "Los Angeles",
      "detailsAddress": "123 Main St",
      "image": "profile_image_url",
      "role": "customer",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Logout User
- **POST** `/api/auth/logout`
- **Description**: Logout user (invalidate refresh token)
- **Body**:
  ```json
  {
    "refreshToken": "jwt_refresh_token"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

### Refresh Token
- **POST** `/api/auth/refresh-token`
- **Description**: Get new access token using refresh token
- **Body**:
  ```json
  {
    "refreshToken": "jwt_refresh_token"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Token refreshed",
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
  ```

---

## 👤 User Management APIs

### Get All Users (Admin Only)
- **GET** `/api/users`
- **Description**: Get all users (admin only)
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Users retrieved",
    "users": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "country": "USA",
        "state": "California",
        "region": "West Coast",
        "zipcode": "90210",
        "city": "Los Angeles",
        "detailsAddress": "123 Main St",
        "image": "profile_image_url",
        "role": "customer",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### Get Single User (Admin/Chef Only)
- **GET** `/api/users/:id`
- **Description**: Get single user by ID (admin/chef only)
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "User retrieved",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "country": "USA",
      "state": "California",
      "region": "West Coast",
      "zipcode": "90210",
      "city": "Los Angeles",
      "detailsAddress": "123 Main St",
      "image": "profile_image_url",
      "role": "customer",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Update User Role (Admin Only)
- **PATCH** `/api/users/:id/role`
- **Description**: Update user role (admin only)
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "role": "chef"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Role updated",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "country": "USA",
      "state": "California",
      "region": "West Coast",
      "zipcode": "90210",
      "city": "Los Angeles",
      "detailsAddress": "123 Main St",
      "image": "profile_image_url",
      "role": "chef",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Update User Profile
- **PATCH** `/api/users/profile`
- **Description**: Update current user profile
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Profile updated",
    "user": {
      "_id": "user_id",
      "name": "John Updated",
      "email": "john.updated@example.com",
      "phone": "+1234567890",
      "country": "USA",
      "state": "California",
      "region": "West Coast",
      "zipcode": "90210",
      "city": "Los Angeles",
      "detailsAddress": "123 Main St",
      "image": "profile_image_url",
      "role": "customer",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Change Password
- **PATCH** `/api/users/change-password`
- **Description**: Change current user password
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password changed"
  }
  ```

---

## 🔑 Authentication Flow

1. **Register/Login**: Get access token (15min) and refresh token (7 days)
2. **API Calls**: Use access token in Authorization header
3. **Token Expiry**: When access token expires, use refresh token to get new tokens
4. **Logout**: Invalidate refresh token

## 🛡️ Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Separate access and refresh tokens
- **Token Storage**: Refresh tokens stored in database with TTL
- **Role-based Access**: customer, chef, admin roles
- **Input Validation**: MongoDB sanitization and validation
- **Rate Limiting**: 100 requests per hour per IP
- **Security Headers**: Helmet, XSS protection, HPP protection

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   PORT=1010
   NODE_ENV=development
   DB_USER=your_mongodb_username
   DB_PASS=your_mongodb_password
   DB_NAME=bistro_boss_db
   JWT_SECRET=4a!Q8vZr$Km3@XyF^PtG6nLd#2wUeB9s
   JWT_REFRESH_SECRET=Nh5!cX3@WaQz#Tm79pV$LeYgR8^kuDbf
   ```

3. Start the server:
   ```bash
   npm start
   ```

## 📝 Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error 