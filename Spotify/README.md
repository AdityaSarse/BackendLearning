# 🎵 Spotify Clone

A full-stack Spotify-inspired music streaming application built using the MERN stack. The application allows users to stream music, create playlists, explore albums, and enables artists to upload and manage their own content.

---

## 🎥 Demo Video

▶️ Click below to watch the application demo.

[Watch Demo Video](https://github.com/AdityaSarse/BackendLearning/blob/main/Spotify/demo.mp4)

--

---

## ✨ Features

### 🎧 Listener Features

* User Registration and Login
* JWT Authentication
* Search songs and artists
* Play and pause music
* Next and previous controls
* Create and manage playlists
* Like and save songs
* Listen to complete albums
* Personalized music recommendations
* Responsive music player
* Persistent user sessions

### 🎤 Artist Features

* Artist Registration and Authentication
* Artist Dashboard
* Upload songs
* Create albums
* Manage uploaded music
* Manage albums
* View artist content
* Artist Console for content management

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Redux Toolkit
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* JWT Authentication
* REST API
* Axios
* ImageKit

### Cloud & Deployment

* Vercel
* ImageKit

---

## 📸 Application Preview

Add screenshots of:

* Login Page
* Dashboard
* Music Player
* Artist Console
* Playlist Page

---

## 📁 Project Structure

```text
Spotify
│
├── Backend
│   ├── src
│   │   ├── controllers
│   │   ├── DB
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   └── services
│   ├── server.js
│   └── package.json
│
└── Frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── redux
    │   └── assets
    ├── App.jsx
    └── package.json
```

---

## 🗄️ Database Collections

* Users
* Music
* Albums
* Playlists
* Liked Songs

---

## 🎵 Media Storage

Audio files and album images are stored using **ImageKit**.

MongoDB stores the application data and ImageKit URLs for music and images.

---

## 🔐 Authentication & Authorization

* JWT Authentication
* Protected Routes
* Role-Based Access Control
* Listener and Artist Accounts

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/AdityaSarse/BackendLearning.git
cd Spotify
```

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the Backend directory.

```env
MONGO_URI=
JWT_SECRET=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_PRIVATE_KEY=
URL_ENDPOINT=
```

---

## 🚀 Future Improvements

* Music recommendations using AI
* Recently played songs
* User profiles
* Song comments and reviews
* Real-time notifications
* Mobile responsive improvements

---

## 👨‍💻 Author

**Aditya Sarse**

Full Stack Developer

* React.js
* Node.js
* Express.js
* MongoDB
* Tailwind CSS
