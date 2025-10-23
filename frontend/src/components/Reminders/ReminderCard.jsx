import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MdEdit, MdDelete, MdCheckCircle, MdAccessTime, MdWarning,
  MdPayment, MdReceipt, MdShoppingCart, MdInfo
} from 'react-icons/md';
import { isOverdue, isUpcoming, getTimeUntil } from '../../services/reminderService';

const ReminderCard = ({ reminder, onEdit, onDelete, onComplete }) => {
  const { t } = useTranslation();
  const overdue = isOverdue(reminder);
  const upcoming = isUpcoming(reminder);
  const timeUntil = getTimeUntil(reminder);
  const isCompleted = reminder.completed;

  const typeIcons = {
    payment: { icon: MdPayment, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    bill: { icon: MdReceipt, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    shopping: { icon: MdShoppingCart, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    general: { icon: MdInfo, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800' },
  };

  const typeConfig = typeIcons[reminder.type] || typeIcons.general;
  const TypeIcon = typeConfig.icon;

  return (
    <div className={`card ${isCompleted ? 'opacity-60' : ''} ${overdue && !isCompleted ? 'border-l-4 border-red-500' : ''} ${upcoming && !isCompleted ? 'border-l-4 border-yellow-500' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-lg ${typeConfig.bg}`}>
          <TypeIcon size={24} className={typeConfig.color} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Actions */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className={`text-base font-semibold ${isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {reminder.title}
              </h3>
              {reminder.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {reminder.description}
                </p>
              )}
            </div>

            {!isCompleted && (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onEdit(reminder.id)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  title={t('buttonEditBudget')}
                >
                  <MdEdit size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => onDelete(reminder.id)}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                  title={t('buttonDeleteBudget')}
                >
                  <MdDelete size={16} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            )}
          </div>

          {/* DateTime & Status */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <MdAccessTime size={16} className="text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {new Date(reminder.date).toLocaleDateString()} {reminder.time}
              </span>
            </div>

            {!isCompleted && (
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                overdue 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                  : upcoming 
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              }`}>
                {overdue && <MdWarning size={14} />}
                {overdue ? t('goalOverdue') : timeUntil}
              </div>
            )}

            {isCompleted && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                <MdCheckCircle size={14} />
                {t('reminderCompleted')}
              </div>
            )}
          </div>

          {/* Complete Button */}
          {!isCompleted && (
            <button
              onClick={() => onComplete(reminder.id)}
              className="mt-3 w-full py-2 border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 rounded-lg transition font-medium text-sm"
            >
              {t('reminderMarkComplete')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
