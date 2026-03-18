import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogDetails, useCreateBlog, useUpdateBlog } from "@/hooks/api/useBlogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Image } from "lucide-react";
import toast from "react-hot-toast";

const BLOG_CATEGORIES = [
  "Book Reviews", "Reading Tips", "Author Spotlight", "Genre Guide",
  "Book Lists", "Literary News", "Writing Tips", "Bookshelf Tours", "Other",
];

export default function AdminBlogFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: blog } = useBlogDetails(id);
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "",
    status: "draft",
    featured: false,
  });
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isEdit && blog) {
      setForm({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || "",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
        author: blog.author || "",
        status: blog.status || "draft",
        featured: blog.featured || false,
      });
    }
  }, [blog, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (coverImage) payload.coverImage = coverImage;

    if (isEdit) {
      updateBlog.mutate({ id, payload }, {
        onSuccess: () => { toast.success("Blog updated"); navigate("/admin/blogs"); },
        onError: (err) => toast.error(err?.response?.data?.msg || "Update failed"),
      });
    } else {
      createBlog.mutate(payload, {
        onSuccess: () => { toast.success("Blog created"); navigate("/admin/blogs"); },
        onError: (err) => toast.error(err?.response?.data?.msg || "Create failed"),
      });
    }
  };

  const isPending = createBlog.isPending || updateBlog.isPending;

  return (
    <div className="p-6">
      <Button variant="ghost" onClick={() => navigate("/admin/blogs")} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />Back to Blogs
      </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Edit Blog Post" : "New Blog Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" value={form.title} onChange={handleChange} required placeholder="Enter blog title" />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt * <span className="text-xs text-gray-400">(max 300 chars)</span></Label>
                  <Textarea id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} required rows={2} maxLength={300} placeholder="Short summary shown on blog listing..." />
                  <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/300</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author *</Label>
                    <Input id="author" name="author" value={form.author} onChange={handleChange} required placeholder="Author name" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category" name="category" value={form.category} onChange={handleChange} required
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
                    >
                      <option value="">Select category...</option>
                      {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags <span className="text-xs text-gray-400">(comma separated)</span></Label>
                  <Input id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. fiction, mystery, bestseller" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">Content *</h3>
                <p className="text-xs text-gray-500">You can use HTML tags for formatting (e.g. &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;img&gt;)</p>
                <Textarea
                  id="content" name="content" value={form.content} onChange={handleChange}
                  required rows={16} placeholder="Write your blog content here... HTML is supported."
                  className="font-mono text-sm"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Cover Image {!isEdit && "*"}</h3>
                <label
                  htmlFor="coverImage"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors"
                >
                  {preview || (isEdit && blog?.coverImage && !coverImage) ? (
                    <img src={preview || blog?.coverImage} alt="Cover preview" className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Image className="w-8 h-8" />
                      <span className="text-sm">Click to upload cover image</span>
                    </div>
                  )}
                  <input id="coverImage" type="file" accept="image/*" onChange={handleFile} className="hidden" required={!isEdit} />
                </label>
              </div>

              {/* Publish Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Publish Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status" name="status" value={form.status} onChange={handleChange}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="rounded w-4 h-4" />
                    <Label htmlFor="featured" className="cursor-pointer">Mark as Featured</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isPending} className="bg-amber-600 hover:bg-amber-700">
                  {isPending ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/admin/blogs")}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
