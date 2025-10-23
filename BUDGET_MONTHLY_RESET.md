# 📅 Budget Planning - Tự Động Reset Theo Tháng

## ✨ Tính Năng Mới

### 1. 🔄 Tự Động Reset Theo Tháng
- **Tự động phân loại**: Mỗi budget được lưu với `month: 'YYYY-MM'`
- **Tự động hiển thị**: Khi sang tháng mới, trang sẽ hiển thị trống (không có budget cũ)
- **Dữ liệu không mất**: Budget cũ vẫn được lưu trong localStorage

### 2. 📊 Lịch Sử Tháng Trước
- **Hiển thị cuối trang**: Section mới hiển thị budget của tháng trước
- **Bảng chi tiết**: Hiển thị đầy đủ: Category, Limit, Spent, Remaining, %
- **Summary stats**: Tổng quan nhanh: Total Budget, Spent, Remaining
- **Ẩn tự động**: Nếu tháng trước không có budget, section này sẽ không hiển thị

## 🛠️ Cách Hoạt Động

### Cấu Trúc Dữ Liệu Mới

```javascript
{
  id: "uuid",
  category: "Ăn uống",
  limit: 500,
  spent: 420,
  color: "#ef4444",
  month: "2025-10",        // ← THÊM MỚI
  createdAt: "2025-10-23T..." // ← THÊM MỚI
}
```

### API Service

**budgetService.js**:
```javascript
// Lấy budget của tháng hiện tại
getBudgets()  // mặc định: tháng hiện tại
getBudgets('2025-09')  // tháng cụ thể

// Lấy budget tháng trước
getPreviousMonthBudgets()

// Helper functions
getCurrentMonthString()  // → "2025-10"
getPreviousMonthString() // → "2025-09"
formatMonthDisplay('2025-10', 'vi') // → "Tháng 10 2025"
```

### Luồng Dữ Liệu

1. **Load trang**:
   ```javascript
   // Tự động load budget tháng hiện tại
   const currentMonth = getCurrentMonthString() // "2025-10"
   const items = getBudgets(currentMonth)
   
   // Load budget tháng trước cho history
   const previousMonthItems = getPreviousMonthBudgets()
   ```

2. **Thêm budget mới**:
   ```javascript
   // Tự động gán tháng hiện tại
   addBudget({ category: 'Ăn uống', limit: 500 }, currentMonth)
   ```

3. **Sang tháng mới**:
   - Ngày 1 tháng 11: `getCurrentMonthString()` → `"2025-11"`
   - `getBudgets("2025-11")` → `[]` (trống, tháng mới)
   - `getPreviousMonthBudgets()` → budget tháng 10 (hiển thị trong history)

## 📁 Files Đã Thay Đổi

### 1. **budgetService.js** ✅
- Thêm `getCurrentMonth()`, `getPreviousMonth()`
- Cập nhật `getBudgets(month)` để filter theo tháng
- Thêm `addBudget(item, month)` với tham số tháng
- Thêm helper functions: `formatMonthDisplay()`, etc.

### 2. **BudgetHistory.jsx** ✅ (MỚI)
- Component hiển thị lịch sử tháng trước
- Summary stats với màu sắc
- Bảng chi tiết với progress %
- Tự ẩn khi không có dữ liệu

### 3. **BudgetPlanning.jsx** ✅
- Load budget theo `currentMonth`
- Load `previousMonthItems` cho history
- Hiển thị tháng hiện tại trong header
- Render `<BudgetHistory />` ở cuối

### 4. **Locales (EN/VI/JA)** ✅
- Thêm key: `budgetHistoryTitle`

### 5. **seedBudgets.js** ✅
- Cập nhật `seedSampleBudgets()` để thêm theo tháng
- Thêm `seedPreviousMonthBudgets()` để test history

## 🎯 Cách Test

### 1. Test Budget Tháng Hiện Tại

```javascript
// Browser console
import('/src/utils/seedBudgets.js').then(m => m.seedSampleBudgets())
```

Kết quả:
- 6 budgets xuất hiện cho tháng hiện tại
- Có 1 category vượt ngân sách (Giải trí: 220/200)

### 2. Test Lịch Sử Tháng Trước

```javascript
// Browser console
import('/src/utils/seedBudgets.js').then(m => m.seedPreviousMonthBudgets())
```

Kết quả:
- Section "Lịch Sử Ngân Sách Tháng Trước" xuất hiện ở cuối trang
- Hiển thị 5 budgets của tháng trước
- Có 2 categories vượt ngân sách

### 3. Test Tự Động Reset

**Cách 1: Thay đổi ngày hệ thống** (không khuyến nghị)

**Cách 2: Thay đổi localStorage thủ công**:
```javascript
// 1. Xem dữ liệu hiện tại
console.log(JSON.parse(localStorage.getItem('budgets')))

// 2. Đổi month của tất cả budgets sang tháng trước
const budgets = JSON.parse(localStorage.getItem('budgets'))
budgets.forEach(b => b.month = '2025-09') // tháng trước
localStorage.setItem('budgets', JSON.stringify(budgets))

// 3. Reload trang
window.location.reload()
```

Kết quả:
- Trang Budget Planning hiện trống (tháng 10 chưa có budget)
- Section lịch sử hiển thị budget tháng 9

### 4. Xóa Tất Cả Dữ Liệu

```javascript
import('/src/utils/seedBudgets.js').then(m => m.clearAllBudgets())
```

## 📊 UI/UX

### Header
```
Budget Planning
Set monthly spending limits... - October 2025  ← Hiển thị tháng hiện tại
```

### Current Month Budgets
- Hiển thị cards như bình thường
- Empty state nếu chưa có budget

### History Section (Cuối trang)
```
📜 Previous Month Budget History - September 2025

┌─────────────────────────────────────┐
│ Total Budget: $1,520               │
│ Spent: $1,420                      │
│ Remaining: $100                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Category   │ Limit │ Spent │ Remaining │  %    │
├─────────────────────────────────────────────────┤
│ 🔴 Ăn uống │ $450  │ $480  │ -$30 (Over)│ 107% │
│ 🔵 Đi lại  │ $280  │ $250  │ $30        │ 89%  │
│ ...                                             │
└─────────────────────────────────────────────────┘
```

## 🔮 Tính Năng Nâng Cao (Tương Lai)

### 1. Multi-Month Selector
```jsx
<select value={selectedMonth} onChange={...}>
  <option value="2025-10">October 2025</option>
  <option value="2025-09">September 2025</option>
  <option value="2025-08">August 2025</option>
</select>
```

### 2. Copy Budget từ Tháng Trước
```jsx
<button onClick={copyFromPreviousMonth}>
  📋 Copy từ tháng trước
</button>
```

Tính năng: Tự động copy các categories và limits (không copy spent)

### 3. Budget Templates
```javascript
const templates = {
  student: [
    { category: 'Ăn uống', limit: 300 },
    { category: 'Học tập', limit: 200 },
  ],
  professional: [
    { category: 'Ăn uống', limit: 500 },
    { category: 'Đi lại', limit: 400 },
    { category: 'Tiết kiệm', limit: 1000 },
  ]
}
```

### 4. Monthly Budget Report
- Export PDF/Excel theo tháng
- Chart xu hướng qua các tháng
- So sánh tháng này vs tháng trước

### 5. Budget Alerts
- Email/notification khi sắp hết tháng mà chưa setup budget
- Reminder setup budget đầu tháng

## ✅ Checklist Hoàn Thành

- [x] Lưu budget theo tháng (field `month`)
- [x] Auto-load budget tháng hiện tại
- [x] Tự động reset khi sang tháng mới
- [x] Hiển thị lịch sử tháng trước
- [x] Summary stats cho history
- [x] Bảng chi tiết với progress %
- [x] i18n đầy đủ (EN/VI/JA)
- [x] Dark mode support
- [x] Responsive design
- [x] Seed tools cho testing

## 🎉 Kết Quả

**Budget Planning bây giờ hoạt động như một công cụ quản lý ngân sách thực sự:**
- ✅ Tự động reset mỗi tháng
- ✅ Lưu lịch sử để xem lại
- ✅ Không mất dữ liệu cũ
- ✅ UX tốt với empty states
- ✅ Ready cho tích hợp backend

---

📝 **Lưu ý**: Hiện tại dữ liệu lưu trong localStorage. Để sync giữa nhiều thiết bị, cần tích hợp backend (xem `BUDGET_INTEGRATION_GUIDE.md`).
