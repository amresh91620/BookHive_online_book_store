import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, User2 } from 'lucide-react';

const UserProfileNavbar = () => {
  const location = useLocation();
  const profile = {
    name: "Amresh Kumar",
    email: "amresh@gmail.com",
    phone: "+91 9876543210",
    joinedDate: "March 2025",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  const getBackLink = () => {
    if (location.pathname.includes('/orders')) {
      return '/user/profile';
    }
    if (location.pathname.includes('/wishlist')) {
      return '/user/profile';
    }
    if (location.pathname.includes('/address')) {
      return '/user/profile';
    }
    if (location.pathname.includes('/payments')) {
      return '/user/profile';
    }
    return '/';
  };

  const getBackText = () => {
    if (location.pathname.includes('/orders') || 
        location.pathname.includes('/wishlist') || 
        location.pathname.includes('/address') || 
        location.pathname.includes('/payments')) {
      return 'Back to profile';
    }
    return 'Back to home';
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-600">
          <ArrowLeft size={16} />
          <Link to={getBackLink()} className="hover:underline">
            {getBackText()}
          </Link>
        </nav>
        
        <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-5 flex items-center gap-2 border-b pb-3 text-lg font-semibold text-slate-700">
            <User2 size={18} />
            <span>My Profile</span>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <img 
                src={profile.avatar}
                alt="User profile"
                className="h-20 w-20 rounded-full border border-slate-200 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {profile.name}
                </h2>
                <p className="text-sm text-slate-500">{profile.email}</p>
                <p className="text-sm text-slate-500">{profile.phone}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Joined {profile.joinedDate}
                </p>
              </div>
            </div>

            <button className="rounded-md bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileNavbar;