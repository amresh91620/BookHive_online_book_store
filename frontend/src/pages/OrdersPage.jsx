import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useOrders, useCancelOrder } from "@/hooks/api/useOrders";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Package, Eye, X } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function OrdersPage() {
  const { user } = useSelector((state) => state.auth);
  const { data: orders = [], isLoading, error } = useOrders();
  const cancelOrder = useCancelOrder();
  const [cancelDialog, setCancelDialog] = useState({ open: false, orderId: null });
  const [cancelReason, setCancelReason] = useState("");
  
  const [headerRef, headerVisible] = useScrollAnimation();

  const handleCancelOrder = async () => {
    if (!cancelDialog.orderId) return;
    
    cancelOrder.mutate(
      { id: cancelDialog.orderId, reason: cancelReason },
      {
        onSuccess: () => {
          toast.success("Order cancelled successfully");
          setCancelDialog({ open: false, orderId: null });
          setCancelReason("");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.msg || "Failed to cancel order");
        },
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders</p>
          <Link to="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="space-y-4">
            <LoadingSkeleton type="list" count={5} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load orders</h2>
          <p className="text-gray-600 mb-6">{error?.response?.data?.msg || "Something went wrong"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <Link to="/books">
            <Button>Browse Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-shell">
        <h1
          ref={headerRef}
          className={`text-3xl font-bold text-gray-900 mb-8 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          My Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <Card
              key={order._id}
              className="p-6 transition-all duration-700"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order <span className="font-sans">#{order.orderNumber}</span>
                    </h3>
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {shortDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-2xl font-bold text-amber-600">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-sm text-gray-600">{order.items.length} items</p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="border-t pt-4 mb-4">
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex-shrink-0">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex-shrink-0 w-16 h-20 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-sm text-gray-600">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border-t pt-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address</p>
                <p className="text-sm text-gray-600">
                  {order.address.fullName}, {order.address.phone}
                </p>
                <p className="text-sm text-gray-600">
                  {order.address.street}, {order.address.city}, {order.address.state} -{" "}
                  {order.address.pincode}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link to={`/orders/${order._id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </Link>
                {(order.status === "Pending" || order.status === "Processing") && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setCancelDialog({ open: true, orderId: order._id })}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel Order
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Cancel Order Dialog */}
        <Dialog open={cancelDialog.open} onOpenChange={(open) => setCancelDialog({ open, orderId: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Reason for cancellation (optional)
                </label>
                <Textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please tell us why you're cancelling..."
                  rows={3}
                  maxLength={200}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCancelDialog({ open: false, orderId: null });
                  setCancelReason("");
                }}
              >
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
              >
                Cancel Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

