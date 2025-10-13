import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ['#875CF5','#FA2C37','#FF6900'];

const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {
    const balanceData = [
        { name: '残高総額', amount: totalBalance},
        { name: '総収入', amount: totalExpense},
        { name: '総支出', amount: totalIncome},
    ];
  return <div className='card'>
    <div className='flex items-center justify-between'>
        <h5 className='text-lg'>財政概観</h5>
    </div>

    <CustomPieChart
        data={balanceData}
        label="総残高"
        totalAmount={`$${totalBalance}`}
        colors={COLORS}
        showTextAnchor
    />
  </div>
}

export default FinanceOverview