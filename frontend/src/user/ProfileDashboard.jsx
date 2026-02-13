import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Bell,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Package,
} from "lucide-react";
import { Card, Button, Badge } from "../components/ui";
import { EmptyState } from "../components/common";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";
import { useAddress } from "../hooks/useAddress";
import { getMyOrdersApi } from "../services/orderApi";

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const { items: wishlist } = useWishlist();
  const { addresses } = useAddress();
  const paymentMethods = [];

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrdersApi();
        setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (error) {
        setOrders([]);
      }
    };
    loadOrders();
  }, []);

  const statusColor = useMemo(
    () => ({
      Pending: "warning",
      Processing: "primary",
      Shipped: "secondary",
      Delivered: "success",
      Cancelled: "danger",
    }),
    []
  );

  const stats = [
    {
      label: "Total Orders",
      value: String(orders.length),
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      label: "Wishlist Items",
      value: String(wishlist.length),
      icon: Heart,
      color: "text-pink-600",
    },
    {
      label: "Saved Addresses",
      value: String(addresses.length),
      icon: MapPin,
      color: "text-green-600",
    },
    {
      label: "Payment Methods",
      value: String(paymentMethods.length),
      icon: CreditCard,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-slate-100 rounded-xl ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card variant="elevated" padding="lg">
          <Card.Header>
            <Card.Title>Recent Orders</Card.Title>
          </Card.Header>
          <Card.Content>
            {orders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No orders yet"
                description="Your recent orders will show up here once you start shopping."
              />
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => {
                  const firstItem = order.items?.[0];
                  const title = firstItem?.title || "Order items";
                  const orderCode = String(order._id)
                    .slice(-6)
                    .toUpperCase();
                  return (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">
                          {title}
                        </p>
                        <p className="text-xs text-slate-500">
                          Order #{orderCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          â‚¹{Number(order.total || 0).toLocaleString()}
                        </p>
                        <Badge
                          variant={statusColor[order.status] || "secondary"}
                          size="sm"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <Link to="/user/orders">
              <Button variant="ghost" size="sm" fullWidth className="mt-4">
                View All Orders â†’
              </Button>
            </Link>
          </Card.Content>
        </Card>

        {/* Wishlist */}
        <Card variant="elevated" padding="lg">
          <Card.Header>
            <Card.Title>Wishlist</Card.Title>
          </Card.Header>
          <Card.Content>
            {wishlist.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Wishlist is empty"
                description="Save books you love to keep track of them here."
              />
            ) : (
              <div className="space-y-3">
                {wishlist.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-slate-900">
                      {item.title}
                    </span>
                    <span className="font-bold text-slate-900">
                      â‚¹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/user/wishlist">
              <Button variant="ghost" size="sm" fullWidth className="mt-4">
                View Wishlist â†’
              </Button>
            </Link>
          </Card.Content>
        </Card>

        {/* Address Book */}
        <Card variant="elevated" padding="lg">
          <Card.Header>
            <Card.Title>Address Book</Card.Title>
          </Card.Header>
          <Card.Content>
            {addresses.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No saved addresses"
                description="Add a delivery address to speed up checkout."
              />
            ) : (
              <div className="p-4 bg-slate-50 rounded-lg mb-4">
                <Badge variant="primary" size="sm" className="mb-2">
                  Default Address
                </Badge>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {addresses[0]?.fullName || user?.name || "Reader"}
                  <br />
                  {addresses[0]?.street}
                  <br />
                  {addresses[0]?.city}, {addresses[0]?.state} -{" "}
                  {addresses[0]?.pincode}
                  <br />
                  {addresses[0]?.phone}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Link to="/user/address" className="flex-1">
                <Button variant="success" size="sm" fullWidth>
                  Add New
                </Button>
              </Link>
              <Link to="/user/address" className="flex-1">
                <Button variant="warning" size="sm" fullWidth>
                  Edit
                </Button>
              </Link>
            </div>
          </Card.Content>
        </Card>

        {/* Payment Methods */}
        <Card variant="elevated" padding="lg">
          <Card.Header>
            <Card.Title>Payment Methods</Card.Title>
          </Card.Header>
          <Card.Content>
            {paymentMethods.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No payment methods"
                description="Add a payment method to make checkout faster."
              />
            ) : (
              <div className="space-y-2 mb-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700"
                  >
                    {method.label}
                  </div>
                ))}
              </div>
            )}
            <Link to="/user/payments">
              <Button variant="ghost" size="sm" fullWidth>
                Manage Payments â†’
              </Button>
            </Link>
          </Card.Content>
        </Card>
      </div>

      {/* Account Settings */}
      <Card variant="elevated" padding="lg">
        <Card.Header>
          <Card.Title>Account Settings</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-2">
            <Button variant="ghost" fullWidth className="justify-between">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-slate-500" />
                <span>Change Password</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Button>
            <Button variant="ghost" fullWidth className="justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-slate-500" />
                <span>Manage Notifications</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Button>
            <Button
              variant="danger"
              fullWidth
              className="justify-between hover:bg-red-50"
              onClick={logout}
              disabled={!user}
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} />
                <span>Logout</span>
              </div>
              <ChevronRight size={18} />
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Profile;
