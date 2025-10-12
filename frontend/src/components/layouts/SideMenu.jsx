import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
  };

  const handleLogout = () => {
    // Optionally add confirmation
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');
    
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
  <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
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

      <h5 className="text-gray-950 font-medium leading-6">
        {user?.fullName || ""}
      </h5>
    </div>

    {SIDE_MENU_DATA.map((item, index) => (
      <button
        key={`menu_${index}`}
        className={`w-full flex items-center gap-4 text-[15px] ${
          activeMenu === item.label 
            ? "text-white bg-primary" 
            : "text-gray-700 hover:bg-gray-50"
        } ${
          item.label === 'Logout' 
            ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
            : ''
        } py-3 px-6 rounded-lg mb-3 transition-colors duration-200`}
        onClick={() => handleClick(item.path)}
      >
        <item.icon className={`text-lg ${item.label === 'Logout' ? 'text-red-600' : ''}`} />
        {item.label}
      </button>
    ))}
  </div>
);
};

export default SideMenu;