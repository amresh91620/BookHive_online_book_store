import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useUpdateProfile, useChangePassword } from "@/hooks/api/useProfile";
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/api/useAddress";
import { useOrders } from "@/hooks/api/useOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  User, 
  MapPin, 
  Edit, 
  Trash2, 
  Plus, 
  Mail, 
  Phone, 
  ShoppingBag,
  Heart,
  Package,
  Settings,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice, shortDate } from "@/utils/format";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const { data: addresses = [] } = useAddresses();
  const { data: orders = [] } = useOrders();
  const updateProfile = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  
  const [activeTab, setActiveTab] = useState("profile");

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, addressId: null });
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    updateProfile.mutate(profileForm, {
      onSuccess: () => toast.success("Profile updated successfully"),
      onError: (error) => toast.error(error?.response?.data?.msg || "Failed to update profile"),
    });
  };

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress.mutate(
        { id: editingAddress, addressData: addressForm },
        {
          onSuccess: () => {
            toast.success("Address updated successfully");
            setShowAddressForm(false);
            setEditingAddress(null);
            setAddressForm({
              fullName: "",
              phone: "",
              street: "",
              city: "",
              state: "",
              pincode: "",
            });
          },
          onError: (error) => toast.error(error?.response?.data?.msg || "Failed to update address"),
        }
      );
    } else {
      addAddress.mutate(addressForm, {
        onSuccess: () => {
          toast.success("Address added successfully");
          setShowAddressForm(false);
          setAddressForm({
            fullName: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
          });
        },
        onError: (error) => toast.error(error?.response?.data?.msg || "Failed to add address"),
      });
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address._id);
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async () => {
    if (!deleteDialog.addressId) return;
    
    deleteAddress.mutate(deleteDialog.addressId, {
      onSuccess: () => {
        toast.success("Address deleted successfully");
        setDeleteDialog({ open: false, addressId: null });
      },
      onError: (error) => toast.error(error?.response?.data?.msg || "Failed to delete address"),
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    changePasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        toast.success("Password changed successfully");
        setShowPasswordForm(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
      onError: (error) => toast.error(error?.response?.data?.msg || "Failed to change password"),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-shell max-w-7xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-amber-600 text-white text-3xl">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                {user?.phone && (
                  <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Phone className="w-4 h-4" />
                    {user?.phone}
                  </p>
                )}
                <Badge className="mt-3 bg-amber-100 text-amber-700 hover:bg-amber-200">
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/orders">
                  <Button variant="outline" size="sm">
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col p-2 space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "profile"
                      ? "bg-amber-50 text-amber-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "addresses"
                      ? "bg-amber-50 text-amber-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "orders"
                      ? "bg-amber-50 text-amber-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "security"
                      ? "bg-amber-50 text-amber-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Security
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-gray-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500">Email address cannot be changed</p>
                      </div>

                      <Separator />

                      <div className="flex justify-end">
                        <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setShowAddressForm(true);
                      setEditingAddress(null);
                      setAddressForm({
                        fullName: "",
                        phone: "",
                        street: "",
                        city: "",
                        state: "",
                        pincode: "",
                      });
                    }}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddressForm && (
                  <Card className="mb-6 border-2 border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {editingAddress ? "Edit Address" : "Add New Address"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              value={addressForm.fullName}
                              onChange={handleAddressChange}
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={addressForm.phone}
                              onChange={handleAddressChange}
                              placeholder="+1 (555) 000-0000"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address *</Label>
                          <Input
                            id="street"
                            name="street"
                            value={addressForm.street}
                            onChange={handleAddressChange}
                            placeholder="123 Main Street, Apt 4B"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              name="city"
                              value={addressForm.city}
                              onChange={handleAddressChange}
                              placeholder="New York"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              name="state"
                              value={addressForm.state}
                              onChange={handleAddressChange}
                              placeholder="NY"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode *</Label>
                            <Input
                              id="pincode"
                              name="pincode"
                              value={addressForm.pincode}
                              onChange={handleAddressChange}
                              placeholder="10001"
                              required
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="flex gap-3">
                          <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {editingAddress ? "Update" : "Save"} Address
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowAddressForm(false);
                              setEditingAddress(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <Card key={address._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-50 rounded-lg">
                              <MapPin className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{address.fullName}</p>
                              <p className="text-sm text-gray-600">{address.phone}</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {address.street}<br />
                          {address.city}, {address.state}<br />
                          {address.pincode}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteDialog({ open: true, addressId: address._id })}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {addresses.length === 0 && !showAddressForm && (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-600 mb-4">Add your first delivery address</p>
                    <Button
                      onClick={() => setShowAddressForm(true)}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your recent orders</CardDescription>
              </CardHeader>
              <CardContent>
                {!orders || orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                    <Link to="/books">
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Browse Books
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 2).map((order) => (
                      <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                Order #{order.orderNumber}
                              </h3>
                              <Badge 
                                variant={
                                  order.status === "Delivered" ? "success" :
                                  order.status === "Cancelled" ? "destructive" :
                                  "default"
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {shortDate(order.createdAt)} Ã¢â‚¬Â¢ {order.items.length} items
                            </p>
                          </div>
                          <div className="mt-3 md:mt-0 text-right">
                            <p className="text-xl font-bold text-amber-600">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                          {order.items.slice(0, 4).map((item, index) => (
                            <img
                              key={index}
                              src={item.coverImage}
                              alt={item.title}
                              className="w-12 h-16 object-cover rounded flex-shrink-0"
                            />
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-gray-600">
                                +{order.items.length - 4}
                              </span>
                            </div>
                          )}
                        </div>

                        <Link to={`/orders/${order._id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ))}

                    {orders.length > 2 && (
                      <div className="text-center pt-4">
                        <Link to="/orders">
                          <Button variant="outline" className="w-full">
                            View All {orders.length} Orders
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Change Password Section */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Password</h3>
                        <p className="text-sm text-gray-600">Update your password regularly for security</p>
                      </div>
                      {!showPasswordForm && (
                        <Button 
                          variant="outline"
                          onClick={() => setShowPasswordForm(true)}
                        >
                          Change Password
                        </Button>
                      )}
                    </div>

                    {showPasswordForm && (
                      <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordForm.currentPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter current password"
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={passwordForm.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter new password"
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Password must be at least 6 characters
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordForm.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="Confirm new password"
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                            Update Password
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPasswordForm({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Account Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">Account Status</h3>
                      <p className="text-sm text-gray-600">Your account is active and verified</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>

        {/* Delete Address Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, addressId: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Address</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this address? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, addressId: null })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAddress}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
