import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import GoalCard from '../../components/Goals/GoalCard';
import ReminderCard from '../../components/Reminders/ReminderCard';
import AddGoalModal from '../../components/Goals/AddGoalModal';
import AddReminderModal from '../../components/Reminders/AddReminderModal';
import { 
  addGoal, updateGoal, deleteGoal, completeGoal,
  getGoalStats, getActiveGoals, getCompletedGoals 
} from '../../services/goalService';
import { 
  addReminder, updateReminder, deleteReminder, completeReminder,
  getReminderStats, getActiveReminders, getCompletedReminders 
} from '../../services/reminderService';
import toast from 'react-hot-toast';
import { MdAdd, MdTrendingUp, MdNotifications, MdCheckCircle, MdWarning } from 'react-icons/md';

const RemindersGoals = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('goals'); // 'goals' | 'reminders'
  const [showCompleted, setShowCompleted] = useState(false);

  // Goals state
  const [goals, setGoals] = useState([]);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Reminders state
  const [reminders, setReminders] = useState([]);
  const [openReminderModal, setOpenReminderModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  // Load data
  const loadGoals = useCallback(() => {
    const data = showCompleted ? getCompletedGoals() : getActiveGoals();
    setGoals(data);
  }, [showCompleted]);

  const loadReminders = useCallback(() => {
    const data = showCompleted ? getCompletedReminders() : getActiveReminders();
    setReminders(data);
  }, [showCompleted]);

  useEffect(() => {
    loadGoals();
    loadReminders();
  }, [showCompleted, loadGoals, loadReminders]);

  // Goals handlers
  const handleAddGoal = () => {
    setEditingGoal(null);
    setOpenGoalModal(true);
  };

  const handleEditGoal = (id) => {
    const goal = goals.find(g => g.id === id);
    setEditingGoal(goal);
    setOpenGoalModal(true);
  };

  const handleDeleteGoal = (id) => {
    const goal = goals.find(g => g.id === id);
    if (window.confirm(t('goalConfirmDelete', { title: goal?.title || '' }))) {
      deleteGoal(id);
      loadGoals();
      toast.success(t('goalDeleteSuccess'));
    }
  };

  const handleCompleteGoal = (id) => {
    completeGoal(id);
    loadGoals();
    toast.success(t('goalCompleteSuccess'), { icon: '🎉', duration: 3000 });
  };

  const handleSubmitGoal = (data) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data);
      toast.success(t('goalUpdateSuccess'));
    } else {
      addGoal(data);
      toast.success(t('goalAddSuccess'));
    }
    loadGoals();
    setOpenGoalModal(false);
  };

  // Reminders handlers
  const handleAddReminder = () => {
    setEditingReminder(null);
    setOpenReminderModal(true);
  };

  const handleEditReminder = (id) => {
    const reminder = reminders.find(r => r.id === id);
    setEditingReminder(reminder);
    setOpenReminderModal(true);
  };

  const handleDeleteReminder = (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (window.confirm(t('reminderConfirmDelete', { title: reminder?.title || '' }))) {
      deleteReminder(id);
      loadReminders();
      toast.success(t('reminderDeleteSuccess'));
    }
  };

  const handleCompleteReminder = (id) => {
    completeReminder(id);
    loadReminders();
    toast.success(t('reminderCompleteSuccess'));
  };

  const handleSubmitReminder = (data) => {
    if (editingReminder) {
      updateReminder(editingReminder.id, data);
      toast.success(t('reminderUpdateSuccess'));
    } else {
      addReminder(data);
      toast.success(t('reminderAddSuccess'));
    }
    loadReminders();
    setOpenReminderModal(false);
  };

  // Stats
  const goalStats = getGoalStats();
  const reminderStats = getReminderStats();

  return (
    <DashboardLayout activeMenu="Reminders/Goals">
      <div className="my-5 mx-auto max-w-7xl text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('remindersGoalsTitle')}</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('remindersGoalsDesc')}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Active Goals */}
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t('goalActiveCount')}</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{goalStats.active}</p>
              </div>
              <MdTrendingUp size={32} className="text-blue-500 dark:text-blue-400" />
            </div>
          </div>

          {/* Completed Goals */}
          <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t('goalCompletedCount')}</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">{goalStats.completed}</p>
              </div>
              <MdCheckCircle size={32} className="text-green-500 dark:text-green-400" />
            </div>
          </div>

          {/* Active Reminders */}
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{t('reminderActiveCount')}</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">{reminderStats.active}</p>
              </div>
              <MdNotifications size={32} className="text-purple-500 dark:text-purple-400" />
            </div>
          </div>

          {/* Overdue/Upcoming */}
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">{t('reminderOverdueCount')}</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-1">{reminderStats.overdue}</p>
              </div>
              <MdWarning size={32} className="text-orange-500 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 space-y-4">
          {/* Tab buttons and Add button */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-6 py-2.5 rounded-lg font-medium transition ${
                  activeTab === 'goals'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t('tabGoals')} ({goalStats.active})
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`px-6 py-2.5 rounded-lg font-medium transition ${
                  activeTab === 'reminders'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t('tabReminders')} ({reminderStats.active})
              </button>
            </div>

            <div>
              {activeTab === 'goals' && (
                <button
                  onClick={handleAddGoal}
                  className="btn-primary flex items-center gap-2"
                >
                  <MdAdd size={20} />
                  {t('goalAddButton')}
                </button>
              )}
              
              {activeTab === 'reminders' && (
                <button
                  onClick={handleAddReminder}
                  className="btn-primary flex items-center gap-2"
                >
                  <MdAdd size={20} />
                  {t('reminderAddButton')}
                </button>
              )}
            </div>
          </div>

          {/* Show Completed/Active toggle button */}
          <div className="flex">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                showCompleted
                  ? 'bg-gray-700 dark:bg-gray-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {showCompleted ? t('showActive') : t('showCompleted')}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onComplete={handleCompleteGoal}
              />
            ))}
            {goals.length === 0 && (
              <div className="col-span-full card text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">{t('goalEmptyState')}</p>
                <button onClick={handleAddGoal} className="mt-4 btn-primary">
                  {t('goalAddButton')}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onEdit={handleEditReminder}
                onDelete={handleDeleteReminder}
                onComplete={handleCompleteReminder}
              />
            ))}
            {reminders.length === 0 && (
              <div className="col-span-full card text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">{t('reminderEmptyState')}</p>
                <button onClick={handleAddReminder} className="mt-4 btn-primary">
                  {t('reminderAddButton')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <AddGoalModal
          open={openGoalModal}
          initial={editingGoal}
          onClose={() => setOpenGoalModal(false)}
          onSubmit={handleSubmitGoal}
        />

        <AddReminderModal
          open={openReminderModal}
          initial={editingReminder}
          onClose={() => setOpenReminderModal(false)}
          onSubmit={handleSubmitReminder}
        />
      </div>
    </DashboardLayout>
  );
};

export default RemindersGoals;