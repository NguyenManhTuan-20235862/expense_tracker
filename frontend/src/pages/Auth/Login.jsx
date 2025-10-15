import React, { useContext, useState} from 'react'
import { validateEmail } from '../../utils/helper';
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { useTranslation } from 'react-i18next';


const Login = () => {

  const { t } = useTranslation()

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError(t('errorInvalidEmail'));
      return;
  } 

  if(!password) {
      setError(t('errorInvalidPassword'));
      return;
  }

  setError('');

  // Login API call
  try {
  const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
    email,
    password,
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
}


  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">{t('welcome')}</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          {t('textlog')}
        </p>
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label={t('email')}
            placeholder="a@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label={t('password')}
            placeholder={t('textplace')}
            type="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            {t('login')}
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            {t('textsig')} {' '}
            <Link className='font-medium text-primary underline' to="/signup">
              {t('signup')}
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login