const STORAGE_KEY = 'budgets';
const ACTIVE_MONTH_KEY = 'budgetActiveMonth'; // Tháng đang lập kế hoạch

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && !Number.isNaN(n) ? n : 0;
};

// Get system current month in YYYY-MM format
const getSystemCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Get active month (tháng người dùng đang lập kế hoạch)
const getActiveMonth = () => {
  try {
    const saved = localStorage.getItem(ACTIVE_MONTH_KEY);
    return saved || getSystemCurrentMonth();
  } catch {
    return getSystemCurrentMonth();
  }
};

// Set active month
const setActiveMonth = (month) => {
  try {
    localStorage.setItem(ACTIVE_MONTH_KEY, month);
  } catch (e) {
    console.warn('budgetService: setActiveMonth error', e);
  }
};

// Get next month from active month
const getNextMonth = (fromMonth = getActiveMonth()) => {
  const [year, month] = fromMonth.split('-').map(Number);
  const nextDate = new Date(year, month, 1); // month is already 0-indexed after +1
  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
};

// Get previous month from active month
const getPreviousMonth = (fromMonth = getActiveMonth()) => {
  const [year, month] = fromMonth.split('-').map(Number);
  const prevDate = new Date(year, month - 2, 1);
  return `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
};

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('budgetService: read error', e);
    return [];
  }
};

const write = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data || []));
  } catch (e) {
    console.warn('budgetService: write error', e);
  }
};

const uuid = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

// Get budgets for a specific month (default: active month)
export const getBudgets = (month = getActiveMonth()) => {
  const allBudgets = read();
  return allBudgets.filter(b => b.month === month);
};

// Get all budgets (for migration or admin purposes)
export const getAllBudgets = () => read();

// Get active month (tháng người dùng đang lập kế hoạch)
export const getActiveMonthString = () => getActiveMonth();

// Get system current month
export const getSystemMonthString = () => getSystemCurrentMonth();

export const addBudget = (item, month = getActiveMonth()) => {
  const list = read();
  const withId = {
    id: uuid(),
    category: item.category?.trim() || 'Untitled',
    limit: safeNumber(item.limit),
    spent: safeNumber(item.spent ?? 0),
    color: item.color || '#875cf5',
    month: month,
    createdAt: new Date().toISOString(),
  };
  list.push(withId);
  write(list);
  return withId;
};

export const updateBudget = (id, patch) => {
  const list = read();
  let updated;
  const next = list.map((b) => {
    if (b.id !== id) return b;
    updated = {
      ...b,
      ...(patch.category !== undefined ? { category: String(patch.category) } : {}),
      ...(patch.limit !== undefined ? { limit: safeNumber(patch.limit) } : {}),
      ...(patch.spent !== undefined ? { spent: safeNumber(patch.spent) } : {}),
      ...(patch.color !== undefined ? { color: patch.color } : {}),
    };
    return updated;
  });
  write(next);
  return updated;
};

export const deleteBudget = (id) => {
  const list = read();
  const next = list.filter((b) => b.id !== id);
  write(next);
};

export const getSummary = (items) => {
  const totalBudget = items.reduce((s, i) => s + safeNumber(i.limit), 0);
  const totalSpent = items.reduce((s, i) => s + safeNumber(i.spent), 0);
  const remaining = totalBudget - totalSpent;
  return { totalBudget, totalSpent, remaining };
};

// Get budgets for previous month (for history display)
export const getPreviousMonthBudgets = () => {
  return getBudgets(getPreviousMonth());
};

// Get previous month string
export const getPreviousMonthString = () => getPreviousMonth();

// Format month string to display (e.g., "2025-10" -> "October 2025")
export const formatMonthDisplay = (monthStr, locale = 'en') => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
};

/**
 * Bắt đầu tháng mới - Chuyển tất cả budgets hiện tại sang archive
 * @returns {string} New active month
 */
export const startNewMonth = () => {
  const currentActive = getActiveMonth();
  const nextMonth = getNextMonth(currentActive);
  
  // Set new active month
  setActiveMonth(nextMonth);
  
  return nextMonth;
};

/**
 * Check if there are any budgets in active month
 */
export const hasActiveBudgets = () => {
  const active = getBudgets(getActiveMonth());
  return active.length > 0;
};
