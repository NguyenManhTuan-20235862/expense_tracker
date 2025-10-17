import React from 'react';

const Stat = ({ label, value, color }) => (
  <div className="flex-1 min-w-[180px] p-4 rounded-xl border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`mt-1 text-xl font-semibold ${color}`}>{value}</p>
  </div>
);

const SummaryCard = ({ totalBudget = 0, totalSpent = 0, remaining = 0 }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Budget Summary</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat label="Total Budget" value={`$${totalBudget}`} color="text-purple-600" />
        <Stat label="Spent" value={`$${totalSpent}`} color="text-orange-500" />
        <Stat label="Remaining" value={`$${remaining}`} color={remaining >= 0 ? 'text-green-600' : 'text-red-600'} />
      </div>
    </div>
  );
};

export default SummaryCard;
