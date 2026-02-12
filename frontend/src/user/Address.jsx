import { useEffect, useMemo, useState } from "react";
import { MapPin, Edit2, Trash2, Plus, Save } from "lucide-react";
import { Card, Button, Badge, Input } from "../components/ui";
import { EmptyState } from "../components/common";
import { useAddress } from "../hooks/useAddress";

const initialForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

const Address = () => {
  const { addresses, loading, addAddress, updateAddress, deleteAddress } = useAddress();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const isEditing = Boolean(editingId);
  const canSubmit = Object.values(form).every((value) => String(value).trim().length > 0);

  useEffect(() => {
    if (!isEditing) return;
    const selected = addresses.find((addr) => addr._id === editingId);
    if (selected) {
      setForm({
        fullName: selected.fullName || "",
        phone: selected.phone || "",
        street: selected.street || "",
        city: selected.city || "",
        state: selected.state || "",
        pincode: selected.pincode || "",
      });
    }
  }, [editingId, addresses, isEditing]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    if (isEditing) {
      const result = await updateAddress(editingId, form);
      if (result?.ok) resetForm();
      return;
    }

    const result = await addAddress(form);
    if (result?.ok) resetForm();
  };

  const addressLines = (address) =>
    [
      address.street,
      `${address.city}, ${address.state}`,
      address.pincode,
      address.phone,
    ].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <Card variant="elevated" padding="lg">
        <Card.Header>
          <Card.Title>{isEditing ? "Edit Address" : "Add New Address"}</Card.Title>
          <Card.Description>
            Keep your delivery information up to date for faster checkout.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Enter full name"
              required
            />
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Enter phone number"
              required
            />
            <Input
              label="Street Address"
              name="street"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              placeholder="House, street, area"
              required
            />
            <Input
              label="City"
              name="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="City"
              required
            />
            <Input
              label="State"
              name="state"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              placeholder="State"
              required
            />
            <Input
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              placeholder="Postal code"
              required
            />

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <Button
                type="submit"
                variant="primary"
                icon={isEditing ? Save : Plus}
                disabled={!canSubmit || loading}
              >
                {isEditing ? "Save Changes" : "Add Address"}
              </Button>
              {isEditing && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card.Content>
      </Card>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No saved addresses"
            description="Add a delivery address to speed up checkout."
          />
        ) : (
          addresses.map((address, index) => (
            <Card key={address._id} variant="default" padding="lg" hover>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" size="sm">
                      Address {index + 1}
                    </Badge>
                    {index === 0 && (
                      <Badge variant="primary" size="sm">
                        PRIMARY
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{address.fullName}</p>
                    <div className="text-sm text-slate-600 space-y-1">
                      {addressLines(address).map((line, lineIndex) => (
                        <p key={`${address._id}-line-${lineIndex}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit2}
                    onClick={() => setEditingId(address._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => deleteAddress(address._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Address;
