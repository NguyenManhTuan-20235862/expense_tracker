 # 💰 Expense Tracker - Quản Lý Thu Chi Cá Nhân

## 📘 Giới Thiệu

Ứng dụng web fullstack giúp quản lý tài chính cá nhân với các tính năng:
- 💵 Quản lý thu nhập & chi tiêu
- 💰 Lập kế hoạch ngân sách theo tháng
- 🎯 Đặt mục tiêu tài chính & theo dõi tiến độ
- ⏰ Nhắc nhở thanh toán
- 📊 Báo cáo & biểu đồ trực quan
- 🌍 Đa ngôn ngữ (EN/JA/VI) & 🌙 Dark Mode

**Tech Stack:**
- Frontend: React 19, Vite 7, Tailwind CSS v4
- Backend: Node.js, Express 5, MongoDB
- Auth: JWT | Storage: MongoDB + localStorage

## ✨ Tính Năng Chính

### 🔐 Xác Thực
- Đăng ký/Đăng nhập với JWT (expires: 1h)
- Password hashing (bcryptjs)
- Upload avatar (Multer)

### 💵 Thu Nhập & Chi Tiêu
- CRUD operations (MongoDB)
- Export Excel
- Biểu đồ Line Chart (Income - 60 ngày) & Bar Chart (Expense - 30 ngày)
- **🔄 Auto-sync**: Expense tự động cập nhật Budget & Goals

### 📊 Dashboard
- Tổng quan: Balance, Income, Expense
- Biểu đồ: Bar, Line, Pie charts (Recharts)
- 10 giao dịch gần nhất

### 💰 Budget Planning
- Lập ngân sách theo tháng với từng category
- Progress bar & color-coding (Green/Yellow/Red)
- Cảnh báo vượt ngân sách
- **Auto-sync từ Expense**
- Chuyển tháng mới (Start New Month)
- Lịch sử 3 tháng trước
- **localStorage** - Data persistent

### 🎯 Goals (Mục tiêu tài chính)
- Đặt mục tiêu với targetAmount & deadline
- Progress tracking với countdown
- **Auto-sync từ Expense**
- Filter Active/Completed
- **localStorage** - Data persistent

### ⏰ Reminders
- Tạo nhắc nhở với date, time, priority
- Status: Overdue/Today/Upcoming
- Filter Active/Completed
- **localStorage** - Data persistent

### ⚙️ Settings
- Profile: Edit name, email, avatar
- Security: Đổi mật khẩu
- Preferences: Language (EN/JA/VI), Dark mode

### 🌐 i18n & 🌙 Dark Mode
- Đa ngôn ngữ: English, Japanese, Vietnamese (236+ keys)
- Dark mode với Tailwind v4
- Persistent preferences (localStorage)

## 🛠️ Tech Stack

### Backend
- Node.js, Express 5.1.0, MongoDB, Mongoose 8.19.0
- JWT (jsonwebtoken 9.0.2), bcryptjs 3.0.2
- Multer 2.0.2, xlsx 0.18.5
- Passport 0.7.0, passport-google-oauth20 2.0.0
- cors, dotenv, express-session

### Frontend  
- React 19.1.1, Vite 7.1.7, react-router-dom 7.9.3
- Tailwind CSS 4.1.14, @tailwindcss/vite 4.1.14
- axios 1.12.2, i18next 25.6.0, react-i18next 16.0.1
- Recharts 3.2.1, react-hot-toast 2.6.0, react-icons 5.5.0
- emoji-picker-react 4.14.0, moment 2.30.1

### Storage
- **MongoDB**: Income, Expense, User
- **localStorage**: Budget, Goals, Reminders, Token, Language, Theme

## ⚙️ Cài Đặt

### Yêu cầu
- Node.js >= 18.x, npm, MongoDB

### Backend
```bash
cd backend
npm install

# Tạo file .env
MONGODB_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_secret_key
PORT=8000

# Chạy server
npm run dev  # Development
npm start    # Production
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
## 📂 Cấu Trúc Project

```
backend/
├── config/db.js              # MongoDB connection
├── controllers/              # Auth, Dashboard, Expense, Income
├── middleware/               # JWT auth, Multer upload
├── models/                   # User, Income, Expense (Mongoose)
├── routes/                   # API routes
├── uploads/                  # Profile images
└── server.js

frontend/
├── src/
│   ├── components/           # Budget, Charts, Dashboard, Expense, Income, 
│   │                         # Goals, Reminders, Settings, layouts
│   ├── context/              # User context
│   ├── hooks/                # useUserAuth
│   ├── locales/              # en, ja, vi (i18n)
│   ├── pages/                # Auth, Dashboard pages
│   ├── services/             # budgetService, goalService, reminderService
│   ├── utils/                # apiPaths, axiosInstance, helpers
│   └── App.jsx
└── vite.config.js
```

## 🎨 UI/UX

- **Dark Mode**: Tailwind v4 với `.dark` class, persistent localStorage
- **i18n**: 236+ translation keys (EN/JA/VI)
- **Responsive**: Mobile-first design
- **Components**: Emoji picker, Color picker, Date picker, Modal, Toast, Progress bars, Interactive charts


## 🌐 API Endpoints

**Base URL**: `/api/v1` | **Auth**: Bearer Token

### Auth (`/auth`)
- `POST /register` - Đăng ký
- `POST /login` - Đăng nhập
- `GET /getUser` - Lấy thông tin user (protected)
- `POST /upload-image` - Upload avatar (protected)

### Income (`/income`) - Protected
- `POST /add` - Thêm thu nhập
- `GET /get` - Lấy tất cả thu nhập
- `DELETE /:id` - Xóa thu nhập
- `GET /downloadexcel` - Export Excel

### Expense (`/expense`) - Protected
- `POST /add` - Thêm chi tiêu
- `GET /get` - Lấy tất cả chi tiêu
- `DELETE /:id` - Xóa chi tiêu
- `GET /downloadexcel` - Export Excel

### Dashboard (`/dashboard`) - Protected
- `GET /` - Lấy tổng quan (balance, income, expense, charts data, recent transactions)

## 👨‍💻 Author

**Nguyễn Mạnh Tuấn**
- GitHub: [@NguyenManhTuan-20235862](https://github.com/NguyenManhTuan-20235862)
- Phone: 0378655909



