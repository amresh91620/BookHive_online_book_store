import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  DollarSign, 
  Truck, 
  CreditCard, 
  Save, 
  RotateCcw,
  Info,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    taxRate: 0.18,
    taxName: "GST",
    taxEnabled: true,
    deliveryCharge: 50,
    freeDeliveryThreshold: 500,
    deliveryEnabled: true,
    codEnabled: true,
    onlinePaymentEnabled: true,
    razorpayKeyId: "",
    siteName: "BookHive",
    siteEmail: "",
    sitePhone: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/api/settings/admin");
      setSettings(data.settings);
      setFormData({
        taxRate: data.settings.taxRate,
        taxName: data.settings.taxName,
        taxEnabled: data.settings.taxEnabled,
        deliveryCharge: data.settings.deliveryCharge,
        freeDeliveryThreshold: data.settings.freeDeliveryThreshold,
        deliveryEnabled: data.settings.deliveryEnabled,
        codEnabled: data.settings.codEnabled,
        onlinePaymentEnabled: data.settings.onlinePaymentEnabled,
        razorpayKeyId: data.settings.razorpayKeyId || "",
        siteName: data.settings.siteName || "BookHive",
        siteEmail: data.settings.siteEmail || "",
        sitePhone: data.settings.sitePhone || "",
      });
    } catch (error) {
      console.error("Fetch settings error:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/settings", formData);
      
      // Invalidate settings cache so checkout page refetches
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      
      toast.success("Settings updated successfully!");
      fetchSettings();
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error(error?.response?.data?.msg || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all settings to default?")) {
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/settings/reset");
      
      // Invalidate settings cache
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      
      toast.success("Settings reset to default!");
      fetchSettings();
    } catch (error) {
      console.error("Reset settings error:", error);
      toast.error("Failed to reset settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page p-4 sm:p-6 lg:p-8">
        <AdminSkeleton type="settings" />
      </div>
    );
  }

  return (
    <div className="admin-page p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#d97642]" />
            Store Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage tax, delivery, and payment settings</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#d97642] hover:bg-[#c26535] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#d97642]" />
              Tax Settings
            </CardTitle>
            <CardDescription>Configure tax calculation for orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#f7f5ef] rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enable Tax</p>
                <p className="text-sm text-gray-600">Apply tax to all orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="taxEnabled"
                  checked={formData.taxEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d97642]"></div>
              </label>
            </div>

            <div>
              <Label htmlFor="taxName">Tax Name</Label>
              <Input
                id="taxName"
                name="taxName"
                value={formData.taxName}
                onChange={handleChange}
                placeholder="e.g., GST, VAT"
              />
            </div>

            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(formData.taxRate * 100).toFixed(2)}
                onChange={(e) => {
                  const percentage = parseFloat(e.target.value) || 0;
                  setFormData((prev) => ({
                    ...prev,
                    taxRate: percentage / 100,
                  }));
                }}
                placeholder="18"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {(formData.taxRate * 100).toFixed(2)}% ({formData.taxName})
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-900">
                Tax will be calculated on subtotal and added to the final amount
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#d97642]" />
              Delivery Settings
            </CardTitle>
            <CardDescription>Configure delivery charges and free shipping</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#f7f5ef] rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enable Delivery Charges</p>
                <p className="text-sm text-gray-600">Charge for delivery</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="deliveryEnabled"
                  checked={formData.deliveryEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d97642]"></div>
              </label>
            </div>

            <div>
              <Label htmlFor="deliveryCharge">Delivery Charge (₹)</Label>
              <Input
                id="deliveryCharge"
                name="deliveryCharge"
                type="number"
                min="0"
                value={formData.deliveryCharge}
                onChange={handleChange}
                placeholder="50"
              />
            </div>

            <div>
              <Label htmlFor="freeDeliveryThreshold">Free Delivery Above (₹)</Label>
              <Input
                id="freeDeliveryThreshold"
                name="freeDeliveryThreshold"
                type="number"
                min="0"
                value={formData.freeDeliveryThreshold}
                onChange={handleChange}
                placeholder="500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Orders above ₹{formData.freeDeliveryThreshold} get FREE delivery
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-900">
                Customers will see "FREE delivery" when cart value exceeds threshold
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#d97642]" />
              Payment Methods
            </CardTitle>
            <CardDescription>Enable or disable payment options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#f7f5ef] rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                <p className="text-sm text-gray-600">Pay when you receive</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="codEnabled"
                  checked={formData.codEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d97642]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#f7f5ef] rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Online Payment</p>
                <p className="text-sm text-gray-600">UPI, Cards, Net Banking</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="onlinePaymentEnabled"
                  checked={formData.onlinePaymentEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d97642]"></div>
              </label>
            </div>

            <Separator />

            <div>
              <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
              <Input
                id="razorpayKeyId"
                name="razorpayKeyId"
                value={formData.razorpayKeyId}
                onChange={handleChange}
                placeholder="rzp_test_xxxxx or rzp_live_xxxxx"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get from Razorpay Dashboard → Settings → API Keys
              </p>
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#d97642]" />
              General Settings
            </CardTitle>
            <CardDescription>Basic store information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Store Name</Label>
              <Input
                id="siteName"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                placeholder="BookHive"
              />
            </div>

            <div>
              <Label htmlFor="siteEmail">Store Email</Label>
              <Input
                id="siteEmail"
                name="siteEmail"
                type="email"
                value={formData.siteEmail}
                onChange={handleChange}
                placeholder="support@bookhive.com"
              />
            </div>

            <div>
              <Label htmlFor="sitePhone">Store Phone</Label>
              <Input
                id="sitePhone"
                name="sitePhone"
                value={formData.sitePhone}
                onChange={handleChange}
                placeholder="+91 1234567890"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Configuration Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Summary of active settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f7f5ef] rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tax</p>
              <p className="text-2xl font-bold text-gray-900">
                {formData.taxEnabled ? `${(formData.taxRate * 100).toFixed(2)}%` : "Disabled"}
              </p>
              <Badge variant={formData.taxEnabled ? "default" : "secondary"} className="mt-2">
                {formData.taxEnabled ? formData.taxName : "Off"}
              </Badge>
            </div>

            <div className="p-4 bg-[#f7f5ef] rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Delivery</p>
              <p className="text-2xl font-bold text-gray-900">
                {formData.deliveryEnabled ? `₹${formData.deliveryCharge}` : "Free"}
              </p>
              <Badge variant={formData.deliveryEnabled ? "default" : "secondary"} className="mt-2">
                Free above ₹{formData.freeDeliveryThreshold}
              </Badge>
            </div>

            <div className="p-4 bg-[#f7f5ef] rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Payment Methods</p>
              <div className="flex gap-2 mt-2">
                {formData.codEnabled && (
                  <Badge variant="default">COD</Badge>
                )}
                {formData.onlinePaymentEnabled && (
                  <Badge variant="default">Online</Badge>
                )}
                {!formData.codEnabled && !formData.onlinePaymentEnabled && (
                  <Badge variant="secondary">None</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
