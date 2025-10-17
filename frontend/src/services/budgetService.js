const STORAGE_KEY = 'budgets';

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && !Number.isNaN(n) ? n : 0;
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

export const getBudgets = () => read();

export const addBudget = (item) => {
  const list = read();
  const withId = {
    id: uuid(),
    category: item.category?.trim() || 'Untitled',
    limit: safeNumber(item.limit),
    spent: safeNumber(item.spent ?? 0),
    color: item.color || '#875cf5',
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

export const getSummary = (items = read()) => {
  const totalBudget = items.reduce((s, i) => s + safeNumber(i.limit), 0);
  const totalSpent = items.reduce((s, i) => s + safeNumber(i.spent), 0);
  const remaining = totalBudget - totalSpent;
  return { totalBudget, totalSpent, remaining };
};
