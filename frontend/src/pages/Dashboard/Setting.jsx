import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'

const Setting = () => {
  return (
    <DashboardLayout activeMenu ="Settings">
      <div className='my-5 mx-auto'>
        <h1 className='text-2xl font-bold'>設定</h1>
        <p className='mt-3'>ここでアプリの設定を管理できます。</p>
      </div>
    </DashboardLayout>
  )
}

export default Setting