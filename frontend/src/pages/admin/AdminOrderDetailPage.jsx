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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-shell">
        <Button variant="ghost" onClick={() => navigate("/admin/orders")} className="mb-6">
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

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" />
                  <CardTitle>Customer Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Name: </span>
                    <span className="font-medium">{order.user?.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email: </span>
                    <span className="font-medium">{order.user?.email || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
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

            {/* Update Order Status */}
            {order.status !== "Cancelled" && order.status !== "Delivered" && (
              <Card>
                <CardHeader>
                  <CardTitle>Update Order Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Order Status</Label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {order.status} → Select next status
                    </p>
                  </div>

                  {(selectedStatus === "Shipped" || order.status === "Shipped") && (
                    <>
                      <div>
                        <Label>Tracking Number *</Label>
                        <Input
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                          required
                        />
                      </div>
                      <div>
                        <Label>Carrier *</Label>
                        <Input
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          placeholder="e.g., FedEx, UPS, DHL, India Post"
                        />
                      </div>
                      <div>
                        <Label>Tracking URL (Optional)</Label>
                        <Input
                          value={trackingUrl}
                          onChange={(e) => setTrackingUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label>Note (Optional)</Label>
                    <Textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add a note about this status update..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleUpdateOrder}
                    disabled={updating || (selectedStatus === "Shipped" && (!trackingNumber || !carrier))}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    {updating ? "Updating..." : `Update to ${selectedStatus}`}
                  </Button>
                  
                  {selectedStatus === "Shipped" && (!trackingNumber || !carrier) && (
                    <p className="text-sm text-red-600">
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

            {/* Tracking Info */}
            {order.tracking && (order.tracking.trackingNumber || order.tracking.carrier) && (
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.tracking.carrier && (
                      <div>
                        <span className="text-gray-600">Carrier: </span>
                        <span className="font-medium">{order.tracking.carrier}</span>
                      </div>
                    )}
                    {order.tracking.trackingNumber && (
                      <div>
                        <span className="text-gray-600">Tracking #: </span>
                        <span className="font-medium">{order.tracking.trackingNumber}</span>
                      </div>
                    )}
                    {order.tracking.trackingUrl && (
                      <a
                        href={order.tracking.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:underline text-sm"
                      >
                        Track Package
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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
