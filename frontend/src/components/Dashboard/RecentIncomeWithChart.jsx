import React, {useEffect, useState} from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4F39F6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {

    const [chartData, setChartData] = useState([]);

  const prepareChartData = () => {
  const dataArr = data?.map((item) => ({
    name: item?.source,
    amount: item?.amount,
  }));

  setChartData(dataArr);
  };

  useEffect(() => {
  prepareChartData();

  return () => {};
  }, [data]);

  return (
  <div className="card">
    <div className="flex items-center justify-between ">
      <h5 className="text-lg">最近60日間の収入</h5>
    </div>

    <CustomPieChart
      data={chartData}
      label="総収入"
      totalAmount={`$${totalIncome}`}
      showTextAnchor
      colors={COLORS}
    />
  </div>
);
} 

export default RecentIncomeWithChart