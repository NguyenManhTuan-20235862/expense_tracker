import React, { useEffect, useState } from 'react';

const AddBudgetModal = ({ open, initial, onClose, onSubmit }) => {
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
    onSubmit?.({ category, limit: Number(limit), spent: Number(spent || 0), color });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-md card">
        <h3 className="text-lg font-semibold">{initial ? 'Edit Budget' : 'Add Budget'}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input className="input-box" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input className="input-box" placeholder="Limit" type="number" min="0" value={limit} onChange={(e) => setLimit(e.target.value)} />
          <input className="input-box" placeholder="Spent (optional)" type="number" min="0" value={spent} onChange={(e) => setSpent(e.target.value)} />
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-300">Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="button" className="card-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{initial ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;
