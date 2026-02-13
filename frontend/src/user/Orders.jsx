import { useEffect, useMemo, useState } from "react";
import { Package, Eye } from "lucide-react";
import { Card, Button, Badge, LoadingSpinner } from "../components/ui";
import { EmptyState } from "../components/common";
import { getMyOrdersApi, cancelOrderApi } from "../services/orderApi";
import showToast from "../utils/toast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const statusVariant = useMemo(
    () => ({
      Pending: "warning",
      Processing: "primary",
      Shipped: "secondary",
      Delivered: "success",
      Cancelled: "danger",
    }),
    []
  );

  const paymentVariant = useMemo(
    () => ({
      paid: "success",
      pending: "warning",
      failed: "danger",
      refunded: "secondary",
    }),
    []
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrdersApi();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (error) {
      const msg = error?.response?.data?.msg || "Failed to load orders";
      showToast.error(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      setCancellingId(orderId);
      const data = await cancelOrderApi(orderId);
      showToast.success(data?.msg || "Order cancelled");
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? data.order : order))
      );
    } catch (error) {
      const msg = error?.response?.data?.msg || "Failed to cancel order";
      showToast.error(msg);
    } finally {
      setCancellingId(null);
    }
  };

  const confirmCancel = (orderId) => {
    if (cancellingId) return;
    toast((t) => (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-white">
          Are you sure you want to cancel this order?
        </p>
        <div className="flex gap-2">
          <Button
            variant="white"
            size="sm"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              toast.dismiss(t.id);
              handleCancel(orderId);
            }}
          >
            Yes, cancel
          </Button>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingSpinner message="Loading your orders..." />
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Start shopping to see your orders here"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card variant="elevated" padding="lg">
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title className="flex items-center gap-2">
              <Package size={20} />
              My Orders
            </Card.Title>
            <Badge variant="secondary">{orders.length} orders</Badge>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} variant="default" padding="md" hover>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">
                      Order #{String(order._id).slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {order.items?.length || 0} items · {order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-black text-slate-900">
                        Rs. {Number(order.total || 0).toLocaleString()}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-end mt-2">
                        <Badge
                          variant={statusVariant[order.status] || "secondary"}
                          size="sm"
                        >
                          {order.status}
                        </Badge>
                        <Badge
                          variant={
                            paymentVariant[order.paymentStatus] || "secondary"
                          }
                          size="sm"
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Eye}
                    fullWidth
                    onClick={() => navigate(`/user/orders/${order._id}`)}
                  >
                    View Details
                  </Button>
                  {["Pending", "Processing"].includes(order.status) && (
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      disabled={cancellingId === order._id}
                      onClick={() => confirmCancel(order._id)}
                    >
                      {cancellingId === order._id ? "Cancelling..." : "Cancel"}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Orders;
