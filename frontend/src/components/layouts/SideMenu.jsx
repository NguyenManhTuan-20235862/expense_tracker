import React, { useContext } from "react";
import { getSideMenuData } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import { useTranslation } from "react-i18next";


const SideMenu = ({ activeMenu }) => {

  const { t } = useTranslation();
  const SIDE_MENU_DATA = getSideMenuData(t);
  const { user, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Map activeMenu to path for language-independent comparison
  const getActiveMenuPath = (menu) => {
    const menuMap = {
      'Dashboard': '/dashboard',
      'Income': '/income',
      'Expense': '/expense',
      'Budget Planning': '/budget-planning',
      'Settings': '/settings',
    };
    return menuMap[menu] || menu;
  };

  const activeMenuPath = getActiveMenuPath(activeMenu);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
  };

  const handleLogout = () => {
    // Optionally add confirmation
    const confirmLogout = window.confirm(t('textSideMenuLogout'));
    
    if (confirmLogout) {
      // Clear all localStorage data
      localStorage.clear();
      
      // Clear user context
      clearUser();
      
      // Navigate to login page
      navigate("/login");
    }
  };

  return  (
  <div className="w-64 h-[calc(100vh-61px)] bg-white dark:bg-gray-900 border-r border-gray-200/50 dark:border-gray-700 p-5 sticky top-[61px] z-20 transition-colors duration-300">
    <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
      {user?.profileImageUrl ? (
        <img
          src={user?.profileImageUrl || ""}
          alt="Profile Image"
          className="w-20 h-20 bg-slate-400 rounded-full"
        />
      ) : (
        <CharAvatar 
        fullName={user?.fullName}
        width='w-20'
        height='h-20'
        style='text-xl'
      />
      )}

      <h5 className="text-gray-950 dark:text-white font-medium leading-6">
        {user?.fullName || ""}
      </h5>
    </div>

    {SIDE_MENU_DATA.map((item, index) => (
      <button
        key={`menu_${index}`}
        className={`w-full flex items-center gap-4 text-[15px] ${
          activeMenuPath === item.path 
            ? "text-white bg-primary dark:bg-primary" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        } ${
          item.path === 'logout' 
            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-700' 
            : ''
        } py-3 px-6 rounded-lg mb-3 transition-colors duration-200`}
        onClick={() => handleClick(item.path)}
      >
        <item.icon className={`text-lg ${item.path === 'logout' ? 'text-red-600' : ''}`} />
        {item.label}
      </button>
    ))}
  </div>
);
};

export default SideMenu;