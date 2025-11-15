import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatMonthDisplay } from '../../services/budgetService';
import { MdHistory, MdExpandMore, MdExpandLess } from 'react-icons/md';

const BudgetHistoryMultiple = ({ monthsData }) => {
  const { t, i18n } = useTranslation();
  const [expandedMonths, setExpandedMonths] = React.useState({});

  if (!monthsData || monthsData.length === 0) {
    return null; // Don't show if no history
  }

  const toggleMonth = (month) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MdHistory className="text-gray-600 dark:text-gray-400" size={24} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('budgetHistoryTitle')}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({monthsData.length} {monthsData.length === 1 ? 'month' : 'months'})
        </span>
      </div>

      <div className="space-y-4">
        {monthsData.map((item) => {
          const { month, budgets } = item;
          const isExpanded = expandedMonths[month] !== false; // Default expanded
          const monthDisplay = formatMonthDisplay(month, i18n.language);

          const totalBudget = budgets.reduce((s, b) => s + (Number(b.limit) || 0), 0);
          const totalSpent = budgets.reduce((s, b) => s + (Number(b.spent) || 0), 0);
          const totalRemaining = totalBudget - totalSpent;
          const overBudgetCount = budgets.filter(b => b.spent > b.limit).length;

          return (
            <div key={month} className="card">
              {/* Header - Collapsible */}
              <button
                onClick={() => toggleMonth(month)}
                className="w-full flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {monthDisplay}
                  </span>
                  {overBudgetCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                      {overBudgetCount} over budget
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
                    <p className={`text-sm font-bold ${totalSpent > totalBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      ${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}
                    </p>
                  </div>
                  {isExpanded ? (
                    <MdExpandLess size={24} className="text-gray-600 dark:text-gray-400" />
                  ) : (
                    <MdExpandMore size={24} className="text-gray-600 dark:text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                      <p className={`text-lg font-bold ${totalRemaining < 0 ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                        ${Math.abs(totalRemaining).toLocaleString()}
                        {totalRemaining < 0 && ` (${t('budgetOver')})`}
                      </p>
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetHistoryMultiple;
