# FoodExpress - Full-Stack Food Delivery Application 🍔🍕

A complete, production-ready Full-Stack Food Delivery Web Application built with **HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, MongoDB Atlas, Mongoose, and JWT Authentication**.

---

## 📁 Project Structure

```text
FoodExpress_delivery app/
│
├── backend/                              # Full-Stack Node.js + Express Backend
│   ├── config/
│   │   └── db.js                         # Mongoose MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js             # User registration, login, and auth logic
│   │   ├── foodController.js             # Menu CRUD and search filtering
│   │   └── orderController.js            # Secure order placement & order history
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT Bearer token protection
│   │   └── errorMiddleware.js            # Centralized error handler & 404
│   ├── models/
│   │   ├── User.js                       # User schema with bcrypt password hashing
│   │   ├── Food.js                       # Food menu item schema
│   │   └── Order.js                      # Order schema with address and items
│   ├── routes/
│   │   ├── authRoutes.js                 # /api/auth routes
│   │   ├── foodRoutes.js                 # /api/foods routes
│   │   └── orderRoutes.js                # /api/orders routes
│   ├── seed/
│   │   └── seedFoods.js                  # Database seeder for initial menu items
│   ├── .env                              # Environment variables (DB credentials, secret)
│   ├── .env.example                      # Template for environment variables
│   ├── .gitignore                        # Git ignore rules for node_modules and .env
│   ├── package.json                      # Project dependencies & scripts
│   └── server.js                         # Express server & static frontend serving
│
└── food delivery app/                    # Frontend Web Application (Preserved UI)
    ├── address.html & address.js         # Delivery address form & GPS auto-detect
    ├── auth-ui.js                        # Dynamic header (Hi User / Logout / Orders)
    ├── cart.html & cart.js               # Cart management, item counts & bill summary
    ├── checkout.html & checkout.js       # Order summary, payment choice & placement
    ├── config.js                         # Smart dynamic API_BASE_URL resolver
    ├── index.html                        # Hero landing page & popular categories
    ├── login.html & login.js             # Register & Login forms with JWT handling
    ├── menu.html & menu.js               # Dynamic food catalog loaded from MongoDB
    ├── orders.html & orders.js           # Real-time order history & delivery statuses
    ├── search.js                         # Dynamic instant food search filter
    ├── style.css                         # Complete application styling & animations
    └── success.html & success.js         # Order confirmation & tracking page
```

---

## 🚀 Quick Start Guide

### Step 1: Install Node.js (If not already installed)
If `node -v` does not work in your terminal:
1. Open PowerShell and run:
   ```powershell
   winget install OpenJS.NodeJS.LTS
   ```
   *Or download and run the installer from: [nodejs.org](https://nodejs.org/)*
2. Restart your terminal / VS Code and verify:
   ```bash
   node -v
   npm -v
   ```

### Step 2: Install Backend Dependencies
Open your terminal in the `backend` folder:
```bash
cd backend
npm install
```

### Step 3: Configure MongoDB Atlas in `.env`
In `backend/.env`, ensure your connection string is set up:
```env
PORT=5000
MONGODB_URI=mongodb+srv://abhiraj12022005_db_user:Tdyet0kXlXDAOqPx@cluster0.mongodb.net/foodexpress?retryWrites=true&w=majority
JWT_SECRET=foodexpress_secret_jwt_key_2026_change_in_production
```
*(Replace `cluster0.mongodb.net` with the exact cluster host from your MongoDB Atlas modal)*

### Step 4: Seed Initial Menu Items into MongoDB
Populate the 8 menu items into MongoDB Atlas:
```bash
npm run seed
```

### Step 5: Start the Backend Server
```bash
npm run dev
```
*(or `npm start`)*

Your application is now live at:
👉 **http://localhost:5000**

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user with name, email, password |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |

### Food Menu (`/api/foods`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/foods` | Public | Get all food items (supports `?search=` and `?category=`) |
| `GET` | `/api/foods/:id` | Public | Get single food item by MongoDB ID |
| `POST` | `/api/foods` | Admin/Public | Create new food item |
| `PUT` | `/api/foods/:id` | Admin/Public | Update food item |
| `DELETE` | `/api/foods/:id` | Admin/Public | Delete food item |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Private | Place order (validates food prices against DB) |
| `GET` | `/api/orders` | Private | Get order history of logged-in user |
| `GET` | `/api/orders/:id` | Private | Get details of a single order |
| `PUT` | `/api/orders/:id/status` | Private | Update order status (Preparing/Delivered) |

---

## 🔒 Security Features Implemented
1. **Password Hashing**: Passwords hashed using `bcryptjs` with 10 salt rounds before storing in MongoDB.
2. **JWT Authentication**: Secured private endpoints using signed JSON Web Tokens with 7-day expiration.
3. **Server-Side Price Validation**: Order totals and item prices are fetched directly from MongoDB to prevent client price tampering.
4. **Environment Isolation**: Database credentials and secret keys stored in `.env` and excluded via `.gitignore`.
5. **CORS Enabled**: Configured to seamlessly permit requests from both `localhost:5000` and Live Server (`127.0.0.1:5500`).
