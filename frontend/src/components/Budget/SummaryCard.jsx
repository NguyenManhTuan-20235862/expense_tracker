import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

const Stat = ({ label, value, color }) => (
  <div className="flex-1 min-w-[180px] p-4 rounded-xl border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`mt-1 text-xl font-semibold ${color}`}>{value}</p>
  </div>
);

const SummaryCard = ({ totalBudget = 0, totalSpent = 0, remaining = 0 }) => {
  const { t } = useTranslation();
  const percentSpent = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;
  const isOverBudget = totalSpent > totalBudget;

  // Data for pie chart
  const chartData = [
    { name: t('budgetSpent'), value: totalSpent, color: isOverBudget ? '#ef4444' : '#f97316' },
    { name: t('budgetRemaining'), value: Math.max(0, remaining), color: '#10b981' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{payload[0].name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('budgetSummaryTitle')}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats Section */}
        <div className="space-y-3">
          <Stat label={t('budgetTotalBudget')} value={`$${totalBudget.toLocaleString()}`} color="text-purple-600 dark:text-purple-400" />
          <Stat label={t('budgetSpent')} value={`$${totalSpent.toLocaleString()}`} color={isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'} />
          <Stat label={t('budgetRemaining')} value={`$${Math.abs(remaining).toLocaleString()}${remaining < 0 ? ` (${t('budgetOver')})` : ''}`} color={remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} />
          
          {/* Progress indicator */}
          <div className="p-4 rounded-xl border border-gray-200/50 dark:border-gray-700 bg-white dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('budgetSpentPercentage')}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${isOverBudget ? 'bg-red-500' : 'bg-orange-500'}`} 
                  style={{ width: `${Math.min(percentSpent, 100)}%` }} 
                />
              </div>
              <span className={`text-sm font-bold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                {percentSpent}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex items-center justify-center">
          {totalBudget > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('budgetNoData')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
