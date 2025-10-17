import React, {useContext} from 'react'
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import { useUserAuth } from '../../hooks/useUserAuth';

const DashboardLayout = ({ children, activeMenu }) => {
    const {user} = useContext(UserContext);
    // Always run auth check for any dashboard page using this layout
    useUserAuth();
  return (
    <div className=''>
        <Navbar activeMenu={activeMenu}/>

        <div className='flex'>
            <div className='max-[1080px]:hidden'>
                <SideMenu activeMenu={activeMenu} />
            </div>

            <div className='grow mx-5'>
                {user ? (
                    children
                ) : (
                    <div className='p-6 text-sm text-gray-600 dark:text-gray-400'>Loading...</div>
                )}
            </div>
        </div>
    </div>
  );
};

export default DashboardLayout;