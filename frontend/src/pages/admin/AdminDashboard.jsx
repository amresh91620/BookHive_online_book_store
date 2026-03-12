import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminStats, fetchAdminOrders } from "@/store/slices/adminSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ShoppingCart, DollarSign, Eye, Package } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, orders, status } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAdminOrders({ limit: 10, offset: 0 }));
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Books",
      value: stats?.totalBooks || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/books",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admin/users",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your store overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const CardWrapper = stat.link ? Link : "div";
            return (
              <CardWrapper key={stat.title} to={stat.link || "#"}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </CardWrapper>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/books/add"
                className="p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <BookOpen className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold">Add New Book</h3>
                <p className="text-sm text-gray-600">Add a new book to inventory</p>
              </Link>
              <Link
                to="/admin/orders"
                className="p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <ShoppingCart className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold">Manage Orders</h3>
                <p className="text-sm text-gray-600">View and update orders</p>
              </Link>
              <Link
                to="/admin/users"
                className="p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <Users className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage users</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* New Orders Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>New Orders</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Recent pending orders</p>
              </div>
              <Link to="/admin/orders?status=Pending">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {orders && orders.filter(o => o.status === "Pending").length > 0 ? (
              <div className="space-y-3">
                {orders
                  .filter(o => o.status === "Pending")
                  .slice(0, 5)
                  .map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded">
                          <Package className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {order.user?.name || "Guest"} • {shortDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-amber-600">{formatPrice(order.total)}</p>
                          <Badge variant="secondary">{order.status}</Badge>
                        </div>
                        <Link to={`/admin/orders/${order._id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No new orders</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Orders Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Latest orders by date</p>
              </div>
              <Link to="/admin/orders">
                <Button variant="outline" size="sm">View All Orders</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 text-sm font-medium text-gray-600">Order</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Customer</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Date</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">Total</th>
                      <th className="pb-3 text-sm font-medium text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <p className="font-medium">#{order.orderNumber}</p>
                        </td>
                        <td className="py-3">
                          <p className="text-sm">{order.user?.name || "Guest"}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {shortDate(order.createdAt)}
                        </td>
                        <td className="py-3">
                          <Badge 
                            variant={
                              order.status === "Delivered" ? "success" :
                              order.status === "Cancelled" ? "destructive" :
                              "default"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 font-semibold text-amber-600">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3">
                          <Link to={`/admin/orders/${order._id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
