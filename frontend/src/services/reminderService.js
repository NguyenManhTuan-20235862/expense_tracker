const STORAGE_KEY = 'reminders';

const uuid = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('reminderService: read error', e);
    return [];
  }
};

const write = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data || []));
  } catch (e) {
    console.warn('reminderService: write error', e);
  }
};

// Get all reminders
export const getReminders = () => {
  return read().sort((a, b) => {
    // Uncompleted first, then by date
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return 1;
    const dateA = new Date(`${a.date} ${a.time || '00:00'}`);
    const dateB = new Date(`${b.date} ${b.time || '00:00'}`);
    return dateA - dateB;
  });
};

// Get active reminders only
export const getActiveReminders = () => {
  return read().filter(r => !r.completed);
};

// Get completed reminders
export const getCompletedReminders = () => {
  return read().filter(r => r.completed);
};

// Get upcoming reminders (next 7 days)
export const getUpcomingReminders = () => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return read().filter(r => {
    if (r.completed) return false;
    const reminderDate = new Date(r.date);
    return reminderDate >= today && reminderDate <= nextWeek;
  });
};

// Add new reminder
export const addReminder = (item) => {
  const list = read();
  const newReminder = {
    id: uuid(),
    title: item.title?.trim() || 'Untitled Reminder',
    description: item.description?.trim() || '',
    date: item.date || new Date().toISOString().split('T')[0],
    time: item.time || '09:00',
    type: item.type || 'general', // 'payment' | 'bill' | 'shopping' | 'general'
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  list.push(newReminder);
  write(list);
  return newReminder;
};

// Update reminder
export const updateReminder = (id, patch) => {
  const list = read();
  let updated;
  const next = list.map((r) => {
    if (r.id !== id) return r;
    updated = {
      ...r,
      ...(patch.title !== undefined ? { title: String(patch.title) } : {}),
      ...(patch.description !== undefined ? { description: String(patch.description) } : {}),
      ...(patch.date !== undefined ? { date: patch.date } : {}),
      ...(patch.time !== undefined ? { time: patch.time } : {}),
      ...(patch.type !== undefined ? { type: patch.type } : {}),
      ...(patch.completed !== undefined ? { completed: patch.completed } : {}),
    };
    
    if (patch.completed && !r.completed) {
      updated.completedAt = new Date().toISOString();
    }
    
    return updated;
  });
  write(next);
  return updated;
};

// Delete reminder
export const deleteReminder = (id) => {
  const list = read();
  const next = list.filter((r) => r.id !== id);
  write(next);
};

// Mark reminder as completed
export const completeReminder = (id) => {
  return updateReminder(id, { 
    completed: true,
    completedAt: new Date().toISOString()
  });
};

// Check if reminder is overdue
export const isOverdue = (reminder) => {
  if (reminder.completed) return false;
  const now = new Date();
  const reminderDateTime = new Date(`${reminder.date} ${reminder.time || '00:00'}`);
  return reminderDateTime < now;
};

// Check if reminder is upcoming (within 24 hours)
export const isUpcoming = (reminder) => {
  if (reminder.completed) return false;
  const now = new Date();
  const reminderDateTime = new Date(`${reminder.date} ${reminder.time || '00:00'}`);
  const hoursDiff = (reminderDateTime - now) / (1000 * 60 * 60);
  return hoursDiff > 0 && hoursDiff <= 24;
};

// Get time until reminder
export const getTimeUntil = (reminder) => {
  const now = new Date();
  const reminderDateTime = new Date(`${reminder.date} ${reminder.time || '00:00'}`);
  const diff = reminderDateTime - now;
  
  if (diff < 0) return 'Overdue';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return 'Soon';
};

// Get statistics
export const getReminderStats = () => {
  const reminders = read();
  const active = reminders.filter(r => !r.completed);
  const completed = reminders.filter(r => r.completed);
  const overdue = active.filter(r => isOverdue(r));
  const upcoming = active.filter(r => isUpcoming(r));
  
  return {
    total: reminders.length,
    active: active.length,
    completed: completed.length,
    overdue: overdue.length,
    upcoming: upcoming.length
  };
};
