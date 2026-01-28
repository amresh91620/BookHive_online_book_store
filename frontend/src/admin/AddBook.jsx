import React, { useState, useEffect } from "react";
import { Upload, Book, User, Tag, ArrowLeft, X, Calendar, Hash, DollarSign, Plus, Save ,Edit} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useBooks } from "../hooks/useBooks";

const AddBook = () => {
  const { id } = useParams(); // ✅ Get ID from URL if editing
  const isEditMode = Boolean(id);
  
  const navigate = useNavigate();
  const { createBook, editBook, books } = useBooks();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    categories: "", 
    description: "",
    price: "",
    publishedDate: "",
    pages: "",
    coverImage: null
  });

  // ✅ If Edit Mode, fill form with existing data
  useEffect(() => {
    if (isEditMode && books.length > 0) {
      const bookToEdit = books.find((b) => b._id === id);
      if (bookToEdit) {
        setFormData({
          title: bookToEdit.title || "",
          author: bookToEdit.author || "",
          categories: bookToEdit.categories || "",
          description: bookToEdit.description || "",
          price: bookToEdit.price || "",
          publishedDate: bookToEdit.publishedDate ? bookToEdit.publishedDate.split('T')[0] : "",
          pages: bookToEdit.pages || "",
          coverImage: null // Keep null unless user uploads a new one
        });
        if (bookToEdit.coverImage) {
          setPreview(bookToEdit.coverImage);
        }
      }
    }
  }, [id, isEditMode, books]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData({ ...formData, coverImage: file });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("description", formData.description);
      data.append("categories", formData.categories); 
      data.append("price", formData.price);
      data.append("publishedDate", formData.publishedDate);
      data.append("pages", formData.pages);
      
      // Only append image if a new one was selected
      if (formData.coverImage) {
        data.append("coverImage", formData.coverImage);
      }

      if (isEditMode) {
        await editBook(id, data); // ✅ Call Update API
        // Toast and navigation are handled in context usually, 
        // but adding here for safety if your context doesn't navigate
        navigate("/admin/books");
      } else {
        await createBook(data); // ✅ Call Add API
        toast.success("Book added successfully!");
        navigate("/admin/books");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto mb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all mb-6 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Inventory</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
            {isEditMode ? <Edit className="text-white" size={28} /> : <Plus className="text-white" size={28} />}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isEditMode ? "Update Book" : "Add New Book"}
            </h1>
            <p className="text-slate-500 font-medium">
              {isEditMode ? "Modify the details of your masterpiece" : "List a new masterpiece in your library"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Image Upload */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Upload size={20} className="text-blue-600" /> {isEditMode ? "Update Cover" : "Cover Image"}
            </h2>

            <div className={`relative aspect-[3/4] rounded-2xl border-2 flex flex-col items-center justify-center overflow-hidden group ${preview ? "border-blue-100" : "border-dashed border-slate-200 hover:border-blue-300"}`}>
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => { setPreview(null); setFormData({ ...formData, coverImage: null }); }} className="bg-white text-red-600 p-3 rounded-full">
                      <X size={24} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <Upload size={32} className="mx-auto mb-4 text-slate-400" />
                  <p className="font-bold text-slate-700">Upload Cover</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Right: Form Details */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Book Information</h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Book Title</label>
                  <div className="relative">
                    <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="title" value={formData.title} type="text" placeholder="Title" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-medium" onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Author Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="author" value={formData.author} type="text" placeholder="Author" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-medium" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="categories" value={formData.categories} type="text" placeholder="Category" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-medium" onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Release Date</label>
                  <input name="publishedDate" value={formData.publishedDate} type="date" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-medium" onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Price (₹)</label>
                  <input name="price" value={formData.price} type="number" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-medium" onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Total Pages</label>
                  <input name="pages" value={formData.pages} type="number" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-medium" onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">About the Book</label>
                <textarea name="description" value={formData.description} rows="5" className="w-full p-5 bg-slate-50 border-none rounded-[2rem] outline-none resize-none font-medium" onChange={handleChange}></textarea>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 flex justify-end items-center gap-4">
               <button type="button" onClick={() => navigate(-1)} className="px-8 py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors">
                Discard
              </button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95">
                {loading ? "Processing..." : (
                  <>
                    {isEditMode ? <Save size={20} /> : <Plus size={20} />}
                    {isEditMode ? "Update Book" : "Add to Library"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBook;