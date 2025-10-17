import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { useTranslation } from 'react-i18next';
import DarkModeToggle from './DarkModeToggle';

const Navbar = ({ activeMenu }) => {

  const { t } = useTranslation();

  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700 py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black dark:text-white"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (   
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black dark:text-white">{t('titleNavbar')}</h2>

      <DarkModeToggle />

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white dark:bg-gray-800">
          <SideMenu activeMenu={activeMenu} />
        </div> 
      )}
    </div>
  );
};

export default Navbar;