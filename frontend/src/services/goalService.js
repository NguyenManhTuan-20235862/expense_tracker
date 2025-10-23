const STORAGE_KEY = 'goals';

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && !Number.isNaN(n) ? n : 0;
};

const uuid = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('goalService: read error', e);
    return [];
  }
};

const write = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data || []));
  } catch (e) {
    console.warn('goalService: write error', e);
  }
};

// Get all goals
export const getGoals = () => {
  return read().sort((a, b) => {
    // Active goals first, then by deadline
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return new Date(a.deadline) - new Date(b.deadline);
  });
};

// Get active goals only
export const getActiveGoals = () => {
  return read().filter(g => g.status === 'active');
};

// Get completed goals
export const getCompletedGoals = () => {
  return read().filter(g => g.status === 'completed');
};

// Add new goal
export const addGoal = (item) => {
  const list = read();
  const newGoal = {
    id: uuid(),
    title: item.title?.trim() || 'Untitled Goal',
    targetAmount: safeNumber(item.targetAmount),
    currentAmount: safeNumber(item.currentAmount ?? 0),
    deadline: item.deadline || new Date().toISOString().split('T')[0],
    description: item.description?.trim() || '',
    status: 'active', // 'active' | 'completed' | 'cancelled'
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  list.push(newGoal);
  write(list);
  return newGoal;
};

// Update goal
export const updateGoal = (id, patch) => {
  const list = read();
  let updated;
  const next = list.map((g) => {
    if (g.id !== id) return g;
    updated = {
      ...g,
      ...(patch.title !== undefined ? { title: String(patch.title) } : {}),
      ...(patch.targetAmount !== undefined ? { targetAmount: safeNumber(patch.targetAmount) } : {}),
      ...(patch.currentAmount !== undefined ? { currentAmount: safeNumber(patch.currentAmount) } : {}),
      ...(patch.deadline !== undefined ? { deadline: patch.deadline } : {}),
      ...(patch.description !== undefined ? { description: String(patch.description) } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
    };
    
    // Auto-complete if current >= target
    if (updated.currentAmount >= updated.targetAmount && updated.status === 'active') {
      updated.status = 'completed';
      updated.completedAt = new Date().toISOString();
    }
    
    return updated;
  });
  write(next);
  return updated;
};

// Delete goal
export const deleteGoal = (id) => {
  const list = read();
  const next = list.filter((g) => g.id !== id);
  write(next);
};

// Mark goal as completed
export const completeGoal = (id) => {
  return updateGoal(id, { 
    status: 'completed',
    completedAt: new Date().toISOString()
  });
};

// Cancel goal
export const cancelGoal = (id) => {
  return updateGoal(id, { status: 'cancelled' });
};

// Calculate progress percentage
export const getProgress = (goal) => {
  if (!goal.targetAmount) return 0;
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  return Math.min(Math.round(percentage), 100);
};

// Check if goal is overdue
export const isOverdue = (goal) => {
  if (goal.status !== 'active') return false;
  return new Date(goal.deadline) < new Date();
};

// Get days remaining
export const getDaysRemaining = (goal) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(goal.deadline);
  deadline.setHours(0, 0, 0, 0);
  const diff = deadline - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Get statistics
export const getGoalStats = () => {
  const goals = read();
  const active = goals.filter(g => g.status === 'active');
  const completed = goals.filter(g => g.status === 'completed');
  const overdue = active.filter(g => isOverdue(g));
  
  const totalTarget = active.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = active.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  
  return {
    total: goals.length,
    active: active.length,
    completed: completed.length,
    overdue: overdue.length,
    totalTarget,
    totalCurrent,
    overallProgress: Math.round(overallProgress)
  };
};
