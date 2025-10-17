import React from 'react';
import SummaryCard from './SummaryCard';

const calc = (items) => {
  const totalBudget = items.reduce((s, i) => s + (Number(i.limit) || 0), 0);
  const totalSpent = items.reduce((s, i) => s + (Number(i.spent) || 0), 0);
  return { totalBudget, totalSpent, remaining: totalBudget - totalSpent };
};

const BudgetSummary = ({ items = [] }) => {
  const { totalBudget, totalSpent, remaining } = calc(items);
  return <SummaryCard totalBudget={totalBudget} totalSpent={totalSpent} remaining={remaining} />;
};

export default BudgetSummary;
