import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderById, useCancelOrder } from "@/hooks/api/useOrders";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrderById(id);
  const cancelOrder = useCancelOrder();
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    cancelOrder.mutate(
      { id, reason: cancelReason },
      {
        onSuccess: () => {
          toast.success("Order cancelled successfully");
          setShowCancelForm(false);
          setCancelReason("");
        },
        onError: (error) => toast.error(error?.response?.data?.msg || "Failed to cancel order"),
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-10 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="space-y-6">
            <LoadingSkeleton type="detail" count={1} />
            <LoadingSkeleton type="list" count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <Button onClick={() => navigate("/orders")}>View All Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-shell">
        <Button variant="ghost" onClick={() => navigate("/orders")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Placed on {shortDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(order.status)} className="mt-2 md:mt-0">
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.author}</p>
                        <p className="text-sm text-gray-900 mt-2">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <CardTitle>Delivery Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-gray-900">{order.address.fullName}</p>
                <p className="text-gray-600">{order.address.phone}</p>
                <p className="text-gray-600 mt-2">
                  {order.address.street}
                  <br />
                  {order.address.city}, {order.address.state}
                  <br />
                  {order.address.pincode}
                </p>
              </CardContent>
            </Card>

            {/* Cancel Order */}
            {(order.status === "Pending" || order.status === "Processing") && (
              <Card>
                <CardContent className="pt-6">
                  {!showCancelForm ? (
                    <Button
                      variant="destructive"
                      onClick={() => setShowCancelForm(true)}
                      className="w-full"
                    >
                      Cancel Order
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Reason for cancellation
                        </label>
                        <Textarea
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Please tell us why you want to cancel this order..."
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleCancelOrder}>
                          Confirm Cancellation
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowCancelForm(false);
                            setCancelReason("");
                          }}
                        >
                          Keep Order
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                    </span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">{formatPrice(order.tax)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-amber-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <CardTitle>Payment Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-600" />
                    <CardTitle>Order Timeline</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.statusHistory.map((history, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                          {index < order.statusHistory.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-gray-900">{history.status}</p>
                          <p className="text-sm text-gray-600">
                            {shortDate(history.at)}
                          </p>
                          {history.note && (
                            <p className="text-sm text-gray-500 mt-1">{history.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
