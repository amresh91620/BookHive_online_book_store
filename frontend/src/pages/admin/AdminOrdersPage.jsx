import { useState } from "react";
import { useAdminOrders, useUpdateAdminOrderStatus } from "@/hooks/api/useAdmin";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { data: ordersData, isLoading } = useAdminOrders();
  const updateOrderStatus = useUpdateAdminOrderStatus();

  const orders = ordersData?.orders || [];

  const handleStatusUpdate = async (orderId, newStatus) => {
    updateOrderStatus.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => toast.success("Order status updated"),
        onError: (error) => toast.error(error?.response?.data?.msg || "Failed to update order"),
      }
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "secondary",
      Processing: "default",
      Shipped: "default",
      Delivered: "success",
      Cancelled: "destructive",
    };
    return colors[status] || "secondary";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent mb-8 animate-fade-in-up">
        Manage Orders
      </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 animate-slide-in-right stagger-1">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className={filterStatus === "all" ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800" : "border-2 hover:border-amber-500"}
            >
              All
            </Button>
            {statuses.map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800" : "border-2 hover:border-amber-500"}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders Table/Cards */}
        {isLoading ? (
          <LoadingSkeleton type="table" count={1} />
        ) : (
          <>
            {/* Desktop Table */}
            <Card className="hidden md:block border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-up stagger-2 bg-white/80 backdrop-blur-sm">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-stone-50 to-amber-50/50 border-b-2 border-stone-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order._id} 
                      className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-stone-50 transition-all duration-200"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-semibold text-stone-900">#{order.orderNumber}</div>
                        <div className="text-sm text-stone-500">{order.items.length} items</div>
                        <div className="md:hidden text-xs text-stone-400 mt-1">{order.user?.name}</div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <div className="text-sm text-stone-900 font-medium">{order.user?.name}</div>
                        <div className="text-sm text-stone-500">{order.user?.email}</div>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 text-sm text-stone-900">
                        {shortDate(order.createdAt)}
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm font-bold text-amber-700">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <Badge variant={getStatusColor(order.status)} className="w-fit shadow-sm">
                            {order.status}
                          </Badge>
                          {order.status !== "Cancelled" && order.status !== "Delivered" && (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className="text-xs border-2 border-stone-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                            >
                              {statuses.filter(status => {
                                if (order.status === "Pending") {
                                  return ["Pending", "Processing", "Cancelled"].includes(status);
                                }
                                if (order.status === "Processing") {
                                  return ["Processing", "Shipped", "Cancelled"].includes(status);
                                }
                                if (order.status === "Shipped") {
                                  return ["Shipped", "Delivered"].includes(status);
                                }
                                return true;
                              }).map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4">
                        <Badge
                          variant={
                            order.paymentStatus === "paid"
                              ? "success"
                              : order.paymentStatus === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className="shadow-sm"
                        >
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <Link to={`/admin/orders/${order._id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-amber-100 hover:text-amber-700 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 animate-scale-up stagger-2">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="p-4 border-2 border-stone-200 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-stone-900">#{order.orderNumber}</h3>
                    <p className="text-sm text-stone-600">{order.user?.name}</p>
                    <p className="text-xs text-stone-500">{order.user?.email}</p>
                  </div>
                  <Link to={`/admin/orders/${order._id}`}>
                    <Button variant="ghost" size="sm" className="hover:bg-amber-100">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Items:</span>
                    <span className="font-semibold">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Total:</span>
                    <span className="font-bold text-amber-700">{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Date:</span>
                    <span>{shortDate(order.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant={getStatusColor(order.status)} className="shadow-sm">{order.status}</Badge>
                  <Badge variant={order.paymentStatus === "paid" ? "success" : order.paymentStatus === "pending" ? "secondary" : "destructive"} className="shadow-sm">
                    {order.paymentStatus}
                  </Badge>
                </div>
                {order.status !== "Cancelled" && order.status !== "Delivered" && (
                  <select value={order.status} onChange={(e) => handleStatusUpdate(order._id, e.target.value)} className="w-full text-sm border-2 border-stone-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white">
                    {statuses.filter(status => {
                      if (order.status === "Pending") return ["Pending", "Processing", "Cancelled"].includes(status);
                      if (order.status === "Processing") return ["Processing", "Shipped", "Cancelled"].includes(status);
                      if (order.status === "Shipped") return ["Shipped", "Delivered"].includes(status);
                      return true;
                    }).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                )}
              </Card>
            ))}
          </div>
        </>
        )}
    </div>
  );
}

