import React from "react";
import { 
  BookOpen, Users, Star, ArrowUpRight, 
  PlusCircle, ShoppingBag, Clock, ChevronRight 
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Sample Data (In real app, fetch from Context/API)
  const stats = [
    { 
      title: "Total Books", 
      value: "124", 
      icon: <BookOpen />, 
      grow: "+12%", 
      color: "bg-blue-600",
      description: "In your collection"
    },
    { 
      title: "Active Users", 
      value: "3,420", 
      icon: <Users />, 
      grow: "+5.4%", 
      color: "bg-indigo-600",
      description: "This month"
    },
    { 
      title: "Total Reviews", 
      value: "982", 
      icon: <Star />, 
      grow: "+18%", 
      color: "bg-amber-500",
      description: "Average 4.2★"
    },
  ];

  const recentBooks = [
    { title: "Atomic Habits", author: "James Clear", time: "2 hours ago", category: "Self-Help" },
    { title: "Deep Work", author: "Cal Newport", time: "5 hours ago", category: "Productivity" },
    { title: "The Alchemist", author: "Paulo Coelho", time: "Yesterday", category: "Fiction" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", time: "2 days ago", category: "Psychology" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your library at a glance</p>
        </div>
        <Link 
          to="/admin/books/add" 
          className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <PlusCircle size={18} />
          Add New Book
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${item.color} p-3 rounded-lg text-white`}>
                {React.cloneElement(item.icon, { size: 22 })}
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                <ArrowUpRight size={14} />
                {item.grow}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{item.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{item.value}</p>
            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recently Added Books */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="text-blue-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Recently Added Books</h3>
              </div>
              <Link 
                to="/admin/books" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentBooks.map((book, i) => (
              <div 
                key={i} 
                className="p-6 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{book.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                      <span className="inline-block mt-2 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {book.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{book.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Library Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Available Books</span>
                <span className="font-semibold text-gray-900">98</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Borrowed</span>
                <span className="font-semibold text-gray-900">26</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Reserved</span>
                <span className="font-semibold text-gray-900">14</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/admin/books/add" 
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PlusCircle className="text-blue-600" size={18} />
                  </div>
                  <span className="font-medium text-gray-700">Add New Book</span>
                </div>
                <ChevronRight className="text-gray-400" size={18} />
              </Link>
              
              <Link 
                to="/admin/users" 
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="text-indigo-600" size={18} />
                  </div>
                  <span className="font-medium text-gray-700">Manage Users</span>
                </div>
                <ChevronRight className="text-gray-400" size={18} />
              </Link>
              
              <Link 
                to="/admin/reviews" 
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Star className="text-amber-600" size={18} />
                  </div>
                  <span className="font-medium text-gray-700">View Reviews</span>
                </div>
                <ChevronRight className="text-gray-400" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Visitors</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">2,847</p>
              <p className="text-sm text-gray-600 mt-1">+24% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Avg. Rating</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">4.2★</p>
              <p className="text-sm text-gray-600 mt-1">Based on 982 reviews</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Star className="text-gray-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;