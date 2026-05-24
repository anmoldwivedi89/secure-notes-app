# 📝 Notes App

A full-stack **Notes Management Application** built with **Node.js + Express + MongoDB** on the backend and **React + Vite** on the frontend. Features JWT-based authentication, role-based access control, full CRUD for notes, Swagger API documentation, and a premium dark-mode UI.

---

## ✨ Features

- 🔐 **User Authentication** – Secure register & login with JWT
- 🔑 **Role-Based Access Control** – `user` and `admin` roles
- 📝 **Notes CRUD** – Create, Read (all / single), Update, Delete notes
- 🛡️ **Security** – Helmet headers, rate limiting, bcrypt password hashing
- ✅ **Input Validation** – express-validator on all endpoints
- 📖 **Swagger Docs** – Interactive OpenAPI 3.0 documentation
- 📬 **Postman Collection** – Ready-to-import API collection
- 🎨 **Premium Dark UI** – Glassmorphism design with micro-animations
- ⚠️ **Centralized Error Handling** – Consistent JSON error responses

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | HTTP server & routing |
| MongoDB + Mongoose | Database & ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT generation & verification |
| express-validator | Input validation |
| helmet | Security HTTP headers |
| express-rate-limit | Brute-force protection |
| morgan | HTTP request logging |
| swagger-ui-express | API documentation UI |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP client with interceptors |
| CSS (custom) | Dark-mode premium design |

---

## 📁 Folder Structure

```
project/
├── config/
│   ├── db.js               # MongoDB connection
│   ├── jwt.js              # JWT token generator
│   └── swagger.js          # OpenAPI 3.0 specification
├── controllers/
│   ├── adminController.js  # Admin: get all users
│   ├── healthController.js # Health check
│   ├── noteController.js   # Notes CRUD logic
│   └── userController.js   # Register, login, profile
├── middleware/
│   ├── admin.js            # Admin role guard
│   ├── auth.js             # JWT protect middleware
│   ├── errorHandler.js     # Global error handler
│   ├── notFound.js         # 404 handler
│   ├── noteOwnerOrAdmin.js # Note ownership check
│   ├── validate.js         # express-validator runner
│   └── validators/
│       ├── noteValidators.js
│       └── userValidators.js
├── models/
│   ├── Note.js             # Note Mongoose schema
│   └── User.js             # User Mongoose schema
├── routes/
│   ├── index.js            # Root router
│   ├── adminRoutes.js
│   ├── noteRoutes.js
│   └── userRoutes.js
├── utils/
│   └── AppError.js         # Custom operational error class
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
├── postman_collection.json # Postman API collection
├── README.md
├── SCALABILITY.md          # Scalability & architecture notes
└── server.js               # Application entry point

client/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js        # Axios instance + interceptors
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx   # Notes CRUD page
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── utils/
│   │   └── auth.js         # localStorage token helpers
│   ├── App.jsx             # Route definitions
│   ├── App.css
│   ├── index.css           # Global design system
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js          # Dev proxy to backend
```

---

## 🚀 Backend Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### Steps

```bash
# 1. Navigate to project root
cd project

# 2. Install dependencies
npm install

# 3. Create environment file from example
copy .env.example .env

# 4. Edit .env with your values (see Environment Variables section)

# 5. Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

---

## 💻 Frontend Setup

```bash
# 1. Navigate to client directory
cd project/client

# 2. Install dependencies
npm install

# 3. Create environment file (optional – Vite proxy handles local dev)
copy .env.example .env

# 4. Start development server
npm run dev
```

The React app will be available at `http://localhost:5173`

> **Note:** The Vite dev server proxies all `/api/*` requests to `http://localhost:5000`, so no CORS issues during development.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with these variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (`development`/`production`) | `development` |
| `MONGODB_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret key for signing JWTs (min 32 chars) | — |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

---

## 🗄️ MongoDB Configuration

### Local MongoDB
```
MONGODB_URI=mongodb://localhost:27017/notesapp
```

### MongoDB Atlas (Cloud)
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist your IP address
4. Copy the connection string and set:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/notesapp?retryWrites=true&w=majority
```

---

## 🔐 JWT Authentication Flow

```
1. POST /api/users/register
   → Validates input → Hashes password (bcrypt, 10 rounds)
   → Saves user to MongoDB → Returns user data (no token)

2. POST /api/users/login
   → Validates credentials → Compares bcrypt hash
   → Signs JWT with { id: userId } and JWT_SECRET
   → Returns token + user data

3. Protected Route Access
   → Client sends: Authorization: Bearer <token>
   → protect middleware verifies JWT signature + expiry
   → Fetches user from DB (ensures user still exists)
   → Attaches req.user → Proceeds to controller

4. Token Expiry / Invalid Token
   → JsonWebTokenError / TokenExpiredError caught
   → 401 response → Frontend clears localStorage → Redirects to /login
```

---

## 📡 API Endpoints

**Base URL:** `http://localhost:5000/api`

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | None | Server health check |

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/register` | None | Register a new user |
| POST | `/users/login` | None | Login and get JWT token |
| GET | `/users/profile` | Bearer | Get logged-in user profile |

### Notes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notes` | Bearer | Get all notes for current user |
| POST | `/notes` | Bearer | Create a new note |
| GET | `/notes/:id` | Bearer | Get a single note by ID |
| PUT | `/notes/:id` | Bearer | Update a note (owner or admin) |
| DELETE | `/notes/:id` | Bearer | Delete a note (owner or admin) |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/users` | Bearer (admin) | Get all registered users |

---

## 📖 Swagger / API Documentation

Interactive Swagger UI is available at:
```
http://localhost:5000/api-docs
```

### Using Swagger with JWT:
1. Call `POST /api/users/login` via Swagger or Postman
2. Copy the `token` value from the response
3. Click the **Authorize** button (🔒) in Swagger UI
4. Enter: `Bearer <your-token-here>`
5. Click **Authorize** → Now all protected endpoints will include the token

---

## 📬 Postman Collection

A complete Postman collection is included at `postman_collection.json`.

### Import Steps:
1. Open Postman
2. Click **Import** (top-left)
3. Select `postman_collection.json`
4. The collection **Notes App API** will appear with all requests
5. Set the `base_url` collection variable to `http://localhost:5000`

### Workflow to test:
1. Run **Register User** → creates account
2. Run **Login User** → copies token to collection variable automatically
3. Run **Create Note**, **Get Notes**, **Update Note**, **Delete Note**

---

## 🖼️ Screenshots

> *(Replace with actual screenshots after running the app)*

| Page | Description |
|------|-------------|
| ![Login](./screenshots/login.png) | Login page with dark glassmorphism design |
| ![Register](./screenshots/register.png) | Register page |
| ![Dashboard](./screenshots/dashboard.png) | Dashboard with notes CRUD |
| ![Swagger](./screenshots/swagger.png) | Swagger API documentation |

---

## 🌐 Deployment Instructions

### Backend (e.g., Render / Railway)

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your repository
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add environment variables (from `.env.example`)
7. Set `NODE_ENV=production`

### Frontend (e.g., Vercel / Netlify)

1. Navigate to `client/`
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

### Docker (see `SCALABILITY.md` for full Docker setup)

```bash
# Build and run backend
docker build -t notes-backend .
docker run -p 5000:5000 --env-file .env notes-backend
```

---

## 🔮 Future Improvements

- [ ] **Refresh Tokens** – Implement token rotation for better security
- [ ] **Note Tags / Categories** – Organize notes with labels
- [ ] **Search & Filter** – Full-text search across notes
- [ ] **Pagination** – Cursor-based pagination for large note collections
- [ ] **Note Sharing** – Share notes with specific users
- [ ] **File Attachments** – Upload images/files to notes
- [ ] **Email Verification** – Verify email on registration (nodemailer)
- [ ] **Password Reset** – Forgot password via email link
- [ ] **2FA** – Two-factor authentication with TOTP
- [ ] **Redis Caching** – Cache frequently read notes (see `SCALABILITY.md`)
- [ ] **Microservices** – Extract auth into a separate service
- [ ] **WebSockets** – Real-time note collaboration
- [ ] **Dark/Light Toggle** – Theme switcher in the UI
- [ ] **PWA** – Make the app installable as a Progressive Web App

---

## 👤 Author

Built as an internship project demonstrating full-stack Node.js + React development with professional-grade code structure, security practices, and documentation.

---

## 📄 License

ISC
