# VIYU TECHNOLOGIES Dynamic Backend

This project has been upgraded from a static HTML website to a fully dynamic web application using Node.js, Express, and MongoDB.

## Features Added
- **Product Management:** All 11 product category pages and the main `product.html` page load their content dynamically from the MongoDB database.
- **Admin Dashboard (`admin.html`):** JWT-secured dashboard to add, edit, and delete products, including image uploads.
- **Contact Submissions:** The `contact.html` form submits enquiries directly to the database. These submissions can be viewed and managed from the admin dashboard.
- **Seed Script (`backend/seed.js`):** Extracts all 70+ existing products from the old hardcoded HTML and imports them into MongoDB so your site is populated instantly.

---

## Technical Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **File Uploads:** Multer (saving images to `assets/images/`)
- **Frontend Integration:** Vanilla JS (`assets/js/api.js`) fetching data asynchronously, meaning zero changes to existing Bootstrap styling.

---

## Setup Instructions

### 1. Prerequisites
- Install **Node.js** (v18+ recommended)
- Install **MongoDB** (Local Community Edition) or have a MongoDB Atlas URI string.

### 2. Installation
Navigate to the `backend` folder via your terminal and install the required dependencies:
```bash
cd backend
npm install
```

### 3. Environment Configuration
The `.env` file is already created for your local development inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/viyu_technologies
JWT_SECRET=change_this_to_a_random_secret_key_123
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```
*Note: In production, ensure you change the `JWT_SECRET` and user credentials.*

### 4. Seed the Database
Before running the application for the first time, populate the MongoDB database with all existing products and create the default admin user:
```bash
npm run seed
```
This script reads the hardcoded product list (from CCTV, fire, biometric, etc.) and injects 70+ products into the DB.

### 5. Start the Server
Run the Express server:
```bash
npm run dev
```
*(Use `npm start` for production without nodemon)*

The server will start at `http://localhost:5000` and will serve your frontend files automatically from the root directory.

---

## Accessing the Site & Admin Dashboard
- **Public Website:** Go to `http://localhost:5000`
- **Admin Dashboard:** Go to `http://localhost:5000/admin.html`
- **Login Credentials:** Use `admin` / `admin123` (unless you changed them in your `.env` file).

## Modifying Categories & Enums
If you ever want to add a *new* product category (e.g. "Generators"), you must update the `<select>` options in `admin.html` and the Schema enum array in `backend/models/Product.js`.
