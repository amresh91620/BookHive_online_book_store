import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrders, updateOrderStatus } from "@/store/slices/adminSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.admin);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      toast.success("Order status updated");
      dispatch(fetchAdminOrders());
    } catch (error) {
      toast.error(error);
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-shell">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            {statuses.map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {status === "loading" ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">#{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">{order.items.length} items</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.user?.name}</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {shortDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                          disabled={order.status === "Cancelled" || order.status === "Delivered"}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            order.paymentStatus === "paid"
                              ? "success"
                              : order.paymentStatus === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
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
          </Card>
        )}
      </div>
    </div>
  );
}
