import React from 'react';
import { Outlet } from 'react-router-dom';
import UserProfileNavbar from './UserProfileNavbar';


const UserLayout = ({ children }) => {
  return (
    <div className="bg-white">
      {/* Main Content Area */}
      <div className="">
        <UserProfileNavbar />
        <main className="">
            {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;