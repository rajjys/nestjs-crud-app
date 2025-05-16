# NestJS CRUD Application with React Frontend

A full-stack application built with **NestJS** (backend) and **React** (frontend) featuring authentication, user profile management, and bookmark CRUD operations. Includes robust end-to-end testing and a clean, modern UI.

---

## Features

- **User Authentication:** Register and login securely.
- **Profile Management:** View and edit your user profile.
- **Bookmark Management:** Create, view, edit, and delete bookmarks.
- **End-to-End Testing:** Automated tests for all major flows.
- **Modern React Frontend:** Responsive and user-friendly interface.

---

## Screenshots

### Login Screen
![Login Screen](/frontend/public/snap-1.jpg)

### Signup Screen
![Signup Screen](/frontend/public/snap-2.jpg)

### Main Page (Bookmarks & Profile)
![Main Page](/frontend/public/snap-3.jpg)

---

## Modules Overview

- **App Module**
- **Auth Module & Services**
- **Prisma Module & Services**
- **User Module & Services**
- **Bookmark Module & Services**

---

## Database

- The Prisma schema is located at:  
  `prisma/schema.prisma`

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```
### 2. Setup Frontend
```bash
cd frontend
npm install
```
### 3. Configure Database Connection

Create a `.env` file at the root of your project and add the following:

```env
DATABASE_URL="postgresql://db_username:db_password@localhost:5432/nestdb?schema=public"///username, password, port and dname 
JWT_SECRET="your_hashing_secret"
```

Replace `username`, `password`, and other values as needed for your local PostgreSQL setup.

### 4. Generate Prisma Client
```bash
cd ..
npx prisma generate
```
- The server will listen at http://localhost:3333

### 5.  Start the Backend Server
```bash
npm run start
```

### 6.  Start the React Frontend
```bash
cd frontend
npm start
```
- The frontend will be available at http://localhost:3000

### End-to-End Testing
To run the e2e tests:
```bash
npm run test:e2e
```
### Folder Structure
nest-api/
│
├── src/                # NestJS backend source
├── frontend/           # React frontend source
│   ├── public/
│   │   ├── snap-1.jpg
│   │   ├── snap-2.jpg
│   │   └── snap-3.jpg
│   └── ...
├── prisma/
│   └── schema.prisma
└── ...

### License
MIT