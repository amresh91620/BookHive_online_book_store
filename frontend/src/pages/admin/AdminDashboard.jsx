import { Link } from "react-router-dom";
import { useAdminStats, useAdminOrders, useAdminReviews } from "@/hooks/api/useAdmin";
import { useBooksList } from "@/hooks/api/useBooks";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ShoppingCart, DollarSign, Eye, Package, TrendingUp, AlertTriangle, Star, MessageSquare } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({ limit: 10, offset: 0 });
  const { data: booksData, isLoading: booksLoading } = useBooksList({ limit: 100, offset: 0 });
  const { data: reviewsData, isLoading: reviewsLoading } = useAdminReviews({ limit: 5, offset: 0 });
  
  const orders = ordersData?.orders || [];
  const books = booksData?.books || [];
  const reviews = reviewsData?.reviews || [];
  const isLoading = statsLoading || ordersLoading;

  if (isLoading) {
    return <AdminSkeleton type="dashboard" />;
  }

  const statCards = [
    {
      title: "Total Books",
      value: stats?.totalBooks || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      link: "/admin/books",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
      link: "/admin/users",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      link: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
  ];

  // Additional stats
  const pendingOrdersCount = orders.filter(o => o.status === "Pending").length;
  const processingOrdersCount = orders.filter(o => o.status === "Processing").length;
  const deliveredOrdersCount = orders.filter(o => o.status === "Delivered").length;
  
  // Low stock books (stock < 10)
  const lowStockBooks = books.filter(book => book.stock < 10 && book.stock > 0).slice(0, 5);
  const outOfStockBooks = books.filter(book => book.stock === 0).slice(0, 5);
  const outOfStockCount = books.filter(book => book.stock === 0).length;
  
  // Top selling books (by totalSales)
  const topSellingBooks = [...books]
    .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
    .slice(0, 5);
  
  // Today's revenue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= today && order.paymentStatus === "paid";
  });
  const todaysRevenue = todaysOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  // Monthly revenue calculation (last 6 months)
  const getMonthlyRevenue = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthStart && orderDate <= monthEnd && order.paymentStatus === "paid";
      });
      
      const revenue = monthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      months.push({ month: monthName, revenue, orders: monthOrders.length });
    }
    
    return months;
  };
  
  const monthlyData = getMonthlyRevenue();
  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);

  // Customer Analytics
  const getTopCustomers = () => {
    const customerMap = {};
    
    orders.forEach(order => {
      if (order.user && order.paymentStatus === "paid") {
        const userId = order.user._id || order.user;
        const userName = order.user.name || "Unknown";
        const userEmail = order.user.email || "";
        
        if (!customerMap[userId]) {
          customerMap[userId] = {
            id: userId,
            name: userName,
            email: userEmail,
            totalSpent: 0,
            orderCount: 0
          };
        }
        
        customerMap[userId].totalSpent += order.total || 0;
        customerMap[userId].orderCount += 1;
      }
    });
    
    return Object.values(customerMap)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  };
  
  const topCustomers = getTopCustomers();

  return (
    <div className="admin-page p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-2">
            Dashboard
          </h1>
          <p className="text-stone-600 text-base sm:text-lg font-light">
            Welcome back! Here's your store overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const CardWrapper = stat.link ? Link : "div";
            return (
              <CardWrapper 
                key={stat.title} 
                to={stat.link || "#"}
                className={`animate-fade-in-up stagger-${index + 1}`}
              >
                <Card className={`group hover:shadow-large transition-all duration-300 hover:-translate-y-2 border-2 ${stat.borderColor} overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                    <CardTitle className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                  </CardContent>
                </Card>
              </CardWrapper>
            );
          })}
        </div>

        {/* New Orders Section - PRIORITY */}
        <Card className="mb-8 border-2 border-amber-200 shadow-large hover:shadow-premium transition-all duration-300 animate-fade-in-up">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-stone-900">🔔 New Orders</CardTitle>
                <p className="text-sm text-stone-600 font-light mt-1">Recent pending orders requiring attention</p>
              </div>
              <Link to="/admin/orders?status=Pending">
                <Button variant="outline" size="sm" className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 font-medium">
                  View All Pending
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {orders && orders.filter(o => o.status === "Pending").length > 0 ? (
              <div className="space-y-3">
                {orders
                  .filter(o => o.status === "Pending")
                  .slice(0, 5)
                  .map((order, index) => (
                    <div 
                      key={order._id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 border-stone-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 hover:shadow-medium"
                    >
                      <div className="flex items-center gap-3 mb-3 sm:mb-0">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
                          <Package className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900">Order #{order.orderNumber}</p>
                          <p className="text-sm text-stone-600 font-light">
                            {order.user?.name || "Guest"} • {shortDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-lg text-amber-700">{formatPrice(order.total)}</p>
                          <Badge variant="secondary" className="mt-1">{order.status}</Badge>
                        </div>
                        <Link to={`/admin/orders/${order._id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-amber-100">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 text-stone-500">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 mb-4">
                  <Package className="w-10 h-10 text-stone-400" />
                </div>
                <p className="font-medium">No new orders</p>
                <p className="text-sm mt-1">All orders have been processed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Overview */}
        <Card className="mb-8 border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up stagger-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-stone-900">Order Status Overview</CardTitle>
            <p className="text-stone-600 text-sm font-light mt-1">Current order distribution</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border-2 border-amber-200 rounded-xl bg-gradient-to-br from-amber-50 to-white">
                <p className="text-sm text-stone-600 font-medium mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-amber-700">{pendingOrdersCount}</p>
              </div>
              <div className="p-4 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-white">
                <p className="text-sm text-stone-600 font-medium mb-1">Processing</p>
                <p className="text-3xl font-bold text-blue-700">{processingOrdersCount}</p>
              </div>
              <div className="p-4 border-2 border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-white">
                <p className="text-sm text-stone-600 font-medium mb-1">Delivered</p>
                <p className="text-3xl font-bold text-green-700">{deliveredOrdersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8 border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up stagger-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-stone-900">Quick Actions</CardTitle>
            <p className="text-stone-600 text-sm font-light mt-1">Manage your store efficiently</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/admin/books/add"
                className="group p-6 border-2 border-stone-200 rounded-2xl hover:border-amber-400 hover:bg-gradient-to-br hover:from-amber-50 hover:to-white transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
              >
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-7 h-7 text-amber-700" />
                </div>
                <h3 className="font-semibold text-lg text-stone-900 mb-1">Add New Book</h3>
                <p className="text-sm text-stone-600 font-light">Add a new book to inventory</p>
              </Link>
              <Link
                to="/admin/orders"
                className="group p-6 border-2 border-stone-200 rounded-2xl hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-white transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
              >
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-7 h-7 text-purple-700" />
                </div>
                <h3 className="font-semibold text-lg text-stone-900 mb-1">Manage Orders</h3>
                <p className="text-sm text-stone-600 font-light">View and update orders</p>
              </Link>
              <Link
                to="/admin/users"
                className="group p-6 border-2 border-stone-200 rounded-2xl hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-white transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
              >
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-green-700" />
                </div>
                <h3 className="font-semibold text-lg text-stone-900 mb-1">Manage Users</h3>
                <p className="text-sm text-stone-600 font-light">View and manage users</p>
              </Link>
              <Link
                to="/admin/blogs/add"
                className="group p-6 border-2 border-stone-200 rounded-2xl hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-50 hover:to-white transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
              >
                <div className="p-3 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-7 h-7 text-pink-700" />
                </div>
                <h3 className="font-semibold text-lg text-stone-900 mb-1">Add New Blog</h3>
                <p className="text-sm text-stone-600 font-light">Create a new blog post</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Today's Revenue & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Revenue */}
          <Card className="border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <CardTitle className="text-xl font-bold text-stone-900">Today's Revenue</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {formatPrice(todaysRevenue)}
              </div>
              <p className="text-sm text-stone-600">
                {todaysOrders.length} orders completed today
              </p>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="border-2 border-red-200 shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-xl font-bold text-stone-900">Stock Alert</CardTitle>
                </div>
                <Link to="/admin/books/add">
                  <Button variant="outline" size="sm" className="border-green-600 text-green-700 hover:bg-green-50">
                    + Add Item
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3 mb-2">
                <div className="text-4xl font-bold text-red-600">{lowStockBooks.length}</div>
                <span className="text-sm text-stone-600">books low on stock</span>
              </div>
              <p className="text-sm text-stone-600 mb-3">
                {outOfStockCount} books out of stock
              </p>
              
              {/* Low Stock Books */}
              {lowStockBooks.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-stone-700 uppercase">Low Stock ({"<"}10)</p>
                  {lowStockBooks.slice(0, 3).map((book) => (
                    <div key={book._id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="flex-1 truncate">{book.title}</span>
                      <span className="font-semibold text-orange-600">{book.stock} left</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Out of Stock Books */}
              {outOfStockBooks.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-stone-700 uppercase">Out of Stock</p>
                  {outOfStockBooks.slice(0, 3).map((book) => (
                    <div key={book._id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      <span className="flex-1 truncate">{book.title}</span>
                      <span className="font-semibold text-red-600">0 stock</span>
                    </div>
                  ))}
                </div>
              )}
              
              {(lowStockBooks.length > 0 || outOfStockBooks.length > 0) && (
                <Link to="/admin/books">
                  <Button variant="outline" size="sm" className="w-full border-red-600 text-red-700 hover:bg-red-50">
                    View All Stock Issues
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Revenue Chart */}
        <Card className="mb-8 border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-stone-900">Revenue Trend (Last 6 Months)</CardTitle>
            <p className="text-stone-600 text-sm font-light mt-1">Monthly revenue and order statistics</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month, index) => {
                const barWidth = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-stone-700 w-16">{month.month}</span>
                      <span className="text-stone-600">{month.orders} orders</span>
                      <span className="font-bold text-green-600">{formatPrice(month.revenue)}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-stone-600 mb-1">Total Revenue (6 months)</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(monthlyData.reduce((sum, m) => sum + m.revenue, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-stone-600 mb-1">Total Orders (6 months)</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {monthlyData.reduce((sum, m) => sum + m.orders, 0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Books & Recent Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Selling Books */}
          <Card className="border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-xl font-bold text-stone-900">Top Selling Books</CardTitle>
                </div>
                <Link to="/admin/books">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {topSellingBooks.length > 0 ? (
                <div className="space-y-3">
                  {topSellingBooks.map((book, index) => (
                    <div key={book._id} className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700">
                        {index + 1}
                      </div>
                      <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 truncate">{book.title}</p>
                        <p className="text-sm text-stone-600">{book.totalSales || 0} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600">{formatPrice(book.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-stone-500 py-8">No sales data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-xl font-bold text-stone-900">Recent Reviews</CardTitle>
                </div>
                <Link to="/admin/reviews">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-stone-900">{review.user?.name || "Anonymous"}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-stone-900">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-stone-600 line-clamp-2">{review.comment}</p>
                      <p className="text-xs text-stone-500 mt-1">{shortDate(review.createdAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-stone-500 py-8">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Customers */}
        <Card className="mb-8 border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-xl font-bold text-stone-900">Top Customers (VIP)</CardTitle>
              </div>
              <Link to="/admin/users">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <p className="text-stone-600 text-sm font-light mt-1">Customers with highest lifetime value</p>
          </CardHeader>
          <CardContent>
            {topCustomers.length > 0 ? (
              <div className="space-y-3">
                {topCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg hover:bg-purple-50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900">{customer.name}</p>
                      <p className="text-sm text-stone-600 truncate">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{formatPrice(customer.totalSpent)}</p>
                      <p className="text-sm text-stone-600">{customer.orderCount} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-stone-500 py-8">No customer data yet</p>
            )}
          </CardContent>
        </Card>

        {/* All Orders Section */}
        <Card className="border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up stagger-4">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-stone-900">Recent Orders</CardTitle>
                <p className="text-sm text-stone-600 font-light mt-1">Latest orders by date</p>
              </div>
              <Link to="/admin/orders">
                <Button variant="outline" size="sm" className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 font-medium">
                  View All Orders
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full divide-y divide-stone-200">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Order</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-200">
                      {orders.slice(0, 10).map((order) => (
                        <tr key={order._id} className="hover:bg-stone-50 transition-colors duration-200">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <p className="font-semibold text-stone-900">#{order.orderNumber}</p>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <p className="text-sm font-medium text-stone-900">{order.user?.name || "Guest"}</p>
                            <p className="text-xs text-stone-500 font-light">{order.user?.email}</p>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-stone-600">
                            {shortDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge 
                              variant={
                                order.status === "Delivered" ? "success" :
                                order.status === "Cancelled" ? "destructive" :
                                "default"
                              }
                              className="font-medium"
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap font-bold text-amber-700">
                            {formatPrice(order.total)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <Link to={`/admin/orders/${order._id}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-amber-100">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {orders.slice(0, 10).map((order) => (
                    <div key={order._id} className="p-4 border-2 border-stone-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/50 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-stone-900">#{order.orderNumber}</p>
                          <p className="text-sm text-stone-600">{order.user?.name || "Guest"}</p>
                          <p className="text-xs text-stone-500">{shortDate(order.createdAt)}</p>
                        </div>
                        <Link to={`/admin/orders/${order._id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-amber-100">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge 
                          variant={
                            order.status === "Delivered" ? "success" :
                            order.status === "Cancelled" ? "destructive" :
                            "default"
                          }
                          className="font-medium"
                        >
                          {order.status}
                        </Badge>
                        <p className="font-bold text-lg text-amber-700">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-stone-500">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 mb-4">
                  <ShoppingCart className="w-10 h-10 text-stone-400" />
                </div>
                <p className="font-medium">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

