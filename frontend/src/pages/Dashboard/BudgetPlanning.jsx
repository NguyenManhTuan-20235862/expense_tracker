import React, { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import BudgetSummary from '../../components/Budget/BudgetSummary'
import BudgetItemCard from '../../components/Budget/BudgetItemCard'
import AddBudgetModal from '../../components/Budget/AddBudgetModal'
import { getBudgets, addBudget, updateBudget, deleteBudget } from '../../services/budgetService'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { MdWarning } from 'react-icons/md'

const Budget_Planning = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    setItems(getBudgets())
  }, [])

  // Check for over-budget items and show warnings
  useEffect(() => {
    const overBudgetItems = items.filter(item => item.spent > item.limit)
    if (overBudgetItems.length > 0) {
      overBudgetItems.forEach(item => {
        toast.error(
          `${t('budgetWarning')}: ${item.category} - ${t('budgetExceededBy')} $${(item.spent - item.limit).toLocaleString()}`,
          { duration: 5000, icon: <MdWarning className="text-red-500" size={20} /> }
        )
      })
    }
  }, [items, t])

  const editingItem = useMemo(() => items.find(i => i.id === editingId), [items, editingId])

  const handleAdd = () => {
    setEditingId(null)
    setOpen(true)
  }

  const handleEdit = (id) => {
    setEditingId(id)
    setOpen(true)
  }

  const handleDelete = (id) => {
    const item = items.find(i => i.id === id)
    if (window.confirm(t('budgetConfirmDelete', { category: item?.category || '' }))) {
      deleteBudget(id)
      setItems(getBudgets())
      toast.success(t('budgetDeleteSuccess'))
    }
  }

  const handleSubmit = (data) => {
    if (editingId) {
      updateBudget(editingId, data)
      toast.success(t('budgetUpdateSuccess'))
    } else {
      addBudget(data)
      toast.success(t('budgetAddSuccess'))
    }
    setItems(getBudgets())
    setOpen(false)
  }

  // Statistics
  const overBudgetCount = items.filter(item => item.spent > item.limit).length

  return (
    <DashboardLayout activeMenu="Budget Planning">
        <div className='my-5 mx-auto max-w-6xl text-gray-900 dark:text-gray-100'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div>
                <h1 className='text-3xl font-bold'>{t('budgetPlanningTitle')}</h1>
                <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{t('budgetPlanningDesc')}</p>
                {overBudgetCount > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
                    <MdWarning size={16} />
                    <span>{t('budgetWarningCount', { count: overBudgetCount })}</span>
                  </div>
                )}
              </div>
              <button className='add-btn' onClick={handleAdd}>+ {t('budgetAddButton')}</button>
            </div>

            <div className='mt-6'>
              <BudgetSummary items={items} />
            </div>

            <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {items.map((item) => (
                <BudgetItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
              {items.length === 0 && (
                <div className='card col-span-full text-center py-12'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{t('budgetEmptyState')}</p>
                  <button className='mt-4 btn-primary' onClick={handleAdd}>{t('budgetAddButton')}</button>
                </div>
              )}
            </div>

            <AddBudgetModal
              open={open}
              initial={editingItem}
              onClose={() => setOpen(false)}
              onSubmit={handleSubmit}
            />
        </div>
    </DashboardLayout>
  )
}

export default Budget_Planning