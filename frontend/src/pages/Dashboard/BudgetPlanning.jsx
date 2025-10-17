import React, { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import BudgetSummary from '../../components/Budget/BudgetSummary'
import BudgetItemCard from '../../components/Budget/BudgetItemCard'
import AddBudgetModal from '../../components/Budget/AddBudgetModal'
import { getBudgets, addBudget, updateBudget, deleteBudget } from '../../services/budgetService'

const Budget_Planning = () => {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    setItems(getBudgets())
  }, [])

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
    deleteBudget(id)
    setItems(getBudgets())
  }

  const handleSubmit = (data) => {
    if (editingId) {
      updateBudget(editingId, data)
    } else {
      addBudget(data)
    }
    setItems(getBudgets())
    setOpen(false)
  }

  return (
    <DashboardLayout activeMenu="Budget Planning">
        <div className='my-5 mx-auto max-w-5xl text-gray-900 dark:text-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold'>Budget Planning</h1>
                <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>Plan and track your budgets by category.</p>
              </div>
              <button className='add-btn' onClick={handleAdd}>+ Add Budget</button>
            </div>

            <div className='mt-6'>
              <BudgetSummary items={items} />
            </div>

            <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
              {items.map((item) => (
                <BudgetItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
              {items.length === 0 && (
                <div className='card'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>No budgets yet. Click "Add Budget" to create one.</p>
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