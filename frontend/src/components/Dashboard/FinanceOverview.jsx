import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart';
import { useTranslation } from 'react-i18next';

const COLORS = ['#875CF5','#FA2C37','#FF6900'];

const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {
    const {t} = useTranslation();

    const balanceData = [
        { name: t('totalbalance'), amount: totalBalance},
        { name: t('totalexpense'), amount: totalExpense},
        { name: t('totalincome'), amount: totalIncome},
    ];
  return <div className='card'>
    <div className='flex items-center justify-between'>
        <h5 className='text-lg'>{t('labelfinanceoverview')}</h5>
    </div>

    <CustomPieChart
        data={balanceData}
        label={t('totalbalance')}
        totalAmount={`$${totalBalance}`}
        colors={COLORS}
        showTextAnchor
    />
  </div>
}

export default FinanceOverview