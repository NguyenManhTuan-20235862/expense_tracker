import React, { useState, useContext } from 'react'
import { validateEmail } from '../../utils/helper';
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import { useTranslation } from 'react-i18next';


const SignUp = () => {

  const { t } = useTranslation();

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle signup form submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if(!fullName) {
      setError(t('errorName'));
      return;
  }
    if(!validateEmail(email)) {
      setError(t('errorInvalidEmail'));
      return;
  }
  if(!password) {
      setError(t('errorInvalidPassword'));
      return;
  }
  setError('');

  // Signup API call
  try {
    // Upload image if present
    if(profilePic) {
      const imgUploadRes = await uploadImage(profilePic);
      profileImageUrl = imgUploadRes.imageUrl || "";
    }

  const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
    fullName,
    email,
    password,
    profileImageUrl
  });

  const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
       setError(error.response.data.message);
    } else {
       setError(t('error'));
    }
   }
 };


  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>{t('buttonSignUp')}</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          {t('textSignUp')}
        </p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label={t('labelName')}
              placeholder="Nguyễn Văn A"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label={t('email')}
              placeholder="a@example.com"
              type="text"
            />
            <div className='col-span-2'>
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label={t('password')}
              placeholder={t('textplace')}
              type="password"
            />
            </div>
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
              {t('signup1')}
          </button>
          
          <p className='text-[13px] text-slate-800 mt-3'>
              {t('textsig')}{' '}
            <Link className='font-medium text-primary underline' to="/login">
              {t('login')}
            </Link>
          </p>
        </form>
      </div>

    </AuthLayout>
  )
}

export default SignUp