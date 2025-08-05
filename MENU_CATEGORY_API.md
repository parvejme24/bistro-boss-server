# Menu Category API Documentation

## Base URL
```
http://localhost:5000/api/v1/menu-categories
```
or
```
http://localhost:5000/api/v1/categories
```

## Authentication
Chef-only endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <chef_access_token>
```

## Endpoints

### 1. Get All Menu Categories (Public)
**GET** `/`

**Response:**
```json
{
  "message": "Menu categories retrieved successfully",
  "menuCategories": [
    {
      "_id": "category_id_1",
      "name": "Italian Cuisine",
      "image": "https://example.com/italian-cuisine.jpg",
      "description": "Authentic Italian dishes from pasta to pizza",
      "menuCount": 15,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "category_id_2",
      "name": "Mexican Food",
      "image": "https://example.com/mexican-food.jpg",
      "description": "Traditional Mexican recipes with fresh ingredients",
      "menuCount": 8,
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Menu Category by ID (Public)
**GET** `/:categoryId`

**Response:**
```json
{
  "message": "Menu category retrieved successfully",
  "menuCategory": {
    "_id": "category_id_1",
    "name": "Italian Cuisine",
    "image": "https://example.com/italian-cuisine.jpg",
    "description": "Authentic Italian dishes from pasta to pizza",
    "menuCount": 15,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Menu Category (Chef Only)
**POST** `/`

**Headers:**
```
Authorization: Bearer <chef_access_token>
```

**Body:**
```json
{
  "name": "Asian Fusion",
  "image": "https://example.com/asian-fusion.jpg",
  "description": "Modern fusion of traditional Asian flavors with contemporary techniques"
}
```

**Response:**
```json
{
  "message": "Menu category created successfully",
  "menuCategory": {
    "_id": "category_id_3",
    "name": "Asian Fusion",
    "image": "https://example.com/asian-fusion.jpg",
    "description": "Modern fusion of traditional Asian flavors with contemporary techniques",
    "menuCount": 0,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### 4. Update Menu Category (Chef Only)
**PUT** `/:categoryId`

**Headers:**
```
Authorization: Bearer <chef_access_token>
```

**Body:**
```json
{
  "name": "Modern Asian Fusion",
  "description": "Contemporary Asian cuisine with innovative cooking methods and presentation"
}
```

**Response:**
```json
{
  "message": "Menu category updated successfully",
  "menuCategory": {
    "_id": "category_id_3",
    "name": "Modern Asian Fusion",
    "image": "https://example.com/asian-fusion.jpg",
    "description": "Contemporary Asian cuisine with innovative cooking methods and presentation",
    "menuCount": 0,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T11:45:00.000Z"
  }
}
```

### 5. Delete Menu Category (Chef Only)
**DELETE** `/:categoryId`

**Headers:**
```
Authorization: Bearer <chef_access_token>
```

**Response:**
```json
{
  "message": "Menu category deleted successfully"
}
```

### 6. Get Menu Categories by Chef (Chef Only)
**GET** `/chef/categories`

**Headers:**
```
Authorization: Bearer <chef_access_token>
```

**Response:**
```json
{
  "message": "Menu categories retrieved successfully",
  "menuCategories": [
    {
      "_id": "category_id_1",
      "name": "Italian Cuisine",
      "image": "https://example.com/italian-cuisine.jpg",
      "description": "Authentic Italian dishes from pasta to pizza",
      "menuCount": 15,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Category with this name already exists"
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
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "message": "Menu category not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to create menu category",
  "error": "Error details"
}
```

## Menu Category Fields

### Required Fields:
- `name`: Category name (must be unique)

### Optional Fields:
- `image`: Category image URL
- `description`: Category description

### System Fields (Read-only):
- `menuCount`: Number of menus in this category (managed by system)
- `createdAt`: Category creation timestamp
- `updatedAt`: Last update timestamp

## Access Control

### Public Access (No Authentication Required):
- ✅ Get all menu categories
- ✅ Get menu category by ID

### Chef Access Only (Requires Chef Authentication):
- ✅ Create menu category
- ✅ Update menu category
- ✅ Delete menu category (only if menuCount = 0)
- ✅ Get menu categories by chef

## Business Rules

1. **Unique Names**: Category names must be unique across the system
2. **Deletion Protection**: Categories with menus (menuCount > 0) cannot be deleted
3. **Chef Only**: Only users with "chef" role can create, update, or delete categories
4. **Public Viewing**: Anyone can view categories without authentication

## Example Usage

### Create a New Category:
```bash
# Using /api/v1/menu-categories
curl -X POST http://localhost:5000/api/v1/menu-categories \
  -H "Authorization: Bearer CHEF_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mediterranean Cuisine",
    "image": "https://example.com/mediterranean.jpg",
    "description": "Fresh Mediterranean dishes with olive oil and herbs"
  }'

# Or using /api/v1/categories
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer CHEF_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mediterranean Cuisine",
    "image": "https://example.com/mediterranean.jpg",
    "description": "Fresh Mediterranean dishes with olive oil and herbs"
  }'
```

### Update a Category:
```bash
# Using /api/v1/menu-categories
curl -X PUT http://localhost:5000/api/v1/menu-categories/category_id \
  -H "Authorization: Bearer CHEF_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for Mediterranean cuisine"
  }'

# Or using /api/v1/categories
curl -X PUT http://localhost:5000/api/v1/categories/category_id \
  -H "Authorization: Bearer CHEF_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for Mediterranean cuisine"
  }'
```

### Delete a Category:
```bash
# Using /api/v1/menu-categories
curl -X DELETE http://localhost:5000/api/v1/menu-categories/category_id \
  -H "Authorization: Bearer CHEF_ACCESS_TOKEN"

# Or using /api/v1/categories
curl -X DELETE http://localhost:5000/api/v1/categories/category_id \
  -H "Authorization: Bearer CHEF_ACCESS_TOKEN"
``` 