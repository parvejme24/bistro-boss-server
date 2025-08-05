# User Authentication API Documentation

## Base URL
```
http://localhost:5000/api/users
```

## Authentication
Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Register User
**POST** `/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### 2. Login User
**POST** `/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### 3. Logout User
**POST** `/logout`

**Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### 4. Refresh Access Token
**POST** `/refresh-token`

**Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "new_jwt_access_token"
}
```

### 5. Get User Profile
**GET** `/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "phone": "+1234567890",
    "image": "profile_image_url",
    "address": {
      "country": "USA",
      "state": "CA",
      "region": "West Coast",
      "zipcode": "90210",
      "city": "Los Angeles",
      "detailsAddress": "123 Main Street, Apt 4B"
    },
    "chefProfile": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Chef Profile Response (if role is chef):**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "_id": "user_id",
    "email": "chef@example.com",
    "name": "Chef John",
    "role": "chef",
    "phone": "+1234567890",
    "image": "profile_image_url",
    "address": {
      "country": "USA",
      "state": "CA",
      "region": "West Coast",
      "zipcode": "90210",
      "city": "Los Angeles",
      "detailsAddress": "123 Main Street, Apt 4B"
    },
    "chefProfile": {
      "_id": "chef_profile_id",
      "user": "user_id",
      "displayName": "Chef John's Kitchen",
      "chefImage": "chef_image_url",
      "chefDescription": "Experienced chef specializing in Italian cuisine",
      "chefRating": 4.5,
      "chefReviews": 25,
      "chefOrders": 150,
      "chefEarnings": 2500.00,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Update User Profile
**PUT** `/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890",
  "address": {
    "country": "USA",
    "state": "CA",
    "city": "Los Angeles",
    "zipcode": "90210"
  },
  "image": "profile_image_url"
}
```

### 7. Update User Password
**PUT** `/password`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password updated successfully. Please login again with your new password."
}
```

**Chef Profile Update Body (if role is chef):**
```json
{
  "name": "Chef John Smith",
  "phone": "+1234567890",
  "address": {
    "country": "USA",
    "state": "CA",
    "city": "Los Angeles",
    "zipcode": "90210"
  },
  "image": "profile_image_url",
  "chefProfile": {
    "displayName": "Chef John's Gourmet Kitchen",
    "chefImage": "chef_profile_image_url",
    "chefDescription": "Award-winning chef with 10+ years of experience in fine dining"
  }
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Smith",
    "phone": "+1234567890",
    "address": {
      "country": "USA",
      "state": "CA",
      "city": "Los Angeles",
      "zipcode": "90210"
    }
  }
}
```

**Chef Profile Update Response (if role is chef):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "email": "chef@example.com",
    "name": "Chef John Smith",
    "phone": "+1234567890",
    "address": {
      "country": "USA",
      "state": "CA",
      "city": "Los Angeles",
      "zipcode": "90210"
    },
    "chefProfile": {
      "_id": "chef_profile_id",
      "displayName": "Chef John's Gourmet Kitchen",
      "chefImage": "chef_profile_image_url",
      "chefDescription": "Award-winning chef with 10+ years of experience in fine dining",
      "chefRating": 4.5,
      "chefReviews": 25,
      "chefOrders": 150,
      "chefEarnings": 2500.00,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 8. Get All Users (Admin Only)
**GET** `/all`

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "users": [
    {
      "_id": "user_id_1",
      "email": "user1@example.com",
      "name": "John Doe",
      "role": "customer"
    },
    {
      "_id": "user_id_2",
      "email": "user2@example.com",
      "name": "Jane Smith",
      "role": "chef"
    }
  ]
}
```

### 9. Update User Role (Admin Only)
**PUT** `/:userId/role`

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Body:**
```json
{
  "role": "chef"
}
```

**Response:**
```json
{
  "message": "User role updated successfully",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "chef"
  }
}
```



## Error Responses

### 400 Bad Request
```json
{
  "message": "User already exists with this email"
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Invalid or expired access token"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Registration failed",
  "error": "Error details"
}
```

## Token Information

- **Access Token**: Valid for 15 minutes
- **Refresh Token**: Valid for 7 days
- **Token Storage**: Refresh tokens are stored in the database for security

## User Roles

- `customer`: Regular user
- `chef`: Chef user with additional privileges and chef profile
- `admin`: Administrator with full access

## Chef Profile Features

When a user has the role of "chef", they get access to additional profile information:

### Chef Profile Fields:
- `displayName`: Chef's business/kitchen name
- `chefImage`: Chef's profile image
- `chefDescription`: Chef's description and specialties
- `chefRating`: Average rating (read-only, managed by system)
- `chefReviews`: Number of reviews (read-only, managed by system)
- `chefOrders`: Number of orders completed (read-only, managed by system)
- `chefEarnings`: Total earnings (read-only, managed by system)

### Chef Profile Behavior:
- Chef profile is automatically created when a user's role is changed to "chef"
- Only `displayName`, `chefImage`, and `chefDescription` can be updated by the chef
- Rating, reviews, orders, and earnings are managed by the system based on user interactions
- Chef profile data is included in profile responses for chef users 