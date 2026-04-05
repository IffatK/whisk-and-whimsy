# 🍰 Whisk & Whimsy

A modern full-stack bakery web application that delivers a delightful online experience for browsing, ordering, and managing delicious sweets.

---

## ✨ Features

### 👤 User Features

* User authentication (Register/Login)
* Browse products with images and details
* Add to cart and wishlist
* Place and track orders
* Manage profile and addresses

### 🛠️ Admin Features

* Secure admin dashboard
* Add / update / delete products
* Manage users and orders
* View analytics and insights

---

## 🧑‍💻 Tech Stack

### Frontend

* React.js
* CSS (Custom styling)
* Axios

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL (or your DB)

### Other Tools

* JWT Authentication
* REST API architecture

---

## 📁 Project Structure

```
whisk-and-whimsy/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── user/
│   │   │   ├── admin/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── api/
│   │   └── App.js
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── server.js
│
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/whisk-and-whimsy.git
cd whisk-and-whimsy
```

---

### 2. Setup Backend

```
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Run backend:

```
npm start
```

---

### 3. Setup Frontend

```
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

| Variable     | Description           |
| ------------ | --------------------- |
| PORT         | Server port           |
| DATABASE_URL | Database connection   |
| JWT_SECRET   | Authentication secret |

---

## 🚀 Future Improvements

* Payment integration (Stripe/Razorpay)
* Real-time order tracking
* Reviews & ratings system
* Email notifications
* Mobile responsiveness improvements

---

🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---



---

💡 Author

Built with ❤️ by **Iffat**
