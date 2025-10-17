 # Dự án Expense Tracker (Quản lý thu - chi cá nhân)

## 1. 📘 Mô tả Dự Án

Ứng dụng **Expense Tracker** là một hệ thống quản lý thu chi cá nhân, gồm frontend (React + Vite) và backend (Node.js + Express + MongoDB). Mục tiêu của dự án là giúp người dùng theo dõi thu nhập, chi tiêu, xem báo cáo tổng quan và quản lý ảnh hồ sơ người dùng.

Ứng dụng cung cấp các chức năng chính:

- Xác thực người dùng: đăng ký, đăng nhập bằng JWT
- Quản lý Thu nhập (Income): thêm, xem, xóa, tải Excel
- Quản lý Chi tiêu (Expense): thêm, xem, xóa, tải Excel
- Dashboard: tổng quan tổng thu, tổng chi, giao dịch gần đây, thống kê 30/60 ngày
- Upload ảnh hồ sơ người dùng (multer)
 - Quốc tế hóa giao diện (i18n): hỗ trợ EN/JA/VI (i18next + react-i18next)
 - Chế độ tối (Dark mode) dùng Tailwind v4 (class strategy)
 - Lập kế hoạch ngân sách (Budget Planning): thêm/sửa/xóa ngân sách theo danh mục, thanh tiến độ, thẻ tổng quan (lưu cục bộ bằng localStorage)

## 2. 📌 Tính Năng Chính

### 🔐 Xác thực người dùng
- Đăng ký / Đăng nhập với JWT (token có thời hạn 1 giờ)
- Lấy thông tin user hiện tại (protected route)

### 💸 Quản lý Thu nhập
- Thêm nguồn thu: `{ icon, source, amount, date }`
- Lấy toàn bộ thu nhập của user
- Xóa thu nhập theo id
- Tải dữ liệu thu nhập về file Excel

### 🧾 Quản lý Chi tiêu
- Thêm khoản chi: `{ icon, category, amount, date }`
- Lấy toàn bộ chi tiêu của user
- Xóa chi tiêu theo id
- Tải dữ liệu chi tiêu về file Excel

### 📊 Dashboard
- Tính tổng thu, tổng chi, tổng số dư
- Thống kê giao dịch 30/60 ngày và trả về các giao dịch gần đây

### 🖼️ Upload ảnh
- Upload ảnh hồ sơ qua endpoint `POST /api/v1/auth/upload-image` (field `image`), file lưu ở `backend/uploads/`

## 3. 🚀 Công Nghệ Sử Dụng

### Backend
- Node.js, Express 5
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Multer (upload hình)
- xlsx (xuất file Excel)
 - CORS, dotenv

### Frontend
- React 19, Vite 7
- react-router-dom 7, axios
- Tailwind CSS v4 (hỗ trợ dark mode theo class `.dark`)
- i18next, react-i18next (đa ngôn ngữ EN/JA/VI)
- Recharts (biểu đồ)

## 4. ⚙️ Cài Đặt và Hướng Dẫn Sử Dụng (Local)

### Yêu cầu hệ thống
- Node.js >= 18
- npm
- MongoDB 

### 1) Backend

```powershell
cd backend
npm install
# phát triển (nodemon)
npm run dev
# hoặc production
npm start
```

Tạo file `.env` trong `backend/` với nội dung mẫu:

```
MONGODB_URI=<connection-string-to-mongodb>
JWT_SECRET=<some-secret-string>
CLIENT_URL=http://localhost:5173
PORT=8000
```

### 2) Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy trên `http://localhost:5173`. Kiểm tra và chỉnh `frontend/src/utils/apiPaths.js` nếu backend sử dụng port khác (frontend hiện tại đặt `BASE_URL = "http://localhost:8000"`).

Nếu muốn giữ backend mặc định 5000 theo `server.js`, hãy đổi `BASE_URL` trong `frontend/src/utils/apiPaths.js` sang `http://localhost:5000`. Khuyến nghị: đặt `PORT=8000` trong `.env` backend để khớp cấu hình frontend hiện tại.

## 5. 🌐 i18n (Đa ngôn ngữ)

- Sử dụng i18next + react-i18next
- File dịch: `frontend/src/locales/{en,ja,vi}/*.json`
- Trong component, dùng hook `useTranslation()` và gọi `t('your.key')`
- Đã tích hợp cho Layout, Settings/Profile và trang Budget Planning

## 6. 🌙 Chế độ Tối (Dark Mode)

- Tailwind CSS v4, chiến lược theo class `.dark` gắn trên thẻ `<html>`
- Nút chuyển theme: `frontend/src/components/layouts/DarkModeToggle.jsx`
- Các class có biến thể `dark:` để đổi style theo theme

Lưu ý: Tailwind v4 dùng `@import "tailwindcss";` trong `frontend/src/index.css` thay cho cấu hình v3.
**** Chế độ chưa được hoàn thiện.

## 7. 💰 Budget Planning

- Trang: `frontend/src/pages/Dashboard/BudgetPlanning.jsx`
- Thành phần: `frontend/src/components/Budget/*`
- Dịch vụ lưu cục bộ: `frontend/src/services/budgetService.js` (localStorage)

Cấu trúc dữ liệu budget:

```
{
	id: string,
	category: string,
	limit: number,
	spent: number,
	color?: string
}
```

Tính năng:
- Thêm/Sửa/Xóa ngân sách theo danh mục
- Thanh tiến độ theo tỷ lệ đã chi/giới hạn
- Thẻ tổng quan: Tổng ngân sách, Đã chi, Còn lại
** Chức năng chưa hoàn thiện , dừng lại ở việc demo , chưa liên kết với dữ liệu trong income, expense.

## 5. 🛠️ API Endpoints (Chi tiết)

Tất cả endpoint có prefix `/api/v1`.

### Auth

- POST `/api/v1/auth/register`
	- Body JSON: `{ fullName, email, password, profileImageUrl? }`
	- Response: `{ id, user, token }` (201)

- POST `/api/v1/auth/login`
	- Body JSON: `{ email, password }`
	- Response: `{ id, user, token }` (200)

- GET `/api/v1/auth/getUser` (protected)
	- Header: `Authorization: Bearer <token>`
	- Response: user object (không bao gồm password)

- POST `/api/v1/auth/upload-image`
	- multipart/form-data, field: `image`
	- Response: `{ imageUrl }`

### Income

- POST `/api/v1/income/add` (protected)
	- Body: `{ icon, source, amount, date }`
	- Response: created income object

- GET `/api/v1/income/get` (protected)
	- Response: `[ incomeObjects ]`

- DELETE `/api/v1/income/:id` (protected)

- GET `/api/v1/income/downloadexcel` (protected)
	- Trả về file `income_details.xlsx`

### Expense

- POST `/api/v1/expense/add` (protected)
	- Body: `{ icon, category, amount, date }`

- GET `/api/v1/expense/get` (protected)

- DELETE `/api/v1/expense/:id` (protected)

- GET `/api/v1/expense/downloadexcel` (protected)

### Dashboard

- GET `/api/v1/dashboard` (protected)
	- Response: `{ totalBalance, totalIncome, totalExpense, last30DaysExpenses, last60DaysIncome, recentTransactions }`

## 6. 🗃️ Database & Mô hình dữ liệu (Tóm tắt)

- `User`:
	- `fullName`, `email` (unique), `password` (được hash), `profileImageUrl`

- `Income`:
	- `userId` (ObjectId), `icon`, `source`, `amount`, `date`

- `Expense`:
	- `userId` (ObjectId), `icon`, `category`, `amount`, `date`

## 7. Video demo
...

## 8. Tác giả và liên hệ
- Nguyễn Mạnh Tuấn - 0378655909

---

<<<<<<< HEAD

=======
>>>>>>> 1960bfe2c6ebe919f775df6a0c9c1cf0887efdce


