# Emporio

Emporio is a full-stack digital marketplace for discovering and managing digital products such as e-books, cheatsheets, icons, photos, templates, and code snippets. It combines a customer-facing storefront with community features and an admin dashboard for product, user, announcement, wishlist, and analytics management.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_Emporio-6C63FF?style=for-the-badge)](https://emporio-topaz.vercel.app/)
[![Demo Video](https://img.shields.io/badge/YouTube-Watch_Demo-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=CcrrEl5yr_4)

![Emporio homepage](https://github.com/user-attachments/assets/09434cc5-3b9f-468e-8eac-fb955ef49178)

## Features

- Browse digital products by category
- Search by product name, description, or category
- View product details, ratings, and customer reviews
- Add products to a persistent shopping cart
- Create and manage a user profile
- Publish community posts with images, comments, and upvotes
- Vote for requested products through the community wishlist
- Authenticate securely with JWT-based HTTP-only cookies
- Manage products, featured items, users, roles, and announcements as an admin
- Review product, user, post, announcement, and category analytics

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, Zustand, React Router, Axios |
| Backend | Node.js 20+, Express 5, JWT, bcrypt, cookie-parser |
| Database | MongoDB, Mongoose |
| Media | Cloudinary |
| UI | Framer Motion, Lucide React, React Hot Toast |
| Deployment | Vercel and Render configuration included |

## Project Structure

```text
Emporio/
|-- backend/
|   |-- controllers/       # API business logic
|   |-- lib/               # MongoDB and Cloudinary configuration
|   |-- middleware/        # Authentication and authorization
|   |-- models/            # Mongoose schemas
|   |-- routes/            # Express API routes
|   `-- server.js          # Express application entry point
|-- frontend/
|   |-- public/            # Images, icons, and animation frames
|   `-- src/
|       |-- components/    # Reusable UI and admin components
|       |-- lib/           # Axios configuration
|       |-- pages/         # Application pages
|       `-- stores/        # Zustand state stores
|-- Emporio Class Diagram.png
|-- SRS document.pdf
|-- package.json
`-- render.yaml
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database
- A Cloudinary account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/MIhirDas10/Emporio.git
cd Emporio
```

### 2. Install dependencies

```bash
npm install
npm install --prefix frontend
```

### 3. Configure the backend

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### 4. Configure the frontend

The Vite development server proxies `/api` requests to `http://localhost:5000`. No frontend environment file is required for local development.

For a separately deployed API, create `frontend/.env`:

```env
VITE_API_URL=https://your-api-domain.example/api
```

### 5. Run the application

Start the backend from the project root:

```bash
npm run dev
```

In a second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Available Scripts

From the project root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Express API with Nodemon |
| `npm start` | Start the Express API with Node.js |
| `npm run build` | Install frontend dependencies and create a production build |

From `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## API Overview

The backend exposes REST endpoints under `/api`:

| Route | Purpose |
| --- | --- |
| `/api/auth` | Sign up, log in, log out, and session profile |
| `/api/products` | Products, categories, recommendations, and reviews |
| `/api/cart` | Authenticated cart operations |
| `/api/search` | Product search |
| `/api/posts` | Community feed and posts |
| `/api/user` | Profiles and admin user management |
| `/api/announcements` | Public announcements and admin management |
| `/api/votes` | Wishlist voting and leaderboard |
| `/api/analytics` | Admin analytics |

Health checks are available at `/health`.

## Documentation

- [Software Requirements Specification](./SRS%20document.pdf)
- [Class diagram](./Emporio%20Class%20Diagram.png)
- [Demo video](https://www.youtube.com/watch?v=CcrrEl5yr_4)

## License

This project is licensed under the [MIT License](./LICENSE).
