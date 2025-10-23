import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdEdit, MdDelete, MdCheckCircle, MdCalendarToday, MdTrendingUp } from 'react-icons/md';
import { getProgress, getDaysRemaining, isOverdue } from '../../services/goalService';

const GoalCard = ({ goal, onEdit, onDelete, onComplete }) => {
  const { t } = useTranslation();
  const progress = getProgress(goal);
  const daysLeft = getDaysRemaining(goal);
  const overdue = isOverdue(goal);
  const isCompleted = goal.status === 'completed';
  
  const remaining = goal.targetAmount - goal.currentAmount;
  const isAchieved = progress >= 100;

  return (
    <div className={`card ${isCompleted ? 'opacity-75' : ''} ${isAchieved && !isCompleted ? 'border-2 border-green-500' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            {goal.title}
            {isCompleted && <MdCheckCircle className="text-green-500" size={20} />}
          </h3>
          {goal.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
          )}
        </div>
        
        {!isCompleted && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(goal.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              title={t('buttonEditBudget')}
            >
              <MdEdit size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              title={t('buttonDeleteBudget')}
            >
              <MdDelete size={18} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        )}
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('goalTarget')}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ${goal.targetAmount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('goalCurrent')}</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ${goal.currentAmount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('goalRemaining')}</p>
          <p className={`text-lg font-bold ${remaining > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
            ${Math.abs(remaining).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('budgetProgress')}
          </span>
          <span className={`text-sm font-bold ${isAchieved ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              isAchieved 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : progress >= 80 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <MdCalendarToday size={16} className="text-gray-500" />
          <span className={`${overdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
            {overdue ? t('goalOverdue') : `${daysLeft} ${t('goalDaysLeft')}`}
          </span>
        </div>

        {isAchieved && !isCompleted && (
          <button
            onClick={() => onComplete(goal.id)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition text-sm font-medium"
          >
            <MdCheckCircle size={18} />
            {t('goalMarkComplete')}
          </button>
        )}

        {!isAchieved && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <MdTrendingUp size={14} />
            <span>{t('goalInProgress')}</span>
          </div>
        )}
      </div>

      {/* Celebration for completed */}
      {isCompleted && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400 text-center">
            🎉 {t('goalCongratulations')}
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
