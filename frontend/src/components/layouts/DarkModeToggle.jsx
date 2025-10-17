import React, {useEffect, useState} from 'react'

const DarkModeToggle = () => {

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button className='px-4 py-2 mb-5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-white shadow'
      onClick={() => setDarkMode((prev) => !prev)}>
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  )
}

export default DarkModeToggle