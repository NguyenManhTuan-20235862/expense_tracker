import React from 'react';

const clampPercent = (p) => Math.max(0, Math.min(100, p));

const BudgetItemCard = ({ item, onEdit, onDelete }) => {
  const { id, category, limit, spent, color = '#875cf5' } = item;
  const percent = limit > 0 ? clampPercent((spent / limit) * 100) : 0;
  const progressColor = percent >= 100 ? 'bg-red-500' : 'bg-[color:var(--bar-color)]';

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">{category}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Limit: ${limit} · Spent: ${spent}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="card-btn" onClick={() => onEdit?.(id)}>Edit</button>
          <button className="card-btn" onClick={() => onDelete?.(id)}>Delete</button>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden" style={{ ['--bar-color']: color }}>
          <div className={`h-full ${progressColor}`} style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">{percent.toFixed(0)}%</div>
      </div>
    </div>
  );
};

export default BudgetItemCard;
