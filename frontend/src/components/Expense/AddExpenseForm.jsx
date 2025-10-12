import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense }) => {
  const [income, setIncome] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });
  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={income.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Danh mục"
        placeholder="Tiền thuê nhà, thực phẩm, ..."
        type="text"
      />

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Số tiền"
        placeholder=""
        type="number"
      />
      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Thời gian"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddExpense(income)}
        >
          Thêm Chi Tiêu
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
