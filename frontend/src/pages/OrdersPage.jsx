import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useOrders, useCancelOrder } from "@/hooks/api/useOrders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Package, Eye, X, ShoppingBag } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const STATUS_STYLES = {
  Pending:    { pill: "bg-amber-100 text-amber-700 border border-amber-200",    dot: "bg-amber-400" },
  Processing: { pill: "bg-blue-100 text-blue-700 border border-blue-200",       dot: "bg-blue-400" },
  Shipped:    { pill: "bg-purple-100 text-purple-700 border border-purple-200", dot: "bg-purple-400" },
  Delivered:  { pill: "bg-green-100 text-green-700 border border-green-200",    dot: "bg-green-500" },
  Cancelled:  { pill: "bg-red-100 text-red-600 border border-red-200",          dot: "bg-red-400" },
};

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

  /* ── Not logged in ──────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-24 h-24 rounded-full bg-[#fef3ed] flex items-center justify-center mx-auto mb-6"
            style={{ boxShadow: '0 0 0 8px rgba(217,118,66,0.08)' }}
          >
            <Package className="w-12 h-12 text-[#d97642]" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-3">Please log in</h2>
          <p className="text-stone-600 mb-8 font-light">You need to be logged in to view your orders</p>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-[#d97642] to-[#e08550] hover:from-[#c26535] hover:to-[#d97642] text-white px-8 py-6 h-auto text-base font-semibold shadow-md rounded-xl">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ── Loading skeleton ───────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] py-8 sm:py-12">
        <div className="container-shell">
          {/* Header skeleton */}
          <div className="mb-8 animate-fade-in-up">
            <div className="h-10 w-44 skeleton-wave rounded-xl mb-2" />
            <div className="h-4 w-28 skeleton-wave rounded" />
          </div>

          {/* Order card skeletons */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#f0e4d6] p-6 animate-fade-in-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  boxShadow: '0 4px 20px rgba(217,118,66,0.05)',
                }}
              >
                {/* Order header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-36 skeleton-wave rounded" />
                      <div className="h-6 w-24 skeleton-wave-orange rounded-full" />
                    </div>
                    <div className="h-4 w-44 skeleton-wave rounded" />
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="h-8 w-28 skeleton-wave-orange rounded ml-auto" />
                    <div className="h-4 w-16 skeleton-wave rounded ml-auto" />
                  </div>
                </div>

                {/* Divider + book thumbnails */}
                <div className="border-t border-[#f5ece3] pt-4 pb-4 mb-4">
                  <div className="flex gap-3 overflow-hidden">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="w-12 h-16 skeleton-wave rounded flex-shrink-0" />
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="border-t border-[#f5ece3] pt-4 mb-4 space-y-1.5">
                  <div className="h-4 skeleton-wave rounded w-28" />
                  <div className="h-3 skeleton-wave rounded w-full" />
                  <div className="h-3 skeleton-wave rounded w-4/5" />
                </div>

                {/* Action button */}
                <div className="flex gap-2">
                  <div className="h-9 w-32 skeleton-wave rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ──────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Failed to load orders</h2>
          <p className="text-stone-600 mb-6">{error?.response?.data?.msg || "Something went wrong"}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#d97642] to-[#e08550] hover:from-[#c26535] hover:to-[#d97642] text-white rounded-xl"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  /* ── Empty state ────────────────────────────────────────────── */
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-sm">
          <div
            className="w-24 h-24 rounded-full bg-[#fef3ed] flex items-center justify-center mx-auto mb-6"
            style={{ boxShadow: '0 0 0 8px rgba(217,118,66,0.08)' }}
          >
            <ShoppingBag className="w-12 h-12 text-[#d97642]" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-3">No orders yet</h2>
          <p className="text-stone-600 mb-8 font-light leading-relaxed">
            Start shopping to see your orders here. Thousands of great books await!
          </p>
          <Link to="/books">
            <Button className="bg-gradient-to-r from-[#d97642] to-[#e08550] hover:from-[#c26535] hover:to-[#d97642] text-white px-8 py-6 h-auto text-base font-semibold shadow-md rounded-xl">
              Browse Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ── Orders list ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f7f5ef] py-8 sm:py-12">
      <div className="container-shell">
        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-8 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-1 flex items-center gap-3">
            <Package className="w-8 h-8 text-[#d97642]" />
            My Orders
          </h1>
          <p className="text-stone-600 font-light">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {orders.map((order, index) => {
            const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-[#f0e4d6] p-6 transition-all duration-700 hover:border-[#d97642]/30 hover:shadow-lg"
                style={{
                  opacity: headerVisible ? 1 : 0,
                  transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${index * 100}ms`,
                  boxShadow: '0 4px 20px rgba(217,118,66,0.05)',
                }}
              >
                {/* Order header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-stone-900">
                        Order <span className="font-mono text-[#d97642]">#{order.orderNumber}</span>
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${statusStyle.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">
                      Placed on {shortDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#d97642]">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-sm text-stone-500">{order.items.length} items</p>
                  </div>
                </div>

                {/* Book thumbnails */}
                <div className="border-t border-[#f5ece3] pt-4 pb-4 mb-4">
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {order.items.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex-shrink-0">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-12 h-16 object-cover rounded-lg"
                          style={{ boxShadow: '2px 3px 8px rgba(0,0,0,0.12)' }}
                        />
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <div className="flex-shrink-0 w-12 h-16 bg-[#fef3ed] rounded-lg flex items-center justify-center border border-[#f3dccc]">
                        <span className="text-xs font-semibold text-[#d97642]">
                          +{order.items.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery address */}
                <div className="border-t border-[#f5ece3] pt-4 mb-5">
                  <p className="text-sm font-semibold text-stone-700 mb-1">Delivery Address</p>
                  <p className="text-sm text-stone-600">
                    {order.address.fullName}, {order.address.phone}
                  </p>
                  <p className="text-sm text-stone-600">
                    {order.address.street}, {order.address.city}, {order.address.state} — {order.address.pincode}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <Link to={`/orders/${order._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#f0e4d6] text-stone-700 hover:border-[#d97642] hover:text-[#d97642] transition-all rounded-lg"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      View Details
                    </Button>
                  </Link>
                  {(order.status === "Pending" || order.status === "Processing") && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => setCancelDialog({ open: true, orderId: order._id })}
                    >
                      <X className="w-4 h-4 mr-1.5" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancel dialog */}
        <Dialog
          open={cancelDialog.open}
          onOpenChange={(open) => setCancelDialog({ open, orderId: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <p className="text-sm text-stone-600 mt-2">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
            </DialogHeader>
            <div className="space-y-4">
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
              <Button variant="destructive" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
