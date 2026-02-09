import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Bell, ShieldCheck, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Profile Dashboard Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200 mb-6">
        <div className="mb-5 flex items-center gap-2 border-b pb-3 text-lg font-semibold text-slate-700">
          <span>Profile Overview</span>
        </div>
        
        {/* Grid Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* My Orders */}
          <div className="rounded-lg bg-gray-50 p-5">
            <h3 className="mb-4 text-lg font-semibold">My Orders</h3>

            <div className="mb-3 flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
              <div>
                <p className="font-medium">Wireless Headphones</p>
                <p className="text-sm text-gray-500">
                  Order #BH10234 • Delivered
                </p>
              </div>
              <span className="font-semibold text-green-600">₹2,499</span>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
              <div>
                <p className="font-medium">Smart Watch</p>
                <p className="text-sm text-gray-500">
                  Order #BH10210 • In Transit
                </p>
              </div>
              <span className="font-semibold text-blue-600">₹3,999</span>
            </div>

            <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
              <div>
                <p className="font-medium">Mechanical Keyboard</p>
                <p className="text-sm text-gray-500">
                  Order #BH10245 • Processing
                </p>
              </div>
              <span className="font-semibold text-orange-600">₹4,200</span>
            </div>

            <Link to="/user/orders" className="mt-4 text-sm font-medium text-blue-600 hover:underline">
              View All Orders →
            </Link>
          </div>

          {/* Wishlist */}
          <div className="rounded-lg bg-gray-50 p-5">
            <h3 className="mb-4 text-lg font-semibold">Wishlist</h3>

            <ul className="space-y-3">
              <li className="flex justify-between text-sm bg-white p-2 rounded">
                <span>Nike Running Shoes</span>
                <span className="font-medium">₹5,999</span>
              </li>
              <li className="flex justify-between text-sm bg-white p-2 rounded">
                <span>Bluetooth Speaker</span>
                <span className="font-medium">₹1,799</span>
              </li>
              <li className="flex justify-between text-sm bg-white p-2 rounded">
                <span>Laptop Backpack</span>
                <span className="font-medium">₹1,299</span>
              </li>
            </ul>

            <Link to="/user/wishlist" className="mt-4 text-sm font-medium text-blue-600 hover:underline">
              View Wishlist →
            </Link>
          </div>

          {/* Address Book */}
          <div className="rounded-lg bg-gray-50 p-5">
            <h3 className="mb-4 text-lg font-semibold">Address Book</h3>

            <div className="bg-white p-3 rounded-md">
              <p className="text-sm font-medium">Default Address</p>
              <p className="mt-1 text-sm text-gray-600">
                Amresh Kumar <br />
                123, MG Road <br />
                Bangalore, Karnataka - 560001 <br />
                +91 9876543210
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <Link to="/user/address" className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
                Add New
              </Link>
              <Link to="/user/address" className="rounded-md bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600">
                Edit
              </Link>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="rounded-lg bg-gray-50 p-5">
            <h3 className="mb-4 text-lg font-semibold">Payment Methods</h3>

            <div className="bg-white p-3 rounded-md space-y-2">
              <p className="text-sm">💳 Visa **** 3245</p>
              <p className="text-sm">🏦 UPI - Google Pay</p>
            </div>

            <Link to="/user/payments" className="mt-4 text-sm font-medium text-blue-600 hover:underline">
              Manage Payments →
            </Link>
          </div>
        </div>
      </div>
       {/* NEW: Account Settings (Added from your image design) */}
          <div className="">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Account Settings</h3>
            <div className="overflow-hidden border-b border-gray-300 bg-white">
              <button className="flex w-full items-center justify-between border-b border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 text-slate-600">
                  <Lock size={18} className="text-slate-400" />
                  <span className="text-sm font-medium">Change Password</span>
                </div>
              </button>
              <button className="flex w-full items-center justify-between border-b border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 text-slate-600">
                  <Bell size={18} className="text-slate-400" />
                  <span className="text-sm font-medium">Manage Notifications</span>
                </div>
              </button>
              <button className="flex w-full items-center justify-between p-3 hover:bg-red-50 transition-colors group">
                <div className="flex items-center gap-3 text-red-500">
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-red-400" />
              </button>
            </div>
          </div>
    </div>
  );
};

export default Profile;