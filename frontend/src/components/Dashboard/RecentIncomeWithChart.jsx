import React, {useEffect, useState} from 'react'
import CustomPieChart from '../Charts/CustomPieChart';
import { useTranslation } from 'react-i18next';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4F39F6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {

  const { t } = useTranslation();

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
      <h5 className="text-lg">{t('labelrecentincome')}</h5>
    </div>

    <CustomPieChart
      data={chartData}
      label={t('totalincome')}
      totalAmount={`$${totalIncome}`}
      showTextAnchor
      colors={COLORS}
    />
  </div>
);
} 

export default RecentIncomeWithChart