import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, User2 } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

const UserProfileNavbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const profile = {
    name: user?.name || "Guest Reader",
    email: user?.email || "No email on file",
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
        
        <Card>
          <div className="mb-5 flex items-center gap-2 border-b pb-3 text-lg font-semibold text-slate-700">
            <User2 size={18} />
            <span>My Profile</span>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600">
                {(profile.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {profile.name}
                </h2>
                <p className="text-sm text-slate-500">{profile.email}</p>
                {!user && (
                  <Badge variant="secondary" className="mt-2">
                    Sign in to manage your profile
                  </Badge>
                )}
              </div>
            </div>

            <Button variant="primary" size="md" disabled={!user}>
              {user ? "Edit Profile" : "Sign In"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileNavbar;
