import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const AddBudgetModal = ({ open, initial, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [spent, setSpent] = useState('');
  const [color, setColor] = useState('#875cf5');

  useEffect(() => {
    if (!open) return;
    setCategory(initial?.category || '');
    setLimit(initial?.limit ?? '');
    setSpent(initial?.spent ?? '');
    setColor(initial?.color || '#875cf5');
  }, [open, initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!category.trim()) {
      toast.error(t('budgetErrorCategory'));
      return;
    }
    
    const limitNum = Number(limit);
    if (!limitNum || limitNum <= 0) {
      toast.error(t('budgetErrorLimit'));
      return;
    }

    const spentNum = Number(spent || 0);
    onSubmit?.({ category: category.trim(), limit: limitNum, spent: spentNum, color });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md card" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {initial ? t('budgetTitleEdit') : t('budgetTitleAdd')}
        </h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('budgetCategory')}
            </label>
            <input 
              className="input-box" 
              placeholder={t('budgetCategoryPlaceholder')} 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('budgetLimitPerMonth')}
            </label>
            <input 
              className="input-box" 
              placeholder={t('budgetLimitPlaceholder')} 
              type="number" 
              min="0" 
              step="0.01"
              value={limit} 
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('budgetSpentOptional')}
            </label>
            <input 
              className="input-box" 
              placeholder={t('budgetSpentPlaceholder')} 
              type="number" 
              min="0" 
              step="0.01"
              value={spent} 
              onChange={(e) => setSpent(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('budgetColor')}</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">{color}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="button" className="card-btn flex-1" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn-primary flex-1">{initial ? t('save') : t('budgetAdd')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;
