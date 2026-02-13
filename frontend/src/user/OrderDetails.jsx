import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CreditCard, MapPin, Package } from "lucide-react";
import { Badge, Button, Card, LoadingSpinner } from "../components/ui";
import { EmptyState } from "../components/common";
import { cancelOrderApi, getOrderByIdApi } from "../services/orderApi";
import showToast from "../utils/toast";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderByIdApi(id);
        setOrder(data?.order || null);
      } catch (error) {
        const msg = error?.response?.data?.msg || "Failed to load order";
        showToast.error(msg);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      setCancelling(true);
      const data = await cancelOrderApi(order._id);
      showToast.success(data?.msg || "Order cancelled");
      setOrder(data.order);
    } catch (error) {
      const msg = error?.response?.data?.msg || "Failed to cancel order";
      showToast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  const confirmCancel = () => {
    if (cancelling) return;
    toast((t) => (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">
          Are you sure you want to cancel this order?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => toast.dismiss(t.id)}>
            No
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              toast.dismiss(t.id);
              handleCancel();
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
      <div className="max-w-6xl mx-auto px-4 py-16">
        <LoadingSpinner message="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <EmptyState
          icon={Package}
          title="Order not found"
          description="We could not find this order."
          actionLabel="Back to Orders"
          onAction={() => navigate("/user/orders")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Order details</p>
          <h1 className="text-2xl font-black text-slate-900">
            Order #{String(order._id).slice(-6).toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[order.status] || "secondary"}>
            {order.status}
          </Badge>
          <Badge variant={paymentVariant[order.paymentStatus] || "secondary"}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Card.Title>Items</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.book}
                    className="flex flex-col sm:flex-row gap-4 border-b border-slate-100 pb-4"
                  >
                    <img
                      src={item.coverImage || "/placeholder.png"}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">
                        {item.author || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right text-sm font-semibold text-slate-900">
                      Rs. {Number(item.price || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <MapPin size={18} />
                Delivery Address
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-sm text-slate-700 leading-relaxed">
                {order.address?.fullName}
                <br />
                {order.address?.street}
                <br />
                {order.address?.city}, {order.address?.state} -{" "}
                {order.address?.pincode}
                <br />
                {order.address?.phone}
              </p>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <CreditCard size={18} />
                Payment
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-sm text-slate-600">
                Method:{" "}
                <span className="font-semibold text-slate-900">
                  {order.paymentMethod}
                </span>
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Status:{" "}
                <span className="font-semibold text-slate-900">
                  {order.paymentStatus}
                </span>
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {Number(order.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs. {Number(order.shipping || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Rs. {Number(order.tax || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>Total</span>
                  <span>Rs. {Number(order.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          <div className="flex flex-col gap-3">
            <Button variant="ghost" onClick={() => navigate("/user/orders")}>
              Back to Orders
            </Button>
            {["Pending", "Processing"].includes(order.status) && (
              <Button
                variant="danger"
                onClick={confirmCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </Button>
            )}
            <Link to="/books">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
