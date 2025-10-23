import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";
import { useTranslation } from "react-i18next";
import { getBudgets, updateBudget } from "../../services/budgetService";
import { getGoals, updateGoal } from "../../services/goalService";

const Expense = () => {
  const {t} = useTranslation();
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  // Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log(t('error'), error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error(t('errorCategory'));
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error(t('texterrormoney'));
      return;
    }

    if (!date) {
      toast.error(t('texterrorDate'));
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success(t('textSuccessExpense'));
      
      // Tự động cập nhật budget nếu có category trùng tên
      updateBudgetSpent(category, Number(amount));
      
      // Tự động cập nhật goal nếu có title trùng tên
      updateGoalProgress(category, Number(amount));
      
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        t('textErrorExpense'),
        error.response?.data?.message || error.message
      );
    }
  };

  // Cập nhật spent của budget khi thêm expense
  const updateBudgetSpent = (expenseCategory, expenseAmount) => {
    try {
      // Lấy tất cả budgets của tháng hiện tại
      const currentBudgets = getBudgets();
      
      // Tìm budget có category trùng với expense (so sánh không phân biệt hoa thường)
      const matchedBudget = currentBudgets.find(
        (budget) => budget.category.toLowerCase().trim() === expenseCategory.toLowerCase().trim()
      );

      if (matchedBudget) {
        // Cộng thêm số tiền expense vào spent
        const newSpent = matchedBudget.spent + expenseAmount;
        updateBudget(matchedBudget.id, { spent: newSpent });
        
        // Thông báo nếu vượt budget
        if (newSpent > matchedBudget.limit) {
          toast.error(
            `⚠️ ${expenseCategory}: ${t('budgetOverBudget')} ($${newSpent.toFixed(2)} / $${matchedBudget.limit.toFixed(2)})`,
            { duration: 5000 }
          );
        } else {
          toast.success(
            `✅ ${t('budgetUpdated')}: ${expenseCategory} ($${newSpent.toFixed(2)} / $${matchedBudget.limit.toFixed(2)})`
          );
        }
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  // Cập nhật currentAmount của goal khi thêm expense
  const updateGoalProgress = (expenseCategory, expenseAmount) => {
    try {
      // Lấy tất cả goals đang active
      const currentGoals = getGoals().filter(g => g.status === 'active');
      
      // Tìm goal có title trùng với expense category (so sánh không phân biệt hoa thường)
      const matchedGoal = currentGoals.find(
        (goal) => goal.title.toLowerCase().trim() === expenseCategory.toLowerCase().trim()
      );

      if (matchedGoal) {
        // Cộng thêm số tiền expense vào currentAmount
        const newCurrent = matchedGoal.currentAmount + expenseAmount;
        updateGoal(matchedGoal.id, { currentAmount: newCurrent });
        
        const progress = Math.min((newCurrent / matchedGoal.targetAmount) * 100, 100);
        
        // Thông báo tiến độ goal
        if (progress >= 100) {
          toast.success(
            `🎉 ${t('goalAchieved')}: ${expenseCategory} ($${newCurrent.toFixed(2)} / $${matchedGoal.targetAmount.toFixed(2)})`,
            { duration: 5000 }
          );
        } else {
          toast.success(
            `📊 ${t('goalProgressUpdated')}: ${expenseCategory} - ${progress.toFixed(1)}% ($${newCurrent.toFixed(2)} / $${matchedGoal.targetAmount.toFixed(2)})`
          );
        }
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      // Tìm expense để lấy thông tin trước khi xóa
      const expenseToDelete = expenseData.find(exp => exp._id === id);
      
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success(t('textSuccessDeleteExpense'));
      
      // Trừ số tiền ra khỏi budget nếu có
      if (expenseToDelete) {
        subtractFromBudget(expenseToDelete.category, Number(expenseToDelete.amount));
        // Trừ số tiền ra khỏi goal nếu có
        subtractFromGoal(expenseToDelete.category, Number(expenseToDelete.amount));
      }
      
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        t('textErrorDeleteExpense'),
        error.response?.data?.message || error.message
      );
    }
  };

  // Trừ spent của budget khi xóa expense
  const subtractFromBudget = (expenseCategory, expenseAmount) => {
    try {
      const currentBudgets = getBudgets();
      
      const matchedBudget = currentBudgets.find(
        (budget) => budget.category.toLowerCase().trim() === expenseCategory.toLowerCase().trim()
      );

      if (matchedBudget) {
        // Trừ số tiền expense khỏi spent (không cho phép âm)
        const newSpent = Math.max(0, matchedBudget.spent - expenseAmount);
        updateBudget(matchedBudget.id, { spent: newSpent });
        
        toast.success(
          `✅ ${t('budgetUpdated')}: ${expenseCategory} ($${newSpent.toFixed(2)} / $${matchedBudget.limit.toFixed(2)})`
        );
      }
    } catch (error) {
      console.error('Error updating budget on delete:', error);
    }
  };

  // Trừ currentAmount của goal khi xóa expense
  const subtractFromGoal = (expenseCategory, expenseAmount) => {
    try {
      const currentGoals = getGoals().filter(g => g.status === 'active');
      
      const matchedGoal = currentGoals.find(
        (goal) => goal.title.toLowerCase().trim() === expenseCategory.toLowerCase().trim()
      );

      if (matchedGoal) {
        // Trừ số tiền expense khỏi currentAmount (không cho phép âm)
        const newCurrent = Math.max(0, matchedGoal.currentAmount - expenseAmount);
        updateGoal(matchedGoal.id, { currentAmount: newCurrent });
        
        const progress = (newCurrent / matchedGoal.targetAmount) * 100;
        
        toast.success(
          `📊 ${t('goalProgressUpdated')}: ${expenseCategory} - ${progress.toFixed(1)}% ($${newCurrent.toFixed(2)} / $${matchedGoal.targetAmount.toFixed(2)})`
        );
      }
    } catch (error) {
      console.error('Error updating goal on delete:', error);
    }
  };

  // handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(t('textErrorDownloadExpense'), error);
      toast.error(t('textErrorExpenseDl'));
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title={t('titleAddExpenses')}
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title={t('buttonDeleteDetail')}
        >
          <DeleteAlert
            content={t('textDeleteDetail')}
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
