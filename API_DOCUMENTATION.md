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

---

## 🏷️ Category Management APIs

### Get All Categories
- **GET** `/api/v1/categories`
- **Description**: Get all categories
- **Response**:
  ```json
  {
    "message": "Categories retrieved",
    "categories": [
      {
        "_id": "category_id",
        "name": "Main Course",
        "image": "main_course_image_url",
        "description": "Delicious main course dishes",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### Get Single Category
- **GET** `/api/v1/categories/:id`
- **Description**: Get single category by ID
- **Response**:
  ```json
  {
    "message": "Category retrieved",
    "category": {
      "_id": "category_id",
      "name": "Main Course",
      "image": "main_course_image_url",
      "description": "Delicious main course dishes",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Create Category (Admin Only)
- **POST** `/api/v1/categories`
- **Description**: Create a new category
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "name": "Desserts",
    "image": "desserts_image_url",
    "description": "Sweet and delicious desserts"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Category created",
    "category": {
      "_id": "category_id",
      "name": "Desserts",
      "image": "desserts_image_url",
      "description": "Sweet and delicious desserts",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Update Category (Admin Only)
- **PATCH** `/api/v1/categories/:id`
- **Description**: Update category
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "name": "Sweet Desserts",
    "description": "Updated description for desserts"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Category updated",
    "category": {
      "_id": "category_id",
      "name": "Sweet Desserts",
      "image": "desserts_image_url",
      "description": "Updated description for desserts",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Delete Category (Admin Only)
- **DELETE** `/api/v1/categories/:id`
- **Description**: Delete category
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Category deleted"
  }
  ```

---

## 🍔 Menu Management APIs

### Get All Menu Items
- **GET** `/api/v1/menus`
- **Description**: Get all menu items
- **Response**:
  ```json
  {
    "message": "Menus retrieved",
    "menus": [
      {
        "_id": "menu_id",
        "name": "Grilled Chicken",
        "image": "chicken_image_url",
        "price": 25.99,
        "discount": 5,
        "shortDescription": "Delicious grilled chicken",
        "description": "Fresh grilled chicken with herbs and spices",
        "ingredients": ["chicken", "herbs", "spices"],
        "category": {
          "_id": "category_id",
          "name": "Main Course"
        },
        "createdBy": {
          "_id": "user_id",
          "name": "Chef John"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### Get Menu by ID
- **GET** `/api/v1/menus/:id`
- **Description**: Get single menu by ID
- **Response**:
  ```json
  {
    "message": "Menu retrieved",
    "menu": {
      "_id": "menu_id",
      "name": "Grilled Chicken",
      "image": "chicken_image_url",
      "price": 25.99,
      "discount": 5,
      "shortDescription": "Delicious grilled chicken",
      "description": "Fresh grilled chicken with herbs and spices",
      "ingredients": ["chicken", "herbs", "spices"],
      "category": {
        "_id": "category_id",
        "name": "Main Course"
      },
      "createdBy": {
        "_id": "user_id",
        "name": "Chef John"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Create Menu (Chef/Admin Only)
- **POST** `/api/v1/menus`
- **Description**: Create a new menu item
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "name": "Grilled Salmon",
    "image": "salmon_image_url",
    "price": 32.99,
    "discount": 0,
    "shortDescription": "Fresh grilled salmon",
    "description": "Fresh Atlantic salmon grilled to perfection",
    "ingredients": ["salmon", "lemon", "herbs", "olive oil"],
    "category": "category_id"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Menu created",
    "menu": {
      "_id": "menu_id",
      "name": "Grilled Salmon",
      "image": "salmon_image_url",
      "price": 32.99,
      "discount": 0,
      "shortDescription": "Fresh grilled salmon",
      "description": "Fresh Atlantic salmon grilled to perfection",
      "ingredients": ["salmon", "lemon", "herbs", "olive oil"],
      "category": {
        "_id": "category_id",
        "name": "Main Course"
      },
      "createdBy": {
        "_id": "user_id",
        "name": "Chef John"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Update Menu (Chef/Admin Only)
- **PATCH** `/api/v1/menus/:id`
- **Description**: Update menu item
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "price": 29.99,
    "discount": 10,
    "description": "Updated description for grilled salmon"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Menu updated",
    "menu": {
      "_id": "menu_id",
      "name": "Grilled Salmon",
      "image": "salmon_image_url",
      "price": 29.99,
      "discount": 10,
      "shortDescription": "Fresh grilled salmon",
      "description": "Updated description for grilled salmon",
      "ingredients": ["salmon", "lemon", "herbs", "olive oil"],
      "category": {
        "_id": "category_id",
        "name": "Main Course"
      },
      "createdBy": {
        "_id": "user_id",
        "name": "Chef John"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Delete Menu (Chef/Admin Only)
- **DELETE** `/api/v1/menus/:id`
- **Description**: Delete menu item
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Menu deleted"
  }
  ```

### Get Best-Selling Menu Items
- **GET** `/api/v1/menus/best-selling`
- **Description**: Get best-selling menu items based on ratings
- **Response**:
  ```json
  {
    "message": "Best-selling menus retrieved",
    "menus": [
      {
        "_id": "menu_id",
        "name": "Grilled Chicken",
        "image": "chicken_image_url",
        "price": 25.99,
        "discount": 5,
        "shortDescription": "Delicious grilled chicken",
        "description": "Fresh grilled chicken with herbs and spices",
        "ingredients": ["chicken", "herbs", "spices"],
        "category": {
          "_id": "category_id",
          "name": "Main Course"
        },
        "createdBy": {
          "_id": "user_id",
          "name": "Chef John"
        },
        "avgRating": 4.5,
        "reviewCount": 12,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### Get Menu Items by Category
- **GET** `/api/v1/menus/category/:categoryId`
- **Description**: Get menu items by category
- **Response**:
  ```json
  {
    "message": "Menus by category retrieved",
    "menus": [
      {
        "_id": "menu_id",
        "name": "Grilled Chicken",
        "image": "chicken_image_url",
        "price": 25.99,
        "discount": 5,
        "shortDescription": "Delicious grilled chicken",
        "description": "Fresh grilled chicken with herbs and spices",
        "ingredients": ["chicken", "herbs", "spices"],
        "category": {
          "_id": "category_id",
          "name": "Main Course"
        },
        "createdBy": {
          "_id": "user_id",
          "name": "Chef John"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

---

## ⭐ Menu Review APIs

### Get All Reviews for a Menu
- **GET** `/api/v1/reviews/menu/:menuId`
- **Description**: Get all reviews for a specific menu
- **Response**:
  ```json
  {
    "message": "Reviews retrieved",
    "reviews": [
      {
        "_id": "review_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "image": "user_image_url"
        },
        "menu": "menu_id",
        "rating": 5,
        "comment": "Excellent dish! Highly recommended.",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### Add Review for a Menu (Authenticated User)
- **POST** `/api/v1/reviews/menu/:menuId`
- **Description**: Add a review for a menu item
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "rating": 5,
    "comment": "Amazing taste and presentation!"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Review added",
    "review": {
      "_id": "review_id",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "image": "user_image_url"
      },
      "menu": "menu_id",
      "rating": 5,
      "comment": "Amazing taste and presentation!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Update Review (Review Owner Only)
- **PATCH** `/api/v1/reviews/:reviewId`
- **Description**: Update user's own review
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "rating": 4,
    "comment": "Updated comment - still very good!"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Review updated",
    "review": {
      "_id": "review_id",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "image": "user_image_url"
      },
      "menu": "menu_id",
      "rating": 4,
      "comment": "Updated comment - still very good!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Delete Review (Review Owner Only)
- **DELETE** `/api/v1/reviews/:reviewId`
- **Description**: Delete user's own review
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Review deleted"
  }
  ```