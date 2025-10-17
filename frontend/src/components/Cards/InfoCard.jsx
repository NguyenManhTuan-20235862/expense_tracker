import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
  return <div className='flex gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md shadow-gray-100 dark:shadow-none border border-gray-200/50 dark:border-gray-700 transition-colors duration-300'>
    <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        {icon}
    </div>
    <div>
        <h6 className='text-sm text-gray-500 dark:text-gray-400 mb-1'>{label}</h6>
        <span className='text-[22px] text-gray-900 dark:text-gray-100'>${value}</span>
    </div>
  </div>
}

export default InfoCard