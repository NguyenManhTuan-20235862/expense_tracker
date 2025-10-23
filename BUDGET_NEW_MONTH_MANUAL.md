# 🎯 Budget Planning - Tự Quản Lý Tháng

## ✨ Tính Năng Mới: **"Bắt Đầu Tháng Mới"**

Bạn **không cần chờ** đến đầu tháng theo lịch! Tự quyết định khi nào kết thúc tháng hiện tại và bắt đầu lập kế hoạch cho tháng mới.

---

## 🎮 Cách Sử Dụng

### 1️⃣ Nút "Bắt Đầu Tháng Mới"

**Vị trí**: Góc trên bên phải trang Budget Planning, bên cạnh nút "Add Budget"

**Giao diện**:
```
┌─────────────────────────────────────────────┐
│  Budget Planning                            │
│  ... - October 2025                         │
│                                             │
│  [🔜 Bắt Đầu Tháng Mới]  [+ Add Budget]    │
└─────────────────────────────────────────────┘
```

### 2️⃣ Luồng Hoạt Động

**Bước 1: Click nút "Bắt Đầu Tháng Mới"**

**Bước 2: Confirm Dialog**
```
Bạn có chắc muốn bắt đầu tháng mới?
Các ngân sách hiện tại sẽ được chuyển vào lịch sử.

[Cancel]  [OK]
```

**Bước 3: Kết Quả**
- ✅ Tất cả budgets tháng hiện tại → Chuyển sang "Lịch Sử"
- ✅ Trang reset về trống
- ✅ Tháng tự động tăng (Oct → Nov)
- ✅ Toast thông báo: "Đã bắt đầu tháng mới: November 2025"

---

## 🔧 Cách Hoạt Động Kỹ Thuật

### **Active Month Concept**

Thay vì dựa vào ngày hiện tại của hệ thống, app giờ sử dụng **"Active Month"** (Tháng Đang Lập Kế Hoạch):

```javascript
// Lưu trong localStorage
localStorage.setItem('budgetActiveMonth', '2025-10')

// Khi click "Bắt Đầu Tháng Mới"
'2025-10' → '2025-11'
```

### **API Service**

**budgetService.js**:

```javascript
// 1. Lấy tháng đang lập kế hoạch (không phải tháng hệ thống)
getActiveMonthString() // → "2025-10" (do người dùng quyết định)

// 2. Lấy tháng hệ thống (chỉ để tham khảo)
getSystemMonthString() // → "2025-10" (ngày thật)

// 3. Bắt đầu tháng mới
startNewMonth()
// → Active month: 2025-10 → 2025-11
// → Budgets cũ vẫn lưu với month='2025-10'

// 4. Check có budget chưa
hasActiveBudgets() // true/false
```

### **Data Flow**

**Trước khi click "Bắt Đầu Tháng Mới"**:
```javascript
localStorage: {
  budgetActiveMonth: "2025-10",
  budgets: [
    { id: 1, category: "Ăn uống", month: "2025-10", ... },
    { id: 2, category: "Đi lại", month: "2025-10", ... }
  ]
}

// Trang hiển thị
- Active Month: October 2025
- Budgets: 2 items (Ăn uống, Đi lại)
- History: empty
```

**Sau khi click "Bắt Đầu Tháng Mới"**:
```javascript
localStorage: {
  budgetActiveMonth: "2025-11",  ← THAY ĐỔI
  budgets: [
    { id: 1, category: "Ăn uống", month: "2025-10", ... },  ← Giữ nguyên
    { id: 2, category: "Đi lại", month: "2025-10", ... }    ← Giữ nguyên
  ]
}

// Trang hiển thị
- Active Month: November 2025  ← THAY ĐỔI
- Budgets: 0 items (trống)     ← RESET
- History: 2 items (tháng 10)  ← HIỂN THỊ
```

---

## 🎯 Use Cases

### Use Case 1: Lập Kế Hoạch Linh Hoạt

**Tình huống**: Bạn muốn lập ngân sách cho tháng 11 ngay từ ngày 25/10

**Giải pháp**:
1. Ngày 25/10: Click "Bắt Đầu Tháng Mới"
2. Tháng 10 → Chuyển vào lịch sử
3. Bắt đầu lập kế hoạch tháng 11 ngay

### Use Case 2: Test & Demo

**Tình huống**: Muốn test tính năng mà không đợi tháng sau

**Giải pháp**:
```javascript
// Console
import('/src/utils/seedBudgets.js').then(m => {
  m.seedSampleBudgets()      // Tạo budget tháng active
})

// Click "Bắt Đầu Tháng Mới" → Chuyển sang tháng kế tiếp
// Click lại → Tháng tiếp nữa
// Có thể test nhiều tháng liên tiếp
```

### Use Case 3: Quản Lý Theo Chu Kỳ Lương

**Tình huống**: Nhận lương ngày 5 hàng tháng, muốn reset budget theo ngày lương

**Giải pháp**:
- Ngày 5: Click "Bắt Đầu Tháng Mới"
- Tháng ngân sách của bạn: 5/10 → 5/11 (không theo lịch 1/10 → 1/11)

---

## 🧪 Testing

### Test 1: Bắt Đầu Tháng Mới với Dữ Liệu

```javascript
// 1. Tạo budgets cho tháng hiện tại
import('/src/utils/seedBudgets.js').then(m => m.seedSampleBudgets())
// → Có 6 budgets tháng 10

// 2. Click "Bắt Đầu Tháng Mới"
// → Confirm OK
// → Toast: "Đã bắt đầu tháng mới: November 2025"
// → Trang trống (tháng 11)
// → Lịch sử: 6 budgets tháng 10

// 3. Thêm budgets mới cho tháng 11
// → Budgets mới có month='2025-11'

// 4. Click "Bắt Đầu Tháng Mới" lần nữa
// → Tháng 11 → 12
// → Lịch sử: budgets tháng 11
```

### Test 2: Bắt Đầu Tháng Mới khi Trống

```javascript
// 1. Xóa hết budgets
import('/src/utils/seedBudgets.js').then(m => m.clearAllBudgets())

// 2. Click "Bắt Đầu Tháng Mới"
// → Không có confirm (vì chưa có budget)
// → Tháng tăng lên ngay
```

### Test 3: Kiểm Tra localStorage

```javascript
// Xem active month
console.log(localStorage.getItem('budgetActiveMonth'))
// → "2025-10"

// Xem tất cả budgets
console.log(JSON.parse(localStorage.getItem('budgets')))
// → [...{ month: '2025-10' }, { month: '2025-11' }...]

// Reset active month về system month
localStorage.removeItem('budgetActiveMonth')
window.location.reload()
```

---

## 🎨 UI/UX Details

### Button Style
```jsx
<button 
  className='btn-primary bg-gradient-to-r from-purple-600 to-blue-600'
  title='Finish current month and start planning for next month'
>
  <MdNavigateNext /> Bắt Đầu Tháng Mới
</button>
```

- **Icon**: `MdNavigateNext` (mũi tên phải)
- **Color**: Gradient purple-blue
- **Tooltip**: "Finish current month..."
- **Position**: Trước nút "Add Budget"

### Confirm Dialog

**Nội dung**:
- EN: "Are you sure you want to start a new month? Current budgets will be moved to history."
- VI: "Bạn có chắc muốn bắt đầu tháng mới? Các ngân sách hiện tại sẽ được chuyển vào lịch sử."
- JA: "新しい月を始めてもよろしいですか？現在の予算は履歴に移動されます。"

**Logic**: Chỉ hiện khi có budgets (`hasActiveBudgets()`)

### Success Toast

**Nội dung**: "Đã bắt đầu tháng mới: {{month}}"
- `{{month}}`: "November 2025" (theo i18n locale)

---

## 🔮 Tính Năng Nâng Cao (Tương Lai)

### 1. Undo "Start New Month"
```jsx
<button onClick={undoLastMonthStart}>
  ↩️ Quay lại tháng trước
</button>
```

### 2. Month Picker
```jsx
<select value={activeMonth} onChange={setActiveMonth}>
  <option value="2025-10">October 2025</option>
  <option value="2025-11">November 2025</option>
</select>
```

### 3. Auto Reminder
```javascript
// Hiện notification khi gần cuối tháng
if (dayOfMonth >= 25 && !hasPlannedNextMonth()) {
  toast.info('Bạn chưa lập kế hoạch cho tháng sau')
}
```

### 4. Copy from Last Month
```jsx
<button onClick={copyFromPreviousMonth}>
  📋 Copy từ tháng trước
</button>
// Auto-copy categories & limits (không copy spent)
```

---

## ✅ Benefits

| Before | After |
|--------|-------|
| ❌ Phải chờ đến đầu tháng mới | ✅ Tự quyết định khi nào reset |
| ❌ Không kiểm soát được | ✅ Linh hoạt theo nhu cầu |
| ❌ Khó test tính năng | ✅ Test được ngay lập tức |
| ❌ Theo lịch cứng nhắc | ✅ Theo chu kỳ cá nhân (lương, chi tiêu) |

---

## 📝 Summary

**Với nút "Bắt Đầu Tháng Mới"**:
- ✅ Tự quyết định khi kết thúc tháng hiện tại
- ✅ Không mất dữ liệu cũ (chuyển vào lịch sử)
- ✅ Linh hoạt lập kế hoạch theo nhu cầu
- ✅ Dễ test và demo
- ✅ i18n đầy đủ (EN/VI/JA)
- ✅ UX tốt với confirm + toast
- ✅ Dark mode support

🎉 **Budget Planning bây giờ hoàn toàn linh hoạt, do BẠN kiểm soát!**
