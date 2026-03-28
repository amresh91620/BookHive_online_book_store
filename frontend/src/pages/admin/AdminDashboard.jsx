import { Link } from "react-router-dom";
import { useAdminStats, useAdminOrders } from "@/hooks/api/useAdmin";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ShoppingCart, DollarSign, Eye, Package } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({ limit: 10, offset: 0 });
  
  const orders = ordersData?.orders || [];
  const isLoading = statsLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-12 w-64 bg-stone-200 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border-2 border-stone-200 animate-pulse"></div>
            ))}
          </div>
          <div className="h-64 bg-white rounded-2xl border-2 border-stone-200 animate-pulse"></div>
        </div>
      </div>
    );
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
      value: `₹${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-stone-900 mb-2">
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
                    <div className="text-3xl font-display font-bold text-stone-900">{stat.value}</div>
                  </CardContent>
                </Card>
              </CardWrapper>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up stagger-2">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold text-stone-900">Quick Actions</CardTitle>
            <p className="text-stone-600 text-sm font-light mt-1">Manage your store efficiently</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* New Orders Section */}
        <Card className="mb-8 border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up stagger-3">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-display font-bold text-stone-900">New Orders</CardTitle>
                <p className="text-sm text-stone-600 font-light mt-1">Recent pending orders</p>
              </div>
              <Link to="/admin/orders?status=Pending">
                <Button variant="outline" size="sm" className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 font-medium">
                  View All
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
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 border-stone-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/50 transition-all duration-300 hover:shadow-soft animate-slide-in-right stagger-${index + 1}`}
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Orders Section */}
        <Card className="border-2 border-stone-200 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up stagger-4">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-display font-bold text-stone-900">Recent Orders</CardTitle>
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
