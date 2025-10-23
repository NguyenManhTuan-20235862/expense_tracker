// Utility to seed sample budget data for testing
// Run this in browser console: 
// import('/src/utils/seedBudgets.js').then(m => m.seedSampleBudgets())
// import('/src/utils/seedBudgets.js').then(m => m.seedPreviousMonthBudgets())

import { addBudget, getActiveMonthString, getPreviousMonthString } from '../services/budgetService';

// Seed budgets for active month (tháng đang lập kế hoạch)
export const seedSampleBudgets = () => {
  const currentMonth = getActiveMonthString();
  const sampleBudgets = [
    { category: 'Ăn uống', limit: 500, spent: 420, color: '#ef4444' },
    { category: 'Đi lại', limit: 300, spent: 180, color: '#3b82f6' },
    { category: 'Giải trí', limit: 200, spent: 220, color: '#8b5cf6' },
    { category: 'Mua sắm', limit: 400, spent: 150, color: '#ec4899' },
    { category: 'Sức khỏe', limit: 250, spent: 100, color: '#10b981' },
    { category: 'Học tập', limit: 350, spent: 300, color: '#f59e0b' },
  ];

  sampleBudgets.forEach(budget => {
    try {
      addBudget(budget, currentMonth);
      console.log(`✅ Added budget for ${currentMonth}: ${budget.category}`);
    } catch (error) {
      console.error(`❌ Failed to add budget: ${budget.category}`, error);
    }
  });

  console.log('🎉 Sample budgets seeded successfully for current month!');
  window.location.reload();
};

// Seed budgets for previous month (for testing history)
export const seedPreviousMonthBudgets = () => {
  const previousMonth = getPreviousMonthString();
  const sampleBudgets = [
    { category: 'Ăn uống', limit: 450, spent: 480, color: '#ef4444' },
    { category: 'Đi lại', limit: 280, spent: 250, color: '#3b82f6' },
    { category: 'Giải trí', limit: 180, spent: 190, color: '#8b5cf6' },
    { category: 'Mua sắm', limit: 380, spent: 320, color: '#ec4899' },
    { category: 'Sức khỏe', limit: 230, spent: 180, color: '#10b981' },
  ];

  sampleBudgets.forEach(budget => {
    try {
      addBudget(budget, previousMonth);
      console.log(`✅ Added budget for ${previousMonth}: ${budget.category}`);
    } catch (error) {
      console.error(`❌ Failed to add budget: ${budget.category}`, error);
    }
  });

  console.log('🎉 Sample budgets seeded successfully for previous month!');
  window.location.reload();
};

// Clear all budgets (for testing)
export const clearAllBudgets = () => {
  localStorage.removeItem('budgets');
  console.log('🧹 All budgets cleared!');
  window.location.reload();
};
