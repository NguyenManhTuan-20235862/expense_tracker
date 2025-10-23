import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../Modal';

const AddGoalModal = ({ open, initial, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    description: '',
  });

  useEffect(() => {
    if (initial) {
      setFormData({
        title: initial.title || '',
        targetAmount: initial.targetAmount || '',
        currentAmount: initial.currentAmount || '0',
        deadline: initial.deadline || '',
        description: initial.description || '',
      });
    } else {
      // Set default deadline to 30 days from now
      const defaultDeadline = new Date();
      defaultDeadline.setDate(defaultDeadline.getDate() + 30);
      setFormData({
        title: '',
        targetAmount: '',
        currentAmount: '0',
        deadline: defaultDeadline.toISOString().split('T')[0],
        description: '',
      });
    }
  }, [initial, open]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert(t('goalErrorTitle'));
      return;
    }
    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      alert(t('goalErrorTarget'));
      return;
    }
    if (!formData.deadline) {
      alert(t('goalErrorDeadline'));
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const progressPercentage = formData.targetAmount > 0 
    ? Math.round((Number(formData.currentAmount) / Number(formData.targetAmount)) * 100)
    : 0;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={initial ? t('goalTitleEdit') : t('goalTitleAdd')}
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('goalTitle')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={t('goalTitlePlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('goalTargetAmount')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.targetAmount}
            onChange={(e) => handleChange('targetAmount', e.target.value)}
            placeholder={t('goalTargetPlaceholder')}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Current Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('goalCurrentAmount')}
          </label>
          <input
            type="number"
            value={formData.currentAmount}
            onChange={(e) => handleChange('currentAmount', e.target.value)}
            placeholder={t('goalCurrentPlaceholder')}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
          {formData.targetAmount > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('budgetProgress')}: {progressPercentage}%
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('goalDeadline')} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => handleChange('deadline', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('goalDescription')}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={t('goalDescriptionPlaceholder')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium"
          >
            {initial ? t('save') : t('goalAdd')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddGoalModal;
