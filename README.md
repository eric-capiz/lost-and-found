# Lost & Found App

## Overview

A full-stack application for managing lost and found items. Users can post items they've lost or found, interact through comments, and help reunite items with their owners.

## Backend Implementation

### Technology Stack

- Node.js
- Express
- MongoDB
- JWT Authentication

### Authentication & Authorization

- JWT-based authentication
- Protected routes
- Role-based access (Admin/User)
- Token verification middleware

### API Routes

#### Auth Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### User Routes

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

#### Post Routes

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

#### Comment Routes

- `POST /api/posts/:id/comments` - Add comment
- `DELETE /api/posts/:id/comments/:commentId` - Delete comment

#### Admin Routes

- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get statistics
- `POST /api/admin/create` - Create new admin
- `DELETE /api/admin/users/:id` - Delete user

### Database Models

- User
- Post
- Comment

[Frontend documentation to be added after completion]
