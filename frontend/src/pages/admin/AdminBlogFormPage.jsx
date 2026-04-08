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
    <div className="admin-page p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin/blogs")} className="mb-6 hover:bg-amber-100 transition-colors animate-fade-in-up">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Blogs
        </Button>

        <Card className="border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-up bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b-2 border-stone-200 bg-gradient-to-r from-stone-50 to-amber-50/50">
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
              {isEdit ? "Edit Blog Post" : "New Blog Post"}
            </CardTitle>
            <p className="text-stone-600 mt-2">Fill in the details below to {isEdit ? "update" : "create"} your blog post</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Basic Info */}
              <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50/50 to-white rounded-xl border-2 border-blue-200 animate-slide-in-right stagger-1">
                <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">1</div>
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-stone-700 font-semibold">Title *</Label>
                    <Input id="title" name="title" value={form.title} onChange={handleChange} required placeholder="Enter blog title" className="mt-2 border-2 border-stone-200 focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <Label htmlFor="excerpt" className="text-stone-700 font-semibold">Excerpt * <span className="text-xs text-stone-400 font-normal">(max 300 chars)</span></Label>
                    <Textarea id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} required rows={2} maxLength={300} placeholder="Short summary shown on blog listing..." className="mt-2 border-2 border-stone-200 focus:border-blue-500 transition-colors" />
                    <p className="text-xs text-stone-400 mt-2 font-medium">{form.excerpt.length}/300 characters</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author" className="text-stone-700 font-semibold">Author *</Label>
                      <Input id="author" name="author" value={form.author} onChange={handleChange} required placeholder="Author name" className="mt-2 border-2 border-stone-200 focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-stone-700 font-semibold">Category *</Label>
                      <select
                        id="category" name="category" value={form.category} onChange={handleChange} required
                        className="flex h-10 w-full rounded-md border-2 border-stone-200 bg-white px-3 py-2 text-sm mt-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="">Select category...</option>
                        {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags" className="text-stone-700 font-semibold">Tags <span className="text-xs text-stone-400 font-normal">(comma separated)</span></Label>
                    <Input id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. fiction, mystery, bestseller" className="mt-2 border-2 border-stone-200 focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50/50 to-white rounded-xl border-2 border-purple-200 animate-slide-in-right stagger-2">
                <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">2</div>
                  Content *
                </h3>
                <p className="text-sm text-stone-600 bg-purple-100 p-3 rounded-lg border border-purple-300">
                  💡 You can use HTML tags for formatting (e.g. &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;img&gt;)
                </p>
                <Textarea
                  id="content" name="content" value={form.content} onChange={handleChange}
                  required rows={16} placeholder="Write your blog content here... HTML is supported."
                  className="font-mono text-sm border-2 border-stone-200 focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-green-50/50 to-white rounded-xl border-2 border-green-200 animate-slide-in-right stagger-3">
                <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">3</div>
                  Cover Image {!isEdit && "*"}
                </h3>
                <label
                  htmlFor="coverImage"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
                >
                  {preview || (isEdit && blog?.coverImage && !coverImage) ? (
                    <div className="relative w-full h-full">
                      <img src={preview || blog?.coverImage} alt="Cover preview" className="h-full w-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <span className="text-white font-semibold">Click to change image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-green-600 group-hover:text-green-700 transition-colors">
                      <Image className="w-12 h-12" />
                      <span className="text-base font-semibold">Click to upload cover image</span>
                      <span className="text-sm text-stone-500">PNG, JPG up to 10MB</span>
                    </div>
                  )}
                  <input id="coverImage" type="file" accept="image/*" onChange={handleFile} className="hidden" required={!isEdit} />
                </label>
              </div>

              {/* Publish Settings */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-amber-50/50 to-white rounded-xl border-2 border-amber-200 animate-scale-up stagger-4">
                <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">4</div>
                  Publish Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="status" className="text-stone-700 font-semibold">Status</Label>
                    <select
                      id="status" name="status" value={form.status} onChange={handleChange}
                      className="flex h-10 w-full rounded-md border-2 border-stone-200 bg-white px-3 py-2 text-sm mt-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="rounded w-5 h-5 border-2 border-stone-300 text-amber-600 focus:ring-amber-500" />
                    <Label htmlFor="featured" className="cursor-pointer font-semibold text-stone-700">Mark as Featured</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isPending} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-6 text-lg font-semibold">
                  {isPending ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/admin/blogs")} className="px-8 border-2 hover:border-stone-400 py-6">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

