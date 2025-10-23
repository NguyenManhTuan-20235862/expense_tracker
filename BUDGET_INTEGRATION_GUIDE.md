# Budget Planning - Hướng Dẫn Tích Hợp với Expense

## 📝 Tổng Quan

Trang **Budget Planning** hiện đang lưu trữ dữ liệu bằng `localStorage`. Để tích hợp đầy đủ với hệ thống Expense, bạn cần:

1. **Tự động cập nhật `spent`** khi thêm/xóa expense
2. **Đồng bộ dữ liệu** giữa Budget và Expense
3. **Lưu budget vào backend** (tùy chọn)

---

## 🔧 Cách 1: Tích Hợp Frontend (localStorage)

### Bước 1: Cập nhật `budgetService.js`

Thêm hàm tự động tính toán `spent` từ danh sách expense:

```javascript
// src/services/budgetService.js

/**
 * Tính tổng chi tiêu theo category từ danh sách expense
 * @param {Array} expenses - Danh sách expense từ API
 * @returns {Object} { category: totalAmount }
 */
export const calculateSpentByCategory = (expenses) => {
  const result = {};
  expenses.forEach(exp => {
    const cat = exp.category?.trim() || 'Other';
    result[cat] = (result[cat] || 0) + (Number(exp.amount) || 0);
  });
  return result;
};

/**
 * Đồng bộ spent từ expenses vào budgets
 * @param {Array} expenses - Danh sách expense
 */
export const syncBudgetsWithExpenses = (expenses) => {
  const budgets = getBudgets();
  const spentByCategory = calculateSpentByCategory(expenses);
  
  const updated = budgets.map(budget => ({
    ...budget,
    spent: spentByCategory[budget.category] || 0
  }));
  
  write(updated);
  return updated;
};
```

### Bước 2: Gọi sync trong `BudgetPlanning.jsx`

```javascript
// src/pages/Dashboard/BudgetPlanning.jsx
import { getBudgets, addBudget, updateBudget, deleteBudget, syncBudgetsWithExpenses } from '../../services/budgetService'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

const Budget_Planning = () => {
  const [items, setItems] = useState([])
  const [expenses, setExpenses] = useState([])

  // Load budgets và expenses
  useEffect(() => {
    const loadData = async () => {
      try {
        // Lấy expenses từ API
        const expRes = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE)
        const expenseList = expRes.data || []
        setExpenses(expenseList)

        // Đồng bộ spent và lấy budgets
        const syncedBudgets = syncBudgetsWithExpenses(expenseList)
        setItems(syncedBudgets)
      } catch (error) {
        console.error('Load budget data error:', error)
        setItems(getBudgets())
      }
    }
    loadData()
  }, [])

  // ... rest of code
}
```

### Bước 3: Cập nhật khi thêm/xóa Expense

Trong `src/pages/Dashboard/Expense.jsx`:

```javascript
const handleAddExpense = async (data) => {
  try {
    await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, data)
    
    // Lấy lại expenses và sync budgets
    const updatedExpenses = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE)
    syncBudgetsWithExpenses(updatedExpenses.data)
    
    toast.success('Expense added successfully')
  } catch (error) {
    toast.error('Failed to add expense')
  }
}
```

---

## 🗄️ Cách 2: Lưu Budget vào Backend (Khuyến nghị)

### Bước 1: Tạo Model `Budget` trong backend

```javascript
// backend/models/Budget.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  limit: {
    type: Number,
    required: true,
    min: 0
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  color: {
    type: String,
    default: '#875cf5'
  },
  month: {
    type: String, // Format: YYYY-MM
    required: true
  }
}, { timestamps: true });

budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
```

### Bước 2: Tạo Controller

```javascript
// backend/controllers/budgetController.js
const Budget = require('../models/Budget');

// Get all budgets của user cho tháng hiện tại
exports.getBudgets = async (req, res) => {
  const { month } = req.query; // Format: YYYY-MM
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  
  try {
    const budgets = await Budget.find({ 
      userId: req.user.id,
      month: currentMonth 
    });
    res.status(200).json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách budget', error: err.message });
  }
};

// Add budget
exports.addBudget = async (req, res) => {
  const { category, limit, spent, color, month } = req.body;
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  
  try {
    const budget = await Budget.create({
      userId: req.user.id,
      category,
      limit,
      spent: spent || 0,
      color: color || '#875cf5',
      month: currentMonth
    });
    res.status(201).json(budget);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Budget cho category này đã tồn tại trong tháng này' });
    }
    res.status(500).json({ message: 'Lỗi thêm budget', error: err.message });
  }
};

// Update budget
exports.updateBudget = async (req, res) => {
  const { id } = req.params;
  const { category, limit, spent, color } = req.body;
  
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { category, limit, spent, color },
      { new: true, runValidators: true }
    );
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget không tồn tại' });
    }
    
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật budget', error: err.message });
  }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
  const { id } = req.params;
  
  try {
    const budget = await Budget.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget không tồn tại' });
    }
    res.status(200).json({ message: 'Xóa budget thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa budget', error: err.message });
  }
};

// Sync spent từ expenses
exports.syncBudgetSpent = async (req, res) => {
  const { month } = req.query;
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  
  try {
    const Expense = require('../models/Expense');
    
    // Lấy tất cả expenses trong tháng
    const startDate = new Date(currentMonth + '-01');
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    
    const expenses = await Expense.find({
      userId: req.user.id,
      date: { $gte: startDate, $lt: endDate }
    });
    
    // Tính tổng theo category
    const spentByCategory = {};
    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      spentByCategory[cat] = (spentByCategory[cat] || 0) + exp.amount;
    });
    
    // Cập nhật budgets
    const budgets = await Budget.find({ userId: req.user.id, month: currentMonth });
    for (const budget of budgets) {
      budget.spent = spentByCategory[budget.category] || 0;
      await budget.save();
    }
    
    res.status(200).json({ message: 'Đã đồng bộ budget spent', budgets });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đồng bộ budget', error: err.message });
  }
};
```

### Bước 3: Tạo Routes

```javascript
// backend/routes/budgetRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  syncBudgetSpent
} = require('../controllers/budgetController');

const router = express.Router();

router.get('/get', protect, getBudgets);
router.post('/add', protect, addBudget);
router.put('/:id', protect, updateBudget);
router.delete('/:id', protect, deleteBudget);
router.post('/sync', protect, syncBudgetSpent);

module.exports = router;
```

### Bước 4: Đăng ký routes trong `server.js`

```javascript
// backend/server.js
const budgetRoutes = require('./routes/budgetRoutes');

app.use('/api/v1/budget', budgetRoutes);
```

### Bước 5: Cập nhật Frontend để dùng API

```javascript
// src/utils/apiPaths.js
export const API_PATHS = {
  // ... existing paths
  BUDGET: {
    GET_BUDGETS: '/api/v1/budget/get',
    ADD_BUDGET: '/api/v1/budget/add',
    UPDATE_BUDGET: (id) => `/api/v1/budget/${id}`,
    DELETE_BUDGET: (id) => `/api/v1/budget/${id}`,
    SYNC_SPENT: '/api/v1/budget/sync'
  }
};
```

```javascript
// src/pages/Dashboard/BudgetPlanning.jsx
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

const Budget_Planning = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.BUDGET.GET_BUDGETS)
      setItems(res.data)
    } catch (error) {
      toast.error('Failed to load budgets')
    }
  }

  const handleSubmit = async (data) => {
    try {
      if (editingId) {
        await axiosInstance.put(API_PATHS.BUDGET.UPDATE_BUDGET(editingId), data)
        toast.success(t('budgetUpdateSuccess'))
      } else {
        await axiosInstance.post(API_PATHS.BUDGET.ADD_BUDGET, data)
        toast.success(t('budgetAddSuccess'))
      }
      loadBudgets()
      setOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save budget')
    }
  }

  const handleDelete = async (id) => {
    const item = items.find(i => i._id === id)
    if (window.confirm(t('budgetConfirmDelete', { category: item?.category || '' }))) {
      try {
        await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(id))
        toast.success(t('budgetDeleteSuccess'))
        loadBudgets()
      } catch (error) {
        toast.error('Failed to delete budget')
      }
    }
  }

  // Sync spent when component mounts
  useEffect(() => {
    const syncSpent = async () => {
      try {
        await axiosInstance.post(API_PATHS.BUDGET.SYNC_SPENT)
        loadBudgets()
      } catch (error) {
        console.error('Sync spent error:', error)
      }
    }
    syncSpent()
  }, [])

  // ... rest of code
}
```

---

## 🎯 Tính Năng Nâng Cao

### 1. Tự động sync khi thêm/xóa expense

Trong `expenseController.js`:

```javascript
exports.addExpense = async (req, res) => {
  // ... existing code to add expense
  
  // Sau khi thêm expense thành công, sync budget
  const Budget = require('../models/Budget');
  const currentMonth = new Date(expense.date).toISOString().slice(0, 7);
  
  await Budget.findOneAndUpdate(
    { userId: req.user.id, category: expense.category, month: currentMonth },
    { $inc: { spent: expense.amount } },
    { upsert: false }
  );
  
  res.status(201).json(expense);
};

exports.deleteExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
  
  if (expense) {
    const currentMonth = new Date(expense.date).toISOString().slice(0, 7);
    
    await Budget.findOneAndUpdate(
      { userId: req.user.id, category: expense.category, month: currentMonth },
      { $inc: { spent: -expense.amount } },
      { upsert: false }
    );
    
    await expense.deleteOne();
  }
  
  res.status(200).json({ message: 'Expense deleted' });
};
```

### 2. Cảnh báo real-time

Trong `BudgetPlanning.jsx`, thêm WebSocket hoặc polling:

```javascript
// Polling every 30s to check for budget updates
useEffect(() => {
  const interval = setInterval(loadBudgets, 30000);
  return () => clearInterval(interval);
}, []);
```

### 3. Thống kê theo tháng

Thêm dropdown chọn tháng:

```jsx
const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

useEffect(() => {
  loadBudgets(selectedMonth)
}, [selectedMonth])

<select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
  {/* Generate months */}
</select>
```

---

## ✅ Checklist Tích Hợp

- [ ] Đồng bộ `spent` từ expenses (Cách 1 hoặc 2)
- [ ] Tạo backend API cho Budget (Khuyến nghị)
- [ ] Tự động cập nhật budget khi thêm/xóa expense
- [ ] Hiển thị cảnh báo khi vượt ngân sách (✅ Đã có)
- [ ] Biểu đồ phần trăm chi tiêu (✅ Đã có)
- [ ] i18n đầy đủ (✅ Đã có)
- [ ] Dark mode support (✅ Đã có)
- [ ] Responsive design (✅ Đã có)

---

## 📚 Tài Liệu Tham Khảo

- [Mongoose Middleware](https://mongoosejs.com/docs/middleware.html)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)
- [Recharts Documentation](https://recharts.org/)
