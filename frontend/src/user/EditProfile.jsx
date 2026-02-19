import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { Card, Button, Input } from "../components/ui";
import { ImageCropper } from "../components/common";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [file, setFile] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setPreview(user?.profileImage || "");
  }, [user]);

  useEffect(() => {
    if (!file) return undefined;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) {
      return;
    }
    setRawFile(selected);
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      if (file) {
        formData.append("profileImage", file);
      }
      const res = await updateProfile(formData);
      toast.success(res?.msg || "Profile updated");
      setFile(null);
    } catch (error) {
      const msg =
        error.response?.data?.msg || "Failed to update profile. Try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const fallbackInitial =
    (form.name || user?.email || "U").trim().charAt(0).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card variant="elevated" padding="lg">
        <Card.Header>
          <Card.Title>Edit Profile</Card.Title>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{fallbackInitial}</span>
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:border-slate-300">
                  <Camera size={16} />
                  Upload photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-500">
                  JPG/PNG format, max size 5MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
              <Input
                label="Mobile Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => {
                  setForm({
                    name: user?.name || "",
                    phone: user?.phone || "",
                  });
                  setPreview(user?.profileImage || "");
                  setFile(null);
                  setRawFile(null);
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
      <ImageCropper
        file={rawFile}
        onCancel={() => setRawFile(null)}
        onComplete={(croppedFile) => {
          setFile(croppedFile);
          setRawFile(null);
        }}
      />
    </div>
  );
};

export default EditProfile;
