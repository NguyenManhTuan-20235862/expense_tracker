import React, { useState, useEffect } from "react";
import { prepareExpenseLineChartData } from "../../utils/helper";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">支出概観</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            支出の傾向を時間ごとに追跡して、お金がどこへ行っているのかをよく理解しましょう。
          </p>
        </div>

        <button className="add-btn" onClick={onExpenseIncome}>
          <LuPlus className="text-lg" />
          支出を追加
        </button>
      </div>

      <div className="mt-10">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
