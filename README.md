 # 💰 Expense Tracker - Quản Lý Thu Chi Cá Nhân | 個人財務管理アプリ

## 📘 Giới Thiệu | はじめに

Ứng dụng web fullstack giúp quản lý tài chính cá nhân với các tính năng:
個人の財務状況を総合的に管理するフルスタックWebアプリケーションです。

- 💵 Quản lý thu nhập & chi tiêu | 収入・支出の記録・管理
- 💰 Lập kế hoạch ngân sách theo tháng | 月単位の予算計画
- 🎯 Đặt mục tiêu tài chính & theo dõi tiến độ | 財務目標の設定と進捗追跡
- ⏰ Nhắc nhở thanh toán | 支払期限のリマインダー
- 📊 Báo cáo & biểu đồ trực quan | レポートとグラフによる可視化
- 🌍 Đa ngôn ngữ (EN/JA/VI) & 🌙 Dark Mode | 多言語対応（英語・日本語・ベトナム語）& ダークモード

**Tech Stack:**
- Frontend: React 19, Vite 7, Tailwind CSS v4
- Backend: Node.js, Express 5, MongoDB
- Auth: JWT | Storage: MongoDB + localStorage

## ✨ Tính Năng Chính | 主な機能

### 🔐 Xác Thực | 認証機能
- Đăng ký/Đăng nhập với JWT (expires: 1h) | JWT認証によるユーザー登録・ログイン（有効期限：1時間）
- Password hashing (bcryptjs) | bcryptjsによるパスワード暗号化
- Upload avatar (Multer) | Multerによるアバター画像アップロード

### 💵 Thu Nhập & Chi Tiêu | 収入・支出管理
- CRUD operations (MongoDB) | MongoDB を用いたデータの作成・取得・削除
- Export Excel | Excelへのデータ出力
- Biểu đồ Line Chart (Income - 60 ngày) & Bar Chart (Expense - 30 ngày) | 折れ線グラフ（収入・60日間）& 棒グラフ（支出・30日間）
- **🔄 Auto-sync**: Expense tự động cập nhật Budget & Goals | 支出追加・削除時に予算・目標を自動更新

### 📊 Dashboard | ダッシュボード
- Tổng quan: Balance, Income, Expense | 残高・収入・支出のサマリー表示
- Biểu đồ: Bar, Line, Pie charts (Recharts) | 棒グラフ・折れ線グラフ・円グラフ（Recharts使用）
- 10 giao dịch gần nhất | 直近10件のトランザクション一覧

### 💰 Budget Planning | 予算計画
- Lập ngân sách theo tháng với từng category | カテゴリ別の月次予算設定
- Progress bar & color-coding (Green/Yellow/Red) | 進捗バー＆カラーコーディング（緑・黄・赤）
- Cảnh báo vượt ngân sách | 予算超過時の警告通知
- **Auto-sync từ Expense** | 支出との自動同期
- Chuyển tháng mới (Start New Month) | 月次繰り越し機能
- Lịch sử 3 tháng trước | 直近3か月の履歴表示
- **localStorage** - Data persistent | ブラウザ保存領域によるデータ保持

### 🎯 Goals | 財務目標
- Đặt mục tiêu với targetAmount & deadline | 目標金額・期限の設定
- Progress tracking với countdown | 進捗追跡とカウントダウン
- **Auto-sync từ Expense** | 支出との自動同期
- Filter Active/Completed | アクティブ・達成済みのフィルタリング
- **localStorage** - Data persistent | ブラウザ保存領域によるデータ保持

### ⏰ Reminders | リマインダー
- Tạo nhắc nhở với date, time, priority | 日時・優先度付きのリマインダー作成
- Status: Overdue/Today/Upcoming | ステータス：期限切れ・当日・今後の予定
- Filter Active/Completed | アクティブ・完了済みのフィルタリング
- **localStorage** - Data persistent | ブラウザ保存領域によるデータ保持

### ⚙️ Settings | 設定
- Profile: Edit name, email, avatar | プロフィール編集（名前・メール・アバター）
- Security: Đổi mật khẩu | セキュリティ：パスワード変更
- Preferences: Language (EN/JA/VI), Dark mode | 言語設定・ダークモード切替

### 🌐 i18n & 🌙 Dark Mode | 多言語対応とダークモード
- Đa ngôn ngữ: English, Japanese, Vietnamese (236+ keys) | 英語・日本語・ベトナム語（236以上のキー）
- Dark mode với Tailwind v4 | Tailwind v4によるダークモード
- Persistent preferences (localStorage) | 設定の永続保存

## 🛠️ Tech Stack

### Backend
- Node.js, Express 5.1.0, MongoDB, Mongoose 8.19.0
- JWT (jsonwebtoken 9.0.2), bcryptjs 3.0.2
- Multer 2.0.2, xlsx 0.18.5
- cors, dotenv, express-session

### Frontend
- React 19.1.1, Vite 7.1.7, react-router-dom 7.9.3
- Tailwind CSS 4.1.14, @tailwindcss/vite 4.1.14
- axios 1.12.2, i18next 25.6.0, react-i18next 16.0.1
- Recharts 3.2.1, react-hot-toast 2.6.0, react-icons 5.5.0
- emoji-picker-react 4.14.0, moment 2.30.1

### Storage | データ保存
- **MongoDB**: Income, Expense, User | 収入・支出・ユーザー情報
- **localStorage**: Budget, Goals, Reminders, Token, Language, Theme | 予算・目標・リマインダー・設定

## ⚙️ Cài Đặt | セットアップ手順

### Yêu cầu | 必要環境
- Node.js >= 18.x, npm, MongoDB

### Backend
```bash
cd backend
npm install

# Tạo file .env | .envファイルを作成
MONGODB_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_secret_key
PORT=8000

# Chạy server | サーバー起動
npm run dev  # Development | 開発環境
npm start    # Production  | 本番環境
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📂 Cấu Trúc Project | プロジェクト構成

```
backend/
├── config/db.js              # MongoDB connection | DB接続設定
├── controllers/              # Auth, Dashboard, Expense, Income
├── middleware/               # JWT auth, Multer upload
├── models/                   # User, Income, Expense (Mongoose)
├── routes/                   # API routes
├── uploads/                  # Profile images | プロフィール画像
└── server.js

frontend/
├── src/
│   ├── components/           # Budget, Charts, Dashboard, Expense, Income,
│   │                         # Goals, Reminders, Settings, layouts
│   ├── context/              # User context | ユーザーコンテキスト
│   ├── hooks/                # useUserAuth
│   ├── locales/              # en, ja, vi (i18n)
│   ├── pages/                # Auth, Dashboard pages
│   ├── services/             # budgetService, goalService, reminderService
│   ├── utils/                # apiPaths, axiosInstance, helpers
│   └── App.jsx
└── vite.config.js
```

## 🎨 UI/UX

- **Dark Mode**: Tailwind v4 với `.dark` class, persistent localStorage | `.dark`クラスとlocalStorageによる永続ダークモード
- **i18n**: 236+ translation keys (EN/JA/VI) | 236以上の翻訳キー
- **Responsive**: Mobile-first design | モバイルファーストのレスポンシブデザイン
- **Components**: Emoji picker, Color picker, Date picker, Modal, Toast, Progress bars, Interactive charts | 絵文字ピッカー・カラーピッカー・日付ピッカー・モーダル・トースト・プログレスバー・インタラクティブチャート

## 🌐 API Endpoints

**Base URL**: `/api/v1` | **Auth**: Bearer Token

### Auth (`/auth`)
- `POST /register` - Đăng ký | ユーザー登録
- `POST /login` - Đăng nhập | ログイン
- `GET /getUser` - Lấy thông tin user (protected) | ユーザー情報取得（認証必須）
- `PUT /update` - Cập nhật profile (protected) | プロフィール更新（認証必須）
- `PUT /change-password` - Đổi mật khẩu (protected) | パスワード変更（認証必須）
- `POST /upload-image` - Upload avatar | アバター画像アップロード

### Income (`/income`) - Protected | 認証必須
- `POST /add` - Thêm thu nhập | 収入追加
- `GET /get` - Lấy tất cả thu nhập | 収入一覧取得
- `DELETE /:id` - Xóa thu nhập | 収入削除
- `GET /downloadexcel` - Export Excel | Excel出力

### Expense (`/expense`) - Protected | 認証必須
- `POST /add` - Thêm chi tiêu | 支出追加
- `GET /get` - Lấy tất cả chi tiêu | 支出一覧取得
- `DELETE /:id` - Xóa chi tiêu | 支出削除
- `GET /downloadexcel` - Export Excel | Excel出力

### Dashboard (`/dashboard`) - Protected | 認証必須
- `GET /` - Lấy tổng quan (balance, income, expense, charts data, recent transactions) | サマリー取得（残高・収入・支出・グラフデータ・直近トランザクション）

## 👨‍💻 Author | 作者

**Nguyễn Mạnh Tuấn**
- GitHub: [@NguyenManhTuan-20235862](https://github.com/NguyenManhTuan-20235862)
- Phone: 0378655909
