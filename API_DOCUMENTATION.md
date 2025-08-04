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
  ```---

## 🛒 Cart Management APIs

### Get Current User's Cart
- **GET** `/api/v1/cart`
- **Description**: Get current user's cart with items and totals
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Cart retrieved",
    "cart": {
      "_id": "cart_id",
      "user": "user_id",
      "items": [
        {
          "_id": "cart_item_id",
          "menu": {
            "_id": "menu_id",
            "name": "Grilled Chicken",
            "image": "chicken_image_url",
            "price": 25.99,
            "discount": 5,
            "shortDescription": "Delicious grilled chicken",
            "category": {
              "_id": "category_id",
              "name": "Main Course"
            }
          },
          "quantity": 2
        }
      ],
      "totalItems": 2,
      "totalPrice": 49.38,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Add Item to Cart
- **POST** `/api/v1/cart`
- **Description**: Add item to cart (creates cart if doesn't exist)
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "menuId": "menu_id",
    "quantity": 2
  }
  ```
- **Response**:
  ```json
  {
    "message": "Item added to cart",
    "cart": {
      "_id": "cart_id",
      "user": "user_id",
      "items": [
        {
          "_id": "cart_item_id",
          "menu": {
            "_id": "menu_id",
            "name": "Grilled Chicken",
            "image": "chicken_image_url",
            "price": 25.99,
            "discount": 5,
            "shortDescription": "Delicious grilled chicken",
            "category": {
              "_id": "category_id",
              "name": "Main Course"
            }
          },
          "quantity": 2
        }
      ],
      "totalItems": 2,
      "totalPrice": 49.38,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Update Item Quantity in Cart
- **PATCH** `/api/v1/cart/:itemId`
- **Description**: Update quantity of specific item in cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "quantity": 3
  }
  ```
- **Response**:
  ```json
  {
    "message": "Cart item updated",
    "cart": {
      "_id": "cart_id",
      "user": "user_id",
      "items": [
        {
          "_id": "cart_item_id",
          "menu": {
            "_id": "menu_id",
            "name": "Grilled Chicken",
            "image": "chicken_image_url",
            "price": 25.99,
            "discount": 5,
            "shortDescription": "Delicious grilled chicken",
            "category": {
              "_id": "category_id",
              "name": "Main Course"
            }
          },
          "quantity": 3
        }
      ],
      "totalItems": 3,
      "totalPrice": 74.07,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Remove Item from Cart
- **DELETE** `/api/v1/cart/:itemId`
- **Description**: Remove specific item from cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Item removed from cart",
    "cart": {
      "_id": "cart_id",
      "user": "user_id",
      "items": [],
      "totalItems": 0,
      "totalPrice": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Clear Entire Cart
- **DELETE** `/api/v1/cart/clear`
- **Description**: Remove all items from cart
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Cart cleared",
    "cart": {
      "_id": "cart_id",
      "user": "user_id",
      "items": [],
      "totalItems": 0,
      "totalPrice": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ``` ---

## 📝 Blog Management APIs

### Get All Blogs
- **GET** `/api/v1/blogs`
- **Description**: Get all blogs with author information
- **Response**:
  ```json
  {
    "message": "Blogs retrieved",
    "blogs": [
      {
        "_id": "blog_id",
        "title": "The Art of Cooking",
        "category": "Cooking Tips",
        "description": "Learn the fundamentals of professional cooking",
        "image": "cooking_art_image_url",
        "quote": "Cooking is an art, but all art requires knowing something about the techniques and materials",
        "content": [
          {
            "heading": "Basic Techniques",
            "description": "Master the essential cooking techniques",
            "image": "techniques_image_url"
          }
        ],
        "author": {
          "_id": "user_id",
          "name": "Chef John",
          "image": "chef_john_image_url"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### Get Blog by ID
- **GET** `/api/v1/blogs/:id`
- **Description**: Get single blog by ID
- **Response**:
  ```json
  {
    "message": "Blog retrieved",
    "blog": {
      "_id": "blog_id",
      "title": "The Art of Cooking",
      "category": "Cooking Tips",
      "description": "Learn the fundamentals of professional cooking",
      "image": "cooking_art_image_url",
      "quote": "Cooking is an art, but all art requires knowing something about the techniques and materials",
      "content": [
        {
          "heading": "Basic Techniques",
          "description": "Master the essential cooking techniques",
          "image": "techniques_image_url"
        }
      ],
      "author": {
        "_id": "user_id",
        "name": "Chef John",
        "image": "chef_john_image_url"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Create Blog (Chef/Admin Only)
- **POST** `/api/v1/blogs`
- **Description**: Create a new blog post
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "title": "The Art of Cooking",
    "category": "Cooking Tips",
    "description": "Learn the fundamentals of professional cooking",
    "image": "cooking_art_image_url",
    "quote": "Cooking is an art, but all art requires knowing something about the techniques and materials",
    "content": [
      {
        "heading": "Basic Techniques",
        "description": "Master the essential cooking techniques",
        "image": "techniques_image_url"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "message": "Blog created",
    "blog": {
      "_id": "blog_id",
      "title": "The Art of Cooking",
      "category": "Cooking Tips",
      "description": "Learn the fundamentals of professional cooking",
      "image": "cooking_art_image_url",
      "quote": "Cooking is an art, but all art requires knowing something about the techniques and materials",
      "content": [
        {
          "heading": "Basic Techniques",
          "description": "Master the essential cooking techniques",
          "image": "techniques_image_url"
        }
      ],
      "author": {
        "_id": "user_id",
        "name": "Chef John",
        "image": "chef_john_image_url"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Update Blog (Blog Author/Admin Only)
- **PATCH** `/api/v1/blogs/:id`
- **Description**: Update blog post
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "title": "Updated Art of Cooking",
    "description": "Updated description for cooking fundamentals"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Blog updated",
    "blog": {
      "_id": "blog_id",
      "title": "Updated Art of Cooking",
      "category": "Cooking Tips",
      "description": "Updated description for cooking fundamentals",
      "image": "cooking_art_image_url",
      "quote": "Cooking is an art, but all art requires knowing something about the techniques and materials",
      "content": [
        {
          "heading": "Basic Techniques",
          "description": "Master the essential cooking techniques",
          "image": "techniques_image_url"
        }
      ],
      "author": {
        "_id": "user_id",
        "name": "Chef John",
        "image": "chef_john_image_url"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Delete Blog (Blog Author/Admin Only)
- **DELETE** `/api/v1/blogs/:id`
- **Description**: Delete blog post
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Blog deleted"
  }
  ```

### Get Blogs by Category
- **GET** `/api/v1/blogs/category/:category`
- **Description**: Get blogs by category
- **Response**:
  ```json
  {
    "message": "Blogs by category retrieved",
    "blogs": [
      {
        "_id": "blog_id",
        "title": "The Art of Cooking",
        "category": "Cooking Tips",
        "description": "Learn the fundamentals of professional cooking",
        "image": "cooking_art_image_url",
        "quote": "Cooking is an art, but all art requires knowing something about the techniques and materials",
        "content": [
          {
            "heading": "Basic Techniques",
            "description": "Master the essential cooking techniques",
            "image": "techniques_image_url"
          }
        ],
        "author": {
          "_id": "user_id",
          "name": "Chef John",
          "image": "chef_john_image_url"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### Get Blogs by Author
- **GET** `/api/v1/blogs/author/:authorId`
- **Description**: Get blogs by specific author
- **Response**:
  ```json
  {
    "message": "Blogs by author retrieved",
    "blogs": [
      {
        "_id": "blog_id",
        "title": "The Art of Cooking",
        "category": "Cooking Tips",
        "description": "Learn the fundamentals of professional cooking",
        "image": "cooking_art_image_url",
        "quote": "Cooking is an art, but all art requires knowing something about the techniques and materials",
        "content": [
          {
            "heading": "Basic Techniques",
            "description": "Master the essential cooking techniques",
            "image": "techniques_image_url"
          }
        ],
        "author": {
          "_id": "user_id",
          "name": "Chef John",
          "image": "chef_john_image_url"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

---

## 📝 Blog Review APIs

### Get All Reviews for a Blog
- **GET** `/api/v1/blog-reviews/blog/:blogId`
- **Description**: Get all reviews for a specific blog
- **Response**:
  ```json
  {
    "message": "Blog reviews retrieved",
    "reviews": [
      {
        "_id": "review_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "image": "user_image_url"
        },
        "blog": "blog_id",
        "rating": 5,
        "comment": "Excellent blog post! Very informative.",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### Add Review for a Blog (Authenticated User)
- **POST** `/api/v1/blog-reviews/blog/:blogId`
- **Description**: Add a review for a blog post
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "rating": 5,
    "comment": "Amazing blog post! Learned a lot."
  }
  ```
- **Response**:
  ```json
  {
    "message": "Blog review added",
    "review": {
      "_id": "review_id",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "image": "user_image_url"
      },
      "blog": "blog_id",
      "rating": 5,
      "comment": "Amazing blog post! Learned a lot.",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Update Blog Review (Review Owner Only)
- **PATCH** `/api/v1/blog-reviews/:reviewId`
- **Description**: Update user's own blog review
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
    "message": "Blog review updated",
    "review": {
      "_id": "review_id",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "image": "user_image_url"
      },
      "blog": "blog_id",
      "rating": 4,
      "comment": "Updated comment - still very good!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Delete Blog Review (Review Owner Only)
- **DELETE** `/api/v1/blog-reviews/:reviewId`
- **Description**: Delete user's own blog review
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Blog review deleted"
  }
  ``` ---

## 🧑‍🍳 Chef Management APIs

### Get All Chefs (Public)
- **GET** `/api/v1/chefs`
- **Description**: Get all users with role: 'chef' (public)
- **Use case**: Show chefs on frontend (e.g., Meet Our Chefs)
- **Response**:
  ```json
  {
    "message": "Chefs retrieved",
    "chefs": [
      {
        "_id": "chef_id",
        "name": "Chef John Doe",
        "email": "chef.john@example.com",
        "image": "chef_john_image_url",
        "phone": "+1234567890",
        "role": "chef",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### Get Single Chef with Details and Menus (Public)
- **GET** `/api/v1/chefs/:id`
- **Description**: Get single chef with his details and all menu items created by him
- **Use case**: When a user clicks a chef profile
- **Response**:
  ```json
  {
    "message": "Chef details retrieved",
    "chef": {
      "_id": "chef_id",
      "name": "Chef John Doe",
      "email": "chef.john@example.com",
      "image": "chef_john_image_url",
      "phone": "+1234567890",
      "role": "chef",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "menus": [
        {
          "_id": "menu_id",
          "name": "Grilled Salmon",
          "image": "salmon_image_url",
          "price": 25.99,
          "discount": 10,
          "shortDescription": "Fresh grilled salmon with herbs",
          "category": {
            "_id": "category_id",
            "name": "Seafood"
          },
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "menuCount": 1
    }
  }
  ```

### Update Chef Details (Admin Only)
- **PATCH** `/api/v1/chefs/:id`
- **Description**: Update chef details (admin only)
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "name": "Updated Chef Name",
    "email": "updated.chef@example.com",
    "phone": "+1234567890",
    "image": "updated_chef_image_url"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Chef updated",
    "chef": {
      "_id": "chef_id",
      "name": "Updated Chef Name",
      "email": "updated.chef@example.com",
      "image": "updated_chef_image_url",
      "phone": "+1234567890",
      "role": "chef",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Get Chefs with Filtering (Admin Only)
- **GET** `/api/v1/chefs/admin/filter?role=chef&search=john`
- **Description**: Get chefs with optional filtering and search
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `role` (optional): Filter by role (e.g., "chef", "admin", "customer")
  - `search` (optional): Search by name or email
- **Response**:
  ```json
  {
    "message": "Chefs retrieved",
    "chefs": [
      {
        "_id": "chef_id",
        "name": "Chef John Doe",
        "email": "chef.john@example.com",
        "image": "chef_john_image_url",
        "phone": "+1234567890",
        "role": "chef",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### Delete User (Admin Only)
- **DELETE** `/api/v1/users/:id`
- **Description**: Remove a user (chef/admin/customer) (admin only)
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

### Get Chef Statistics (Admin Only)
- **GET** `/api/v1/chefs/:id/stats`
- **Description**: Get chef statistics and performance metrics
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Chef statistics retrieved",
    "stats": {
      "chefId": "chef_id",
      "chefName": "Chef John Doe",
      "menuCount": 15,
      "totalMenus": 15
    }
  }
  ```

---

## 🔒 Admin-Only APIs (Already Available)

### Update User Role (Admin Only)
- **PATCH** `/api/v1/users/:id/role`
- **Description**: Update any user's role (e.g., promote to chef, admin, etc.)
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
      "role": "chef",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Get All Users (Admin Only)
- **GET** `/api/v1/users`
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
        "role": "chef",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```

---

## 🧑‍🍳 Chef's Own Menu Management

### Create Menu Item (Chef/Admin Only)
- **POST** `/api/v1/menus`
- **Description**: Create new menu item (only allowed for chef/admin)
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "name": "Grilled Salmon",
    "image": "salmon_image_url",
    "price": 25.99,
    "discount": 10,
    "shortDescription": "Fresh grilled salmon with herbs",
    "description": "Delicious grilled salmon with fresh herbs and lemon",
    "ingredients": ["Salmon", "Herbs", "Lemon", "Olive Oil"],
    "category": "category_id"
  }
  ```

### Update Menu Item (Owner Chef or Admin Only)
- **PATCH** `/api/v1/menus/:id`
- **Description**: Update menu item (only owner chef or admin)
- **Headers**: `Authorization: Bearer <access_token>`

### Delete Menu Item (Owner Chef or Admin Only)
- **DELETE** `/api/v1/menus/:id`
- **Description**: Delete menu item (only owner chef or admin)
- **Headers**: `Authorization: Bearer <access_token>`

---

## 🔑 API Endpoints Summary

```javascript
// Public endpoints (no auth required)
GET    /api/v1/chefs                    // Get all chefs
GET    /api/v1/chefs/:id                // Get single chef with menus

// Admin-only endpoints
PATCH  /api/v1/chefs/:id                // Update chef details
GET    /api/v1/chefs/admin/filter       // Get chefs with filtering
DELETE /api/v1/users/:id                // Delete user
GET    /api/v1/chefs/:id/stats          // Get chef statistics
PATCH  /api/v1/users/:id/role           // Update user role
GET    /api/v1/users                    // Get all users

// Chef/Admin menu management (already available)
POST   /api/v1/menus                    // Create menu item
PATCH  /api/v1/menus/:id                // Update menu item
DELETE /api/v1/menus/:id                // Delete menu item
``` ---

## 👨‍💼 Admin Dashboard & Analytics APIs

### Get Dashboard Overview Statistics (Admin Only)
- **GET** `/api/v1/admin/dashboard`
- **Description**: Get comprehensive dashboard overview with all key metrics
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Dashboard statistics retrieved",
    "stats": {
      "users": {
        "total": 150,
        "customers": 120,
        "chefs": 25,
        "admins": 5
      },
      "content": {
        "menus": 85,
        "categories": 12,
        "blogs": 23,
        "reviews": 156
      },
      "orders": {
        "total": 450,
        "totalSales": 12500.50,
        "todaysOrders": 12,
        "todaysSales": 350.75,
        "monthlyOrders": 89,
        "monthlySales": 2450.25
      },
      "activity": {
        "activeCarts": 18,
        "recentUsers": 8,
        "recentMenus": 3,
        "recentReviews": 15,
        "recentBlogs": 2
      }
    }
  }
  ```

### Get User Statistics (Admin Only)
- **GET** `/api/v1/admin/users/stats?period=month`
- **Description**: Get detailed user statistics with filtering by time period
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `period` (optional): "today", "week", "month", "all" (default: "all")
- **Response**:
  ```json
  {
    "message": "User statistics retrieved",
    "stats": {
      "period": "month",
      "counts": {
        "customers": 15,
        "chefs": 3,
        "admins": 1,
        "total": 19
      },
      "recentUsers": [
        {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "customer",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  }
  ```

### Get Sales Statistics (Admin Only)
- **GET** `/api/v1/admin/sales/stats?period=week`
- **Description**: Get sales and order statistics with top-performing menus
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `period` (optional): "today", "week", "month", "all" (default: "all")
- **Response**:
  ```json
  {
    "message": "Sales statistics retrieved",
    "stats": {
      "period": "week",
      "orders": {
        "count": 45,
        "totalSales": 1250.75,
        "averageOrderValue": 27.79
      },
      "topMenus": [
        {
          "_id": "menu_id",
          "name": "Grilled Salmon",
          "price": 25.99,
          "averageRating": 4.8,
          "reviewCount": 23,
          "image": "salmon_image_url"
        }
      ],
      "recentOrders": [
        {
          "_id": "order_id",
          "user": "user_id",
          "totalAmount": 45.99,
          "status": "delivered",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  }
  ```

### Get Content Statistics (Admin Only)
- **GET** `/api/v1/admin/content/stats?period=month`
- **Description**: Get content statistics including menus, blogs, and reviews
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `period` (optional): "today", "week", "month", "all" (default: "all")
- **Response**:
  ```json
  {
    "message": "Content statistics retrieved",
    "stats": {
      "period": "month",
      "menus": {
        "total": 85,
        "period": 12,
        "byCategory": [
          {
            "categoryName": "Seafood",
            "count": 15
          },
          {
            "categoryName": "Italian",
            "count": 12
          }
        ]
      },
      "blogs": {
        "total": 23,
        "period": 5,
        "byAuthor": [
          {
            "authorName": "Chef John",
            "count": 8
          },
          {
            "authorName": "Chef Sarah",
            "count": 5
          }
        ]
      },
      "reviews": {
        "total": 156,
        "period": 25
      },
      "recent": {
        "menus": [
          {
            "_id": "menu_id",
            "name": "New Pasta Dish",
            "category": {
              "_id": "category_id",
              "name": "Italian"
            },
            "createdBy": {
              "_id": "chef_id",
              "name": "Chef John"
            },
            "createdAt": "2024-01-01T00:00:00.000Z"
          }
        ],
        "blogs": [
          {
            "_id": "blog_id",
            "title": "Cooking Tips",
            "author": {
              "_id": "chef_id",
              "name": "Chef Sarah"
            },
            "createdAt": "2024-01-01T00:00:00.000Z"
          }
        ]
      }
    }
  }
  ```

### Get System Health (Admin Only)
- **GET** `/api/v1/admin/system/health`
- **Description**: Get system health status and recent activity metrics
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "System health retrieved",
    "health": {
      "database": "connected",
      "metrics": {
        "totalUsers": 150,
        "totalMenus": 85,
        "totalOrders": 450,
        "totalReviews": 156,
        "totalBlogs": 23
      },
      "recentActivity": {
        "newUsers": 3,
        "newMenus": 2,
        "newReviews": 8,
        "newBlogs": 1
      },
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  }
  ```

---

## 📊 Key Metrics Available

### User Metrics
- **Total Users**: Complete user count across all roles
- **Customer Count**: Number of customers
- **Chef Count**: Number of chefs
- **Admin Count**: Number of administrators
- **Recent Users**: New user registrations by time period

### Sales Metrics
- **Total Orders**: Complete order count
- **Total Sales**: Total revenue generated
- **Today's Orders**: Orders placed today
- **Today's Sales**: Revenue generated today
- **Monthly Orders**: Orders in last 30 days
- **Monthly Sales**: Revenue in last 30 days
- **Average Order Value**: Average amount per order
- **Top Selling Menus**: Best-performing menu items

### Content Metrics
- **Menu Count**: Total menu items
- **Category Distribution**: Menus by category
- **Blog Count**: Total blog posts
- **Author Distribution**: Blogs by author
- **Review Count**: Total reviews (menu + blog)
- **Recent Content**: Latest additions

### Activity Metrics
- **Active Carts**: Current active shopping carts
- **Recent Activity**: New additions in last 7 days
- **System Health**: Database status and performance

---

## 🔑 API Endpoints Summary

```javascript
// Admin dashboard endpoints (all require admin authentication)
GET    /api/v1/admin/dashboard              // Get comprehensive dashboard overview
GET    /api/v1/admin/users/stats            // Get user statistics with filtering
GET    /api/v1/admin/sales/stats            // Get sales statistics with filtering
GET    /api/v1/admin/content/stats          // Get content statistics with filtering
GET    /api/v1/admin/system/health          // Get system health status

// Query Parameters for filtering:
// ?period=today    - Today's data only
// ?period=week     - Last 7 days
// ?period=month    - Last 30 days
// ?period=all      - All time (default)
```

---

## 📈 Dashboard Features

### Real-time Analytics
- Live user counts and activity
- Current sales and order metrics
- Recent content additions
- System performance monitoring

### Time-based Filtering
- Today's metrics for daily monitoring
- Weekly trends for short-term analysis
- Monthly data for long-term planning
- All-time statistics for overall performance

### Performance Insights
- Top-performing menu items
- Most active content creators
- User engagement metrics
- Sales performance trends

### System Monitoring
- Database connection status
- Recent system activity
- Performance metrics
- Health indicators 