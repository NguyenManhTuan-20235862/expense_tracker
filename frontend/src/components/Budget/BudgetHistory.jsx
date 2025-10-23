import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatMonthDisplay } from '../../services/budgetService';
import { MdHistory } from 'react-icons/md';

const BudgetHistory = ({ budgets, monthString }) => {
  const { t, i18n } = useTranslation();

  if (!budgets || budgets.length === 0) {
    return null; // Don't show if no history
  }

  const totalBudget = budgets.reduce((s, b) => s + (Number(b.limit) || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + (Number(b.spent) || 0), 0);
  const monthDisplay = formatMonthDisplay(monthString, i18n.language);

  return (
    <div className="mt-8 card">
      <div className="flex items-center gap-2 mb-4">
        <MdHistory className="text-gray-600 dark:text-gray-400" size={24} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('budgetHistoryTitle')} - {monthDisplay}
        </h3>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <p className="text-xs text-purple-600 dark:text-purple-400">{t('budgetTotalBudget')}</p>
          <p className="text-lg font-bold text-purple-700 dark:text-purple-300">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <p className="text-xs text-orange-600 dark:text-orange-400">{t('budgetSpent')}</p>
          <p className="text-lg font-bold text-orange-700 dark:text-orange-300">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400">{t('budgetRemaining')}</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">${(totalBudget - totalSpent).toLocaleString()}</p>
        </div>
      </div>

      {/* Budget Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">{t('budgetCategory')}</th>
              <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">{t('budgetLimit')}</th>
              <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">{t('budgetSpent')}</th>
              <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">{t('budgetRemaining')}</th>
              <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget, idx) => {
              const remaining = budget.limit - budget.spent;
              const percent = budget.limit > 0 ? ((budget.spent / budget.limit) * 100).toFixed(1) : 0;
              const isOver = budget.spent > budget.limit;

              return (
                <tr key={budget.id || idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.color || '#875cf5' }} />
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{budget.category}</span>
                  </td>
                  <td className="text-right py-2 px-3 text-gray-700 dark:text-gray-300">${budget.limit.toLocaleString()}</td>
                  <td className={`text-right py-2 px-3 font-medium ${isOver ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    ${budget.spent.toLocaleString()}
                  </td>
                  <td className={`text-right py-2 px-3 font-medium ${remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    ${Math.abs(remaining).toLocaleString()}
                    {remaining < 0 && ` (${t('budgetOver')})`}
                  </td>
                  <td className={`text-right py-2 px-3 font-bold ${isOver ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {percent}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetHistory;
