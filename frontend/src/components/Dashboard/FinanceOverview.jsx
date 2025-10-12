import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ['#875CF5','#FA2C37','#FF6900'];

const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {
    const balanceData = [
        { name: 'Tổng số dư', amount: totalBalance},
        { name: 'Tổng Chi tiêu', amount: totalExpense},
        { name: 'Tổng Thu nhập', amount: totalIncome},
    ];
  return <div className='card'>
    <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Tổng quan Tài chính</h5>
    </div>

    <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`$${totalBalance}`}
        colors={COLORS}
        showTextAnchor
    />
  </div>
}

export default FinanceOverview