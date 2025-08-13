# Slack Workspace & Channel Management API

A backend API for managing workspaces and channels, inspired by Slack. Built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- **User Authentication:** Sign up, sign in, JWT-based authentication.
- **Workspace Management:** Create, update, delete workspaces. Role-based access control (RBAC) for workspace actions.
- **Channel Management:** Create, update, delete, and list channels within a workspace.
- **Multi-tenancy:** Ensures users can only access workspaces they are members of.
- **RBAC:** Roles (`admin`, `member`, `guest`) enforced for workspace and channel actions.

## Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- morgan

## Getting Started

### 1. Clone the repository

```sh
git clone <repo-url>
cd slack-backend-demo
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
```

### 4. Start the server

```sh
npm start
```

Server runs on [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

### Auth

- `POST /api/auth/sign-up`  
  Register a new user.  
  **Body:** `{ name, email, password }`

- `POST /api/auth/sign-in`  
  Login user.  
  **Body:** `{ email, password }`

- `GET /api/auth/profile`  
  Get current user profile (JWT required).

---

### Workspaces

- `POST /api/workspaces`  
  Create a workspace (JWT required).  
  **Body:** `{ name }`

- `PUT /api/workspaces/:workspace_id`  
  Update workspace details or add member (admin only).  
  **Body:** `{ name?, member? }`

- `DELETE /api/workspaces/:workspace_id`  
  Delete a workspace (admin & owner only).

---

### Channels

- `POST /api/workspaces/:workspace_id/channels`  
  Create a channel in a workspace (admin only).  
  **Body:** `{ name }`

- `PUT /api/workspaces/:workspace_id/channels/:channel_id`  
  Update channel details (admin only).  
  **Body:** `{ name }`

- `DELETE /api/workspaces/:workspace_id/channels/:channel_id`  
  Delete a channel (admin only).

- `GET /api/workspaces/:workspace_id/channels`  
  List all channels in a workspace (admin/member).

---

## Project Structure

```
.
├── config/
│   └── db.js
├── middleware/
│   ├── auth.middleware.js
│   ├── rbac.middleware.js
│   └── tenancy.middleware.js
├── models/
│   ├── Channel.js
│   ├── User.js
│   └── workspace.js
├── routes/
│   ├── auth.js
│   ├── channel.route.js
│   └── workspace.route.js
├── index.js
└── package.json
```

## Notes

- All protected routes require the `Authorization: Bearer <token>` header.
- Only workspace members can access workspace resources.
- Only admins can create/update/delete channels and update workspace details.

---