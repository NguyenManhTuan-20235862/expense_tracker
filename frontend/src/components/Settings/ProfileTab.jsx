import React, { useState, useEffect } from 'react'
import Input from '../Inputs/Input'
import ProfilePhotoSelector from '../Inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import uploadImage from '../../utils/uploadImage'
import { validateEmail } from '../../utils/helper'
import toast from 'react-hot-toast'
import { LuSave } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'

const ProfileTab = ({ userInfo, onUserUpdate }) => {
  const { t } = useTranslation()
  
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState(userInfo.fullName || '')
  const [email, setEmail] = useState(userInfo.email || '')
  const [currentProfileUrl, setCurrentProfileUrl] = useState(userInfo.profileImageUrl || '')
  const [loading, setLoading] = useState(false)

  // Keep local state in sync when userInfo prop changes (e.g., after async fetch)
  // Only update if the values actually changed to avoid resetting user edits
  useEffect(() => {
    if (!userInfo) return
    
    // Only update if userInfo values are different from current state
    if (userInfo.fullName !== fullName) {
      setFullName(userInfo.fullName || '')
    }
    if (userInfo.email !== email) {
      setEmail(userInfo.email || '')
    }
    if (userInfo.profileImageUrl !== currentProfileUrl) {
      setCurrentProfileUrl(userInfo.profileImageUrl || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.fullName, userInfo.email, userInfo.profileImageUrl])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (!fullName) {
      toast.error(t('errorName'))
      return
    }

    if (!validateEmail(email)) {
      toast.error(t('errorEmail'))
      return
    }

    setLoading(true)

    try {
      let profileImageUrl = currentProfileUrl

      // Upload new image if changed
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic)
        profileImageUrl = imgUploadRes.imageUrl || currentProfileUrl
      }

      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, {
        fullName,
        email,
        profileImageUrl,
      })

      if (response.data) {
        onUserUpdate(response.data.user)
        toast.success(t('successProfileUpdate'))
        setProfilePic(null)
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error(t('errorProfileUpdate'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='card max-w-2xl'>
      <h2 className='text-lg font-semibold text-gray-800 mb-4'>{t('titleProfile')}</h2>
      <form onSubmit={handleProfileUpdate}>
        <ProfilePhotoSelector
          image={profilePic}
          setImage={setProfilePic}
        />
        {!profilePic && currentProfileUrl && (
          <div className='flex justify-center mb-4'>
            <img
              src={currentProfileUrl}
              alt='Current profile'
              className='w-20 h-20 rounded-full object-cover'
            />
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label={t('labelName')}
            placeholder={t('placeholderName')}
            type='text'
          />

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label={t('email')}
            placeholder='example@email.com'
            type='email'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='btn-primary flex items-center justify-center gap-2 mt-4'
        >
          <LuSave size={18} />
          {loading ? t('textSaving') : t('textSaveProfile')}
        </button>
      </form>
    </div>
  )
}

export default ProfileTab
