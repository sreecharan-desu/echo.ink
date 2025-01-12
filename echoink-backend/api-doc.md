# API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Home](#home)
  - [User Management](#user-management)
  - [Posts](#posts)
  - [Profile Management](#profile-management)
- [Error Handling](#error-handling)
- [Notes](#notes)

## Authentication

The API uses JWT (JSON Web Token) for authentication. Protected endpoints require a valid JWT token to be included in the request header.

## Endpoints

### Home

#### Get Homepage
```http
GET /
```

**Description:** Returns the homepage content

**Authentication Required:** No

**Response:** Homepage HTML content

### User Management

#### Sign Up
```http
POST /signup
```

**Description:** Create a new user account

**Authentication Required:** No

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Success Response:**
```json
{
    "token": "jwt_token",
    "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "created_at": "datetime",
        "image_link": "string",
        "posts": [],
        "_count": {}
    },
    "success": true
}
```

**Error Response:**
```json
{
    "msg": "ERROR : can't create user",
    "success": false
}
```

#### Sign In
```http
POST /signin
```

**Description:** Authenticate existing user

**Authentication Required:** No

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Success Response:**
```json
{
    "token": "jwt_token",
    "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "created_at": "datetime",
        "image_link": "string",
        "posts": [],
        "_count": {}
    },
    "success": true
}
```

**Error Response:**
```json
{
    "msg": "ERROR : can't able to signin",
    "success": false
}
```

### Posts

#### Get All Posts
```http
GET /getbulk
```

**Description:** Retrieve all posts

**Authentication Required:** No

**Success Response:**
```json
{
    "posts": [],
    "success": true
}
```

**Error Response:**
```json
{
    "msg": "ERROR : can't get posts",
    "success": false
}
```

#### Create Post
```http
POST /createpost
```

**Description:** Create a new post

**Authentication Required:** Yes

**Request Body:**
```json
{
    "title": "string",
    "description": "string",
    "image_link": "string"  // optional
}
```

**Success Response:**
```json
{
    "msg": "post_{id} created successfully...",
    "success": true
}
```

**Error Response:**
```json
{
    "msg": "title & description required",
    "success": false
}
```

#### Delete Post
```http
DELETE /deletepost/:postId
```

**Description:** Delete a specific post

**Authentication Required:** Yes

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| postId | string | ID of the post to delete |

**Success Response:**
```json
{
    "msg": "post_{id} deleted successfully...",
    "success": true
}
```

**Error Response:**
```json
{
    "msg": "Error : error deleting post",
    "success": false
}
```

#### Update Post
```http
PUT /updatepost/:postId
```

**Description:** Update an existing post

**Authentication Required:** Yes

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| postId | string | ID of the post to update |

**Request Body:**
```json
{
    "title": "string",
    "description": "string",
    "image_link": "string"  // optional
}
```

**Success Response:**
```json
{
    "msg": "post_{id} created successfully...",
    "success": true
}
```

**Error Response:**
```json
{
    "msg": "FATAL : title and description not found",
    "success": false
}
```

### Profile Management

#### Update Profile
```http
PUT /updateprofile
```

**Description:** Update user profile information

**Authentication Required:** Yes

**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "image_link": "string"  // optional
}
```

**Success Response:**
```json
{
    "msg": "post_{userId} updated successfully...",
    "success": true
}
```

**Error Response:**
```json
{
    "msg": "Error : updating user profile",
    "success": false
}
```

## Error Handling

* All endpoints return a `success` boolean indicating the status of the request
* Error messages are returned in the `msg` field
* For non-existent routes, a 404 status page is returned

## Notes

* The API is built using the Hono framework and Prisma ORM
* JWT is used for authentication
* All protected routes require a valid JWT token
* The database URL and JWT secret are provided through environment variables
* Passwords are hashed before storage