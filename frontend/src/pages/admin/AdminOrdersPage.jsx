import { useState } from "react";
import { useAdminOrders, useUpdateAdminOrderStatus } from "@/hooks/api/useAdmin";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Search, Eye, Download, ShoppingCart, ChevronDown } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 20;

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  
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

  const getStatusStyle = (status) => {
    const map = {
      Pending: "warning",
      Processing: "info",
      Shipped: "info",
      Delivered: "success",
      Cancelled: "danger",
    };
    return map[status] || "default";
  };

  const getPaymentStyle = (status) => {
    const map = { paid: "success", pending: "warning", failed: "danger" };
    return map[status] || "default";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bulk actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(paginatedOrders.map(o => o._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }
    
    if (!window.confirm(`Update ${selectedOrders.length} orders to ${newStatus}?`)) {
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;

      for (const orderId of selectedOrders) {
        try {
          await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to update order ${orderId}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} order(s) updated successfully`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} order(s) failed to update`);
      }
      
      setSelectedOrders([]);
    } catch (error) {
      toast.error("Failed to update orders");
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (filteredOrders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    try {
      const csvData = filteredOrders.map(order => ({
        OrderNumber: order.orderNumber || "",
        Customer: order.user?.name || "Guest",
        Email: order.user?.email || "",
        Date: new Date(order.createdAt).toLocaleDateString(),
        Status: order.status || "",
        PaymentStatus: order.paymentStatus || "",
        PaymentMethod: order.paymentMethod || "",
        Total: order.total || 0,
        Items: order.items?.length || 0
      }));

      const headers = Object.keys(csvData[0]).join(",");
      const rows = csvData.map(row => Object.values(row).join(","));
      const csv = [headers, ...rows].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${filteredOrders.length} orders exported successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export orders");
    }
  };

  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="admin-page p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
            Manage Orders
          </h1>
          <p className="text-stone-500 mt-1.5 text-sm font-medium">
            {filteredOrders.length} orders {filterStatus !== "all" ? `(${filterStatus})` : "total"}
          </p>
        </div>
        <Button 
          onClick={handleExport}
          variant="outline"
          className="border-2 border-green-600 text-green-700 hover:bg-green-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card className="mb-6 p-4 border-2 border-amber-300 bg-amber-50/50 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-stone-900">
              {selectedOrders.length} selected
            </span>
            <div className="flex gap-2 flex-wrap">
              {statuses.map(status => (
                <Button
                  key={status}
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate(status)}
                  className="border-2 text-xs"
                >
                  Set {status}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 animate-slide-in-right stagger-1">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by order number, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors bg-white/80 backdrop-blur-sm rounded-xl h-11"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`admin-filter-pill px-3.5 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${
              filterStatus === "all"
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-md"
                : "bg-white text-stone-600 border-stone-200 hover:border-amber-400"
            }`}
          >
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`admin-filter-pill px-3.5 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                filterStatus === status
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-md"
                  : "bg-white text-stone-600 border-stone-200 hover:border-amber-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table/Cards */}
      {isLoading ? (
        <AdminSkeleton type="table" />
      ) : filteredOrders.length === 0 ? (
        <div className="admin-table-wrapper p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-stone-500 font-semibold text-lg mb-1">No orders found</p>
          <p className="text-stone-400 text-sm">
            {searchQuery || filterStatus !== "all" 
              ? "Try adjusting your search or filters" 
              : "Orders will appear here once customers place them"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block admin-table-wrapper animate-scale-up stagger-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="admin-thead">
                  <tr>
                    <th style={{width: '40px', paddingLeft: '16px'}}>
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-stone-300 accent-amber-600"
                      />
                    </th>
                    <th>Order</th>
                    <th className="hidden lg:table-cell">Customer</th>
                    <th className="hidden xl:table-cell">Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="hidden lg:table-cell">Payment</th>
                    <th style={{textAlign: 'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody className="admin-tbody">
                  {paginatedOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="admin-td" style={{paddingLeft: '16px'}}>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="w-4 h-4 rounded border-stone-300 accent-amber-600"
                        />
                      </td>
                      <td className="admin-td">
                        <div>
                          <div className="admin-cell-primary">#{order.orderNumber}</div>
                          <div className="admin-cell-secondary">{order.items.length} items</div>
                          <div className="lg:hidden admin-cell-secondary">{order.user?.name}</div>
                        </div>
                      </td>
                      <td className="admin-td hidden lg:table-cell">
                        <div>
                          <div className="text-sm text-stone-800 font-medium">{order.user?.name}</div>
                          <div className="admin-cell-secondary">{order.user?.email}</div>
                        </div>
                      </td>
                      <td className="admin-td hidden xl:table-cell">
                        <span className="text-sm text-stone-500">{shortDate(order.createdAt)}</span>
                      </td>
                      <td className="admin-td">
                        <span className="admin-price">{formatPrice(order.total)}</span>
                      </td>
                      <td className="admin-td">
                        <div className="flex flex-col gap-2">
                          <span className={`admin-status ${getStatusStyle(order.status)}`}>
                            <span className="dot" />
                            {order.status}
                          </span>
                          {order.status !== "Cancelled" && order.status !== "Delivered" && (
                            <div className="relative">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                className="text-xs border border-stone-200 rounded-lg pl-2 pr-6 py-1 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white appearance-none cursor-pointer w-full"
                              >
                                {statuses.filter(status => {
                                  if (order.status === "Pending") return ["Pending", "Processing", "Cancelled"].includes(status);
                                  if (order.status === "Processing") return ["Processing", "Shipped", "Cancelled"].includes(status);
                                  if (order.status === "Shipped") return ["Shipped", "Delivered"].includes(status);
                                  return true;
                                }).map((status) => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="admin-td hidden lg:table-cell">
                        <span className={`admin-status ${getPaymentStyle(order.paymentStatus)}`}>
                          <span className="dot" />
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="admin-td">
                        <div className="admin-actions justify-end">
                          <Link to={`/admin/orders/${order._id}`}>
                            <button className="admin-action-btn view" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="admin-table-footer flex items-center justify-between">
              <span>Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders</span>
              <span className="text-xs text-stone-400">Page {currentPage} of {totalPages || 1}</span>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 animate-scale-up stagger-2">
            {paginatedOrders.map((order) => (
              <div key={order._id} className="admin-mobile-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-stone-900">#{order.orderNumber}</h3>
                    <p className="text-sm text-stone-500">{order.user?.name}</p>
                    <p className="text-xs text-stone-400">{shortDate(order.createdAt)}</p>
                  </div>
                  <Link to={`/admin/orders/${order._id}`}>
                    <button className="admin-action-btn view">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="admin-price text-lg">{formatPrice(order.total)}</span>
                  <span className="text-xs text-stone-400">{order.items.length} items</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className={`admin-status text-xs ${getStatusStyle(order.status)}`}>
                    <span className="dot" />{order.status}
                  </span>
                  <span className={`admin-status text-xs ${getPaymentStyle(order.paymentStatus)}`}>
                    <span className="dot" />{order.paymentStatus}
                  </span>
                </div>
                {order.status !== "Cancelled" && order.status !== "Delivered" && (
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="w-full text-sm border-2 border-stone-200 rounded-lg px-3 py-2 pr-8 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white appearance-none"
                    >
                      {statuses.filter(status => {
                        if (order.status === "Pending") return ["Pending", "Processing", "Cancelled"].includes(status);
                        if (order.status === "Processing") return ["Processing", "Shipped", "Cancelled"].includes(status);
                        if (order.status === "Shipped") return ["Shipped", "Delivered"].includes(status);
                        return true;
                      }).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 animate-fade-in-up">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
