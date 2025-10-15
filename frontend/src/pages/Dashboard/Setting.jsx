import React, { useState, useEffect, useContext, useCallback } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import TabNavigation from '../../components/Settings/TabNavigation'
import ProfileTab from '../../components/Settings/ProfileTab'
import SecurityTab from '../../components/Settings/SecurityTab'
import PreferencesTab from '../../components/Settings/PreferencesTab'
import { useTranslation } from 'react-i18next'

const Setting = () => {

  const { t } = useTranslation()

  const { updateUser, clearUser } = useContext(UserContext)
  const [activeTab, setActiveTab] = useState('profile')
  const [userInfo, setUserInfo] = useState({})

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO)
      if (response.data) {
        setUserInfo(response.data)
        updateUser(response.data)
      }
    } catch (err) {
      console.error(t('errorFetchUserInfo1'), err)
      toast.error(t('errorFetchUserInfo2'))
    }
  }, [updateUser])

  useEffect(() => {
    fetchUserInfo()
  }, [fetchUserInfo])

  const handleUserUpdate = (updatedUser) => {
    setUserInfo(updatedUser)
    updateUser(updatedUser)
  }

  const handleLogout = () => {
    clearUser()
  }
  return (
    <DashboardLayout activeMenu="Settings">
      <div className='my-5 mx-auto max-w-5xl'>
        <h1 className='text-2xl font-bold text-gray-800'>{t('titleSettings')}</h1>
        <p className='mt-2 text-sm text-gray-600'>{t('textSettings')}</p>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className='mt-6'>
          {activeTab === 'profile' && (
            <ProfileTab 
              userInfo={userInfo} 
              onUserUpdate={handleUserUpdate} 
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab onLogout={handleLogout} />
            )}

          {activeTab === 'preferences' && (
            <PreferencesTab />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Setting