import React, { useState } from 'react'
import Input from '../Inputs/Input'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import { LuLock, LuLogOut } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SecurityTab = ({ onLogout }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t('errorAllFields'))
      return
    }

    if (newPassword.length < 8) {
      toast.error(t('errorPasswordLength'))
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('errorPasswordMismatch'))
      return
    }

    setLoading(true)

    try {
      await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      })

      toast.success(t('successPasswordChange'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error(t('errorPasswordChange'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    onLogout()
    toast.success(t('textLogout1'))
    navigate('/login')
  }

  return (
    <div className='card max-w-2xl'>
      <h2 className='text-lg font-semibold text-gray-800 mb-4'>{t('titleChangePassword')}</h2>
      <form onSubmit={handlePasswordChange}>
        <Input
          value={currentPassword}
          onChange={({ target }) => setCurrentPassword(target.value)}
          label={t('labelCurrentPassword')}
          placeholder={t('placeholderCurrentPassword')}
          type='password'
        />

        <Input
          value={newPassword}
          onChange={({ target }) => setNewPassword(target.value)}
          label={t('labelNewPassword')}
          placeholder={t('placeholderNewPassword')}
          type='password'
        />

        <Input
          value={confirmPassword}
          onChange={({ target }) => setConfirmPassword(target.value)}
          label={t('labelConfirmPassword')}
          placeholder={t('placeholderConfirmPassword')}
          type='password'
        />

        <button
          type='submit'
          disabled={loading}
          className='btn-primary flex items-center justify-center gap-2 mt-2'
        >
          <LuLock size={18} />
          {loading ? t('textSaving') : t('buttonChangePassword')}
        </button>
      </form>

      <div className='mt-8 pt-6 border-t border-gray-200'>
        <h3 className='text-base font-semibold text-gray-800 mb-2'>{t('titleAccountManagement')}</h3>
        <p className='text-sm text-gray-600 mb-4'>
          {t('textLogout2')}
        </p>
        <button
          onClick={handleLogout}
          className='flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-200 transition-colors'
        >
          <LuLogOut size={18} />
          {t('buttonLogout')}
        </button>
      </div>
    </div>
  )
}

export default SecurityTab
