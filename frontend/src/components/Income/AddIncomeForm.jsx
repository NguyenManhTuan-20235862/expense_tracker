import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });
  return (
    <div>
        <EmojiPickerPopup
          icon={income.icon}
          onSelect={(selectIcon) => handleChange("icon", selectIcon)}
        />
      <Input
        value={income.source}
        onChange={({ target }) => handleChange("source", target.value)}
        label="収入源"
        placeholder="自由, 給与, その他..."
        type="text"
      />

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="金額"
        placeholder=""
        type="number"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="日付"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button type="button" className="add-btn add-btn-fill" onClick={() => onAddIncome(income)}>
          収入を追加
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
