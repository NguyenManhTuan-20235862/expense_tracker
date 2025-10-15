import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { LuSave } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'
import { locales } from '../../i18n/i18n'

const PreferencesTab = () => {
  const { t, i18n } = useTranslation()
  
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language)

  const handleLanguageChange = (e) => {
    const newLang = e.target.value
    setSelectedLanguage(newLang)
    i18n.changeLanguage(newLang)
    toast.success(t('textSettingsSaved'))
  }

  const handleSavePreferences = () => {
    // Save to localStorage for now
    localStorage.setItem('appPreferences', JSON.stringify({
      notifications,
      emailNotifications,
    }))
    toast.success(t('textSettingsSaved'))
  }


  return (
    <div className='card max-w-2xl'>
      <h2 className='text-lg font-semibold text-gray-800 mb-4'>{t('titleAppSettings')}</h2>

      <div className='space-y-4'>
        <div className='flex items-center justify-between py-3 border-b border-gray-100'>
          <div>
            <h3 className='text-sm font-medium text-gray-800'>{t('labelPushNotifications')}</h3>
            <p className='text-xs text-gray-600 mt-1'>
              {t('textPushNotifications')}
            </p>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className='flex items-center justify-between py-3 border-b border-gray-100'>
          <div>
            <h3 className='text-sm font-medium text-gray-800'>{t('labelEmailNotifications')}</h3>
            <p className='text-xs text-gray-600 mt-1'>
              {t('textEmailNotifications')}
            </p>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className='flex items-center justify-between py-3'>
          <div>
            <h3 className='text-sm font-medium text-gray-800'>{t('labelLanguage')}</h3>
            <p className='text-xs text-gray-600 mt-1'>
              {t('textLanguage')}
            </p>
          </div>
          <select 
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className='px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
          >
            {Object.entries(locales).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSavePreferences}
        className='btn-primary flex items-center justify-center gap-2 mt-6'
      >
        <LuSave size={18} />
        {t('buttonSave')}
      </button>
    </div>
  )
}

export default PreferencesTab
