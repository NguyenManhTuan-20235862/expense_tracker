import React from 'react'
import { LuUser, LuLock, LuBell } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'

const TabNavigation = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation()
  
  const tabs = [
    { id: 'profile', label: t('titleProfile'), icon: LuUser },
    { id: 'security', label: t('titleSecurity'), icon: LuLock },
    { id: 'preferences', label: t('titlePreferences'), icon: LuBell },
  ]

  return (
    <div className='flex gap-2 mt-6 border-b border-gray-200'>
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default TabNavigation
