import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, MapPin, CreditCard, User } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Status update form
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  
  // Tracking info
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(endpoints.admin.order(id));
      setOrder(data.order);
      setSelectedStatus(data.order.status);
      setTrackingNumber(data.order.tracking?.trackingNumber || "");
      setCarrier(data.order.tracking?.carrier || "");
      setTrackingUrl(data.order.tracking?.trackingUrl || "");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to fetch order");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      setUpdating(true);
      const payload = {
        status: selectedStatus,
        note: statusNote.trim() || undefined,
        trackingNumber: trackingNumber.trim() || undefined,
        carrier: carrier.trim() || undefined,
        trackingUrl: trackingUrl.trim() || undefined,
      };

      await api.put(endpoints.admin.updateOrderStatus(id), payload);
      toast.success("Order updated successfully");
      setStatusNote("");
      fetchOrderDetail();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to update order");
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
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
          <Button onClick={() => navigate("/admin/orders")}>View All Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin/orders")} className="mb-6 hover:bg-amber-100 transition-colors animate-fade-in-up">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card className="border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent mb-2">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-stone-600">
                      Placed on {shortDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(order.status)} className="mt-2 md:mt-0 shadow-sm text-sm px-4 py-2">
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Customer Info */}
            <Card className="border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right stagger-1 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-md">
                    <User className="w-5 h-5 text-amber-700" />
                  </div>
                  <CardTitle className="text-xl font-bold text-stone-900">Customer Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-stone-600 min-w-[60px]">Name:</span>
                    <span className="font-semibold text-stone-900">{order.user?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-stone-600 min-w-[60px]">Email:</span>
                    <span className="font-semibold text-stone-900 break-all">{order.user?.email || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right stagger-2 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-stone-900">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-0 hover:bg-amber-50/50 p-3 rounded-lg transition-colors">
                      <div className="w-16 h-24 sm:w-20 sm:h-28 flex-shrink-0">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover rounded shadow-md"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/120x160?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-stone-900 line-clamp-2">{item.title}</h4>
                        <p className="text-sm text-stone-600 mt-1">{item.author}</p>
                        <p className="text-sm text-stone-900 mt-2 font-semibold">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg text-amber-700">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right stagger-3 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-md">
                    <MapPin className="w-5 h-5 text-amber-700" />
                  </div>
                  <CardTitle className="text-xl font-bold text-stone-900">Delivery Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-bold text-stone-900 text-lg">{order.address.fullName}</p>
                  <p className="text-stone-700 font-semibold">{order.address.phone}</p>
                  <p className="text-stone-600 mt-3 leading-relaxed">
                    {order.address.street}<br />
                    {order.address.city}, {order.address.state}<br />
                    {order.address.pincode}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Update Order Status */}
            {order.status !== "Cancelled" && order.status !== "Delivered" && (
              <Card className="border-2 border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-up stagger-4 bg-gradient-to-br from-amber-50/50 to-white backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-stone-900">Update Order Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-stone-700 font-semibold">Order Status</Label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full mt-2 px-4 py-3 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white font-medium"
                    >
                      {ORDER_STATUSES.filter(status => {
                        // Filter out invalid status transitions
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
                    <p className="text-xs text-stone-500 mt-2 font-medium">
                      Current: {order.status} ? Select next status
                    </p>
                  </div>

                  {(selectedStatus === "Shipped" || order.status === "Shipped") && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div>
                        <Label className="text-stone-700 font-semibold">Tracking Number *</Label>
                        <Input
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                          required
                          className="mt-2 border-2 border-stone-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label className="text-stone-700 font-semibold">Carrier *</Label>
                        <Input
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          placeholder="e.g., FedEx, UPS, DHL, India Post"
                          className="mt-2 border-2 border-stone-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label className="text-stone-700 font-semibold">Tracking URL (Optional)</Label>
                        <Input
                          value={trackingUrl}
                          onChange={(e) => setTrackingUrl(e.target.value)}
                          placeholder="https://..."
                          className="mt-2 border-2 border-stone-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-stone-700 font-semibold">Note (Optional)</Label>
                    <Textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add a note about this status update..."
                      rows={3}
                      className="mt-2 border-2 border-stone-200 focus:border-amber-500"
                    />
                  </div>

                  <Button
                    onClick={handleUpdateOrder}
                    disabled={updating || (selectedStatus === "Shipped" && (!trackingNumber || !carrier))}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-6 text-lg font-semibold"
                  >
                    {updating ? "Updating..." : `Update to ${selectedStatus}`}
                  </Button>
                  
                  {selectedStatus === "Shipped" && (!trackingNumber || !carrier) && (
                    <p className="text-sm text-red-600 font-medium">
                      * Tracking number and carrier are required for shipped status
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card className="border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-stone-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Subtotal</span>
                    <span className="font-bold text-stone-900">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Shipping</span>
                    <span className="font-bold text-stone-900">
                      {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                    </span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 font-medium">Tax</span>
                      <span className="font-bold text-stone-900">{formatPrice(order.tax)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-stone-200 pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-stone-900">Total</span>
                    <span className="text-2xl font-bold text-amber-700">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right stagger-1 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-md">
                    <CreditCard className="w-5 h-5 text-amber-700" />
                  </div>
                  <CardTitle className="text-xl font-bold text-stone-900">Payment Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Method</span>
                    <span className="font-bold text-stone-900">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Status</span>
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Info */}
            {order.tracking && (order.tracking.trackingNumber || order.tracking.carrier) && (
              <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-up stagger-2 bg-gradient-to-br from-blue-50/50 to-white backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-stone-900">Tracking Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.tracking.carrier && (
                      <div>
                        <span className="text-stone-600 font-medium">Carrier: </span>
                        <span className="font-bold text-stone-900">{order.tracking.carrier}</span>
                      </div>
                    )}
                    {order.tracking.trackingNumber && (
                      <div>
                        <span className="text-stone-600 font-medium">Tracking #: </span>
                        <span className="font-bold text-stone-900">{order.tracking.trackingNumber}</span>
                      </div>
                    )}
                    {order.tracking.trackingUrl && (
                      <a
                        href={order.tracking.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        Track Package ?
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <Card className="border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-up stagger-3 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-md">
                      <Package className="w-5 h-5 text-amber-700" />
                    </div>
                    <CardTitle className="text-xl font-bold text-stone-900">Order Timeline</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.statusHistory.map((history, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 shadow-md"></div>
                          {index < order.statusHistory.length - 1 && (
                            <div className="w-0.5 h-full bg-stone-300 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-bold text-stone-900">{history.status}</p>
                          <p className="text-sm text-stone-600 font-medium mt-1">
                            {shortDate(history.at)}
                          </p>
                          {history.note && (
                            <p className="text-sm text-stone-500 mt-2 italic">{history.note}</p>
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

