# 🗳️ VoteWise – Election Education Assistant

**VoteWise** is a modern, mobile-first web application designed to simplify the election process for first-time voters. Inspired by the gamified learning experience of Duolingo, it transforms complex civic procedures into an interactive "Voting Journey."

---

## 🚀 Key Features

- **🎮 Gamified Voting Journey**: An interactive, winding path that guides users through every step of the election process—from checking eligibility to tracking results.
- **🤖 VoteBot AI Assistant**: A smart chatbot designed to answer election-related queries in beginner-friendly language.
- **📍 Smart Location Integration**: Automatically detects the user's constituency and provides relevant polling information using real-time geolocation.
- **📚 Micro-Learning Modules**: Unlockable "books" and a vertical timeline that break down election procedures into bite-sized, easy-to-understand lessons.
- **🏆 Progress Tracking**: Earn gems, maintain streaks, and unlock achievements as you progress through your voting journey.
- **🔒 Secure Authentication**: A fully integrated Node.js backend handles user accounts, hashed passwords, and persistent data storage.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** (Vite)
- **React Router 7** (Routing)
- **Lucide React** (Iconography)
- **Vanilla CSS** (Custom Design System & Keyframe Animations)

### **Backend**
- **Node.js & Express** (API Server)
- **SQLite3** (Local Database)
- **JWT** (Authentication & Security)
- **Bcrypt.js** (Password Hashing)

---

## ⚙️ Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/VoteWise.git
   cd VoteWise
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   ```
   ```bash
   npm install
   ```
   ```bash
   cd ..
   ```

### **Running the App**

To run both the **Frontend** and the **Backend** simultaneously, use the following command in the root directory:

```bash
npm run dev:full
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## 📂 Project Structure

```text
VoteWise/
├── backend/                # Node.js API Server
│   ├── database.sqlite     # SQLite Database (Auto-generated)
│   ├── server.js           # API Endpoints & Middleware
│   └── db.js               # Database Configuration
├── src/                    # React Frontend
│   ├── components/         # Reusable UI Elements (Button, Card, etc.)
│   ├── hooks/              # Custom React Hooks (useAuth, useProgress)
│   ├── pages/              # Application Views (Home, Learn, Chat, Profile)
│   └── index.css           # Global Design Tokens & Styles
└── package.json            # Project Metadata & Scripts
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve VoteWise, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ✨ Acknowledgments

- **Design Inspiration**: Duolingo
- **Icons**: Lucide React
- **Maps**: OpenStreetMap Nominatim API

Developed with ❤️ to empower the next generation of voters.
