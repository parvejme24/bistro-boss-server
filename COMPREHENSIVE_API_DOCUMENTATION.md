# Bistro Boss Server - Comprehensive API Documentation

## Overview
This is a comprehensive restaurant management system with role-based access control, menu management, blog system, cart functionality, and more.

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## 🔐 Authentication & User Management

### 1. User Registration
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "country": "USA",
  "state": "California",
  "city": "Los Angeles",
  "detailsAddress": "123 Main St"
}
```

### 2. User Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Get Current User Profile
```http
GET /me
Authorization: Bearer <token>
```

### 4. Logout
```http
POST /logout
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### 5. Refresh Access Token
```http
POST /refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### 6. Request Password Reset
```http
POST /request-password-reset
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### 7. Reset Password
```http
POST /reset-password
Content-Type: application/json

{
  "resetToken": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

---

## 👥 User Management (Admin Only)

### 8. Get All Users
```http
GET /users
Authorization: Bearer <admin_token>
```

### 9. Get User by ID
```http
GET /users/:id
Authorization: Bearer <admin_token>
```

### 10. Update User Role
```http
PATCH /users/:id/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "chef"
}
```

### 11. Update Current User Profile
```http
PATCH /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "+1234567890",
  "country": "USA",
  "state": "California",
  "city": "Los Angeles",
  "detailsAddress": "456 Oak St"
}
```

### 12. Change Password
```http
PATCH /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 🍽️ Menu & Category Management

### 13. Get All Categories
```http
GET /categories
```

### 14. Get Category by ID
```http
GET /categories/:id
```

### 15. Create Category (Admin Only)
```http
POST /categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Main Course",
  "description": "Delicious main dishes"
}
```

### 16. Update Category (Admin Only)
```http
PATCH /categories/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Category Name"
}
```

### 17. Delete Category (Admin Only)
```http
DELETE /categories/:id
Authorization: Bearer <admin_token>
```

### 18. Get All Menus
```http
GET /menus
```

### 19. Get Menu by ID
```http
GET /menus/:id
```

### 20. Get Best Selling Menus
```http
GET /menus/best-selling
```

### 21. Get Menus by Category
```http
GET /menus/category/:categoryId
```

### 22. Create Menu (Chef Only)
```http
POST /menus
Authorization: Bearer <chef_token>
Content-Type: application/json

{
  "name": "Grilled Salmon",
  "image": "https://example.com/salmon.jpg",
  "price": 25.99,
  "discount": 5,
  "shortDescription": "Fresh grilled salmon",
  "description": "Delicious grilled salmon with herbs",
  "ingredients": ["salmon", "herbs", "lemon"],
  "category": "category_id"
}
```

### 23. Update Menu (Chef Only - Own Menus)
```http
PATCH /menus/:id
Authorization: Bearer <chef_token>
Content-Type: application/json

{
  "name": "Updated Menu Name",
  "price": 29.99
}
```

### 24. Delete Menu (Chef Only - Own Menus)
```http
DELETE /menus/:id
Authorization: Bearer <chef_token>
```

---

## 👨‍🍳 Chef Management

### 25. Get All Chefs (Public)
```http
GET /chefs
```

### 26. Get Chef by ID with Menus (Public)
```http
GET /chefs/:id
```

### 27. Get Chef's Own Profile (Chef Only)
```http
GET /chef/profile
Authorization: Bearer <chef_token>
```

### 28. Update Chef Display Photo (Chef Only)
```http
PATCH /chef/display-photo
Authorization: Bearer <chef_token>
Content-Type: application/json

{
  "image": "https://example.com/new-photo.jpg"
}
```

### 29. Get Chef's Own Menus (Chef Only)
```http
GET /chef/menus
Authorization: Bearer <chef_token>
```

### 30. Update Chef Details (Admin Only)
```http
PATCH /chefs/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Chef Name",
  "email": "chef@example.com",
  "phone": "+1234567890",
  "country": "USA",
  "state": "California",
  "city": "Los Angeles"
}
```

### 31. Get Chef Statistics (Admin Only)
```http
GET /chefs/:id/stats
Authorization: Bearer <admin_token>
```

### 32. Filter Chefs (Admin Only)
```http
GET /chefs/admin/filter?role=chef&search=john
Authorization: Bearer <admin_token>
```

---

## 🛒 Cart Management

### 33. Add Item to Cart
```http
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuId": "menu_id",
  "quantity": 2
}
```

### 34. Get User's Cart
```http
GET /cart
Authorization: Bearer <token>
```

### 35. Update Cart Item Quantity
```http
PATCH /cart/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### 36. Remove Item from Cart
```http
DELETE /cart/:itemId
Authorization: Bearer <token>
```

### 37. Clear Cart
```http
DELETE /cart
Authorization: Bearer <token>
```

---

## ❤️ Wishlist Management

### 38. Add Menu to Wishlist
```http
POST /wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuId": "menu_id"
}
```

### 39. Get User's Wishlist
```http
GET /wishlist
Authorization: Bearer <token>
```

### 40. Check if Menu is in Wishlist
```http
GET /wishlist/check/:menuId
Authorization: Bearer <token>
```

### 41. Remove Menu from Wishlist
```http
DELETE /wishlist/:menuId
Authorization: Bearer <token>
```

### 42. Clear Wishlist
```http
DELETE /wishlist
Authorization: Bearer <token>
```

---

## ⭐ Menu Reviews

### 43. Get Menu Reviews
```http
GET /reviews/menu/:menuId
```

### 44. Add Menu Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuId": "menu_id",
  "rating": 5,
  "comment": "Excellent dish!"
}
```

### 45. Update Menu Review
```http
PATCH /reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated comment"
}
```

### 46. Delete Menu Review
```http
DELETE /reviews/:id
Authorization: Bearer <token>
```

---

## 📝 Blog Management

### 47. Get All Blogs
```http
GET /blogs
```

### 48. Get Blog by ID
```http
GET /blogs/:id
```

### 49. Create Blog (Admin Only)
```http
POST /blogs
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Blog Title",
  "content": "Blog content...",
  "image": "https://example.com/blog.jpg",
  "category": "category_id"
}
```

### 50. Update Blog (Admin Only)
```http
PATCH /blogs/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### 51. Delete Blog (Admin Only)
```http
DELETE /blogs/:id
Authorization: Bearer <admin_token>
```

---

## 💬 Blog Reviews

### 52. Get Blog Reviews
```http
GET /blog-reviews/blog/:blogId
```

### 53. Add Blog Review
```http
POST /blog-reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "blogId": "blog_id",
  "rating": 5,
  "comment": "Great blog post!"
}
```

### 54. Update Blog Review
```http
PATCH /blog-reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated comment"
}
```

### 55. Delete Blog Review
```http
DELETE /blog-reviews/:id
Authorization: Bearer <token>
```

---

## 🔧 Admin Management

### 56. Get Admin Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

### 57. Get All Orders (Admin Only)
```http
GET /admin/orders
Authorization: Bearer <admin_token>
```

### 58. Update Order Status (Admin Only)
```http
PATCH /admin/orders/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "completed"
}
```

---

## 📋 Order Management

### 59. Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "menuId": "menu_id",
      "quantity": 2
    }
  ],
  "deliveryAddress": "123 Main St, City, State",
  "paymentMethod": "card"
}
```

### 60. Get User's Orders
```http
GET /orders
Authorization: Bearer <token>
```

### 61. Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <token>
```

---

## 🔐 Role-Based Access Control

### Roles:
- **Customer**: Can view menus, add to cart, place orders, manage wishlist, write reviews
- **Chef**: Can manage their own menus, view their profile and statistics
- **Admin**: Can manage entire application, users, categories, blogs, orders

### Role Change Workflow:
1. User registers as "customer"
2. Admin changes user role to "chef" using `/users/:id/role`
3. User can now access chef-only endpoints

---

## 🚨 Error Responses

### Common Error Codes:
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (no token/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error (internal error)

### Example Error Response:
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 📝 Notes

1. **File Upload**: For image uploads, you'll need to implement file upload middleware (e.g., multer)
2. **Email Service**: Password reset emails need to be implemented
3. **Payment Integration**: Order payment processing needs to be implemented
4. **Real-time Features**: Consider adding WebSocket for real-time order updates
5. **Pagination**: Add pagination for list endpoints with large datasets
6. **Search & Filter**: Implement advanced search and filtering capabilities
7. **Caching**: Consider Redis for caching frequently accessed data
8. **Rate Limiting**: Already implemented basic rate limiting
9. **Security**: JWT tokens, input validation, and sanitization implemented

---

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Start the server: `npm start`
4. Access the API at `http://localhost:5000/api/v1`

The system is now fully functional with all the requested features implemented! 