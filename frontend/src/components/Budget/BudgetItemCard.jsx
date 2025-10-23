import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';

const clampPercent = (p) => Math.max(0, Math.min(100, p));

const BudgetItemCard = ({ item, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { id, category, limit, spent, color = '#875cf5' } = item;
  const percent = limit > 0 ? clampPercent((spent / limit) * 100) : 0;
  const isOverBudget = spent > limit;
  const progressColor = isOverBudget ? 'bg-red-500' : 'bg-[color:var(--bar-color)]';
  const remaining = limit - spent;

  return (
    <div className={`card relative ${isOverBudget ? 'border-2 border-red-400 dark:border-red-600' : ''}`}>
      {/* Warning Badge */}
      {isOverBudget && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
          <MdWarning size={14} />
          {t('budgetOverLimit')}
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{category}</h4>
          <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <p>{t('budgetLimit')}: <span className="font-medium text-gray-800 dark:text-gray-200">${limit.toLocaleString()}</span></p>
            <p>{t('budgetSpent')}: <span className={`font-medium ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>${spent.toLocaleString()}</span></p>
            <p>{t('budgetRemaining')}: 
              <span className={`font-medium ${remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                ${Math.abs(remaining).toLocaleString()} {remaining < 0 && `(${t('budgetOver')})`}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="card-btn" onClick={() => onEdit?.(id)}>{t('buttonEditBudget')}</button>
          <button className="card-btn" onClick={() => onDelete?.(id)}>{t('buttonDeleteBudget')}</button>
        </div>
      </div>

      {/* Progress Bar with Percentage Chart */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('budgetProgress')}</span>
          <span className={`text-xs font-bold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
            {percent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner" style={{ ['--bar-color']: color }}>
          <div 
            className={`h-full transition-all duration-300 ${progressColor}`} 
            style={{ width: `${Math.min(percent, 100)}%` }} 
          />
        </div>
        {isOverBudget && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
            <MdWarning size={12} />
            {t('budgetExceededBy')} ${(spent - limit).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetItemCard;
