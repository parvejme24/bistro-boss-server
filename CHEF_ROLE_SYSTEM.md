# Chef Role-Based Menu Management System

## Overview
This system implements a role-based access control where only chefs can manage their own menus. Admins can change user roles but cannot directly manage chef menus.

## Role Hierarchy
- **Admin**: Can manage users, change roles, view all data
- **Chef**: Can only manage their own menus
- **Customer**: Can view menus and place orders

## Key Features

### 1. Role Change Functionality
Admins can change any user's role to "chef" using the existing endpoint:
```
PATCH /api/users/:id/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "chef"
}
```

### 2. Chef-Only Menu Management
Chefs can only manage their own menus through these endpoints:

#### Get Chef's Own Menus
```
GET /api/chef/menus
Authorization: Bearer <chef_token>
```

#### Create Menu (Chef Only)
```
POST /api/menus
Authorization: Bearer <chef_token>
Content-Type: application/json

{
  "name": "Menu Item Name",
  "image": "image_url",
  "price": 25.99,
  "discount": 5,
  "shortDescription": "Brief description",
  "description": "Detailed description",
  "ingredients": ["ingredient1", "ingredient2"],
  "category": "category_id"
}
```

#### Update Menu (Chef Only - Own Menus)
```
PATCH /api/menus/:id
Authorization: Bearer <chef_token>
Content-Type: application/json

{
  "name": "Updated Menu Name",
  "price": 29.99
}
```

#### Delete Menu (Chef Only - Own Menus)
```
DELETE /api/menus/:id
Authorization: Bearer <chef_token>
```

### 3. Chef Profile Management
Chefs can access their own profile and statistics:

#### Get Chef Profile
```
GET /api/chef/profile
Authorization: Bearer <chef_token>
```

Response includes:
- Chef details
- Menu count statistics
- Recent menus (latest 5)

### 4. Public Menu Access
All users can view menus through public endpoints:
```
GET /api/menus                    # All menus
GET /api/menus/:id               # Specific menu
GET /api/menus/best-selling      # Best selling menus
GET /api/menus/category/:id      # Menus by category
```

## Security Features

### 1. Role Validation
- All chef-only endpoints validate that the user has "chef" role
- Admins cannot access chef-only endpoints
- Only the chef who created a menu can modify/delete it

### 2. Ownership Validation
- Menu update/delete operations check if the logged-in chef owns the menu
- Returns 403 Forbidden if chef tries to modify another chef's menu

### 3. Middleware Protection
- `requireChefOnly`: Ensures only chefs can access (not admins)
- `authenticateToken`: Validates JWT tokens
- Role checks in controller functions for additional security

## Workflow Example

1. **User Registration**: User registers as "customer"
2. **Admin Role Change**: Admin changes user role to "chef"
3. **Chef Login**: User logs in with chef credentials
4. **Menu Management**: Chef can now create, update, delete their own menus
5. **Profile Access**: Chef can view their profile and menu statistics

## Error Responses

### 403 Forbidden
- When non-chef tries to access chef-only endpoints
- When chef tries to modify another chef's menu

### 404 Not Found
- When menu doesn't exist
- When chef profile not found

### 401 Unauthorized
- When no valid token provided
- When token is invalid/expired

## API Endpoints Summary

### Chef-Only Endpoints
- `GET /api/chef/menus` - Get chef's own menus
- `GET /api/chef/profile` - Get chef's profile and stats
- `POST /api/menus` - Create new menu (chef only)
- `PATCH /api/menus/:id` - Update menu (own menus only)
- `DELETE /api/menus/:id` - Delete menu (own menus only)

### Admin-Only Endpoints
- `PATCH /api/users/:id/role` - Change user role
- `GET /api/chefs/admin/filter` - Filter chefs (admin only)
- `PATCH /api/chefs/:id` - Update chef details (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/chefs/:id/stats` - Get chef statistics (admin only)

### Public Endpoints
- `GET /api/menus` - All menus
- `GET /api/menus/:id` - Specific menu
- `GET /api/menus/best-selling` - Best selling menus
- `GET /api/menus/category/:id` - Menus by category
- `GET /api/chefs` - All chefs
- `GET /api/chefs/:id` - Specific chef details 