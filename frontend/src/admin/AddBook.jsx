import React, { useState, useEffect } from "react";
import { Upload, Book, User, Tag, ArrowLeft, X, Calendar, Hash, DollarSign, Plus, Save, Edit, Package, Star, Award } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useBooks } from "../hooks/useBooks";

const AddBook = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const navigate = useNavigate();
  const { createBook, editBook, books } = useBooks();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    author: "",
    isbn: "",
    description: "",
    
    // Pricing
    price: "",
    originalPrice: "",
    
    // Physical Details
    pages: "",
    language: "English",
    format: "Paperback",
    edition: "",
    
    // Publication
    publisher: "",
    publishedDate: "",
    
    // Categorization
    categories: "",
    genre: "",
    ageGroup: "",
    
    // Inventory
    stock: "",
    
    // Marketing
    featured: false,
    bestseller: false,
    newArrival: false,
    
    // Image
    coverImage: null
  });

  // Load data in edit mode
  useEffect(() => {
    if (isEditMode && books.length > 0) {
      const bookToEdit = books.find((b) => b._id === id);
      if (bookToEdit) {
        setFormData({
          title: bookToEdit.title || "",
          author: bookToEdit.author || "",
          isbn: bookToEdit.isbn || "",
          description: bookToEdit.description || "",
          price: bookToEdit.price || "",
          originalPrice: bookToEdit.originalPrice || "",
          pages: bookToEdit.pages || "",
          language: bookToEdit.language || "English",
          format: bookToEdit.format || "Paperback",
          edition: bookToEdit.edition || "",
          publisher: bookToEdit.publisher || "",
          publishedDate: bookToEdit.publishedDate ? bookToEdit.publishedDate.split('T')[0] : "",
          categories: bookToEdit.categories || "",
          genre: bookToEdit.genre || "",
          ageGroup: bookToEdit.ageGroup || "",
          stock: bookToEdit.stock || "",
          featured: bookToEdit.featured || false,
          bestseller: bookToEdit.bestseller || false,
          newArrival: bookToEdit.newArrival || false,
          coverImage: null
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
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = new FormData();
      
      // Append all fields
      Object.keys(formData).forEach(key => {
        if (key !== 'coverImage' && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });
      
      // Only append image if a new one was selected
      if (formData.coverImage) {
        data.append("coverImage", formData.coverImage);
      }

      if (isEditMode) {
        await editBook(id, data);
        toast.success("Book updated successfully!");
      } else {
        await createBook(data);
        toast.success("Book added successfully!");
      }
      navigate("/admin/books");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto mb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all mb-6 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Inventory</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-sm shadow-lg shadow-blue-100">
            {isEditMode ? <Edit className="text-white" size={20} /> : <Plus className="text-white" size={20} />}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
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
          <div className="bg-white p-6 shadow-xl border border-slate-300 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Upload size={20} className="text-blue-600" /> {isEditMode ? "Update Cover" : "Cover Image"}
            </h2>

            <div className={`relative aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-center overflow-hidden group ${preview ? "border-blue-100" : "border-dashed border-slate-200 hover:border-blue-300"}`}>
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
                  <p className="text-xs text-slate-500 mt-2">Click to browse</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            {/* Marketing Badges */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Award size={16} className="text-yellow-600" /> Marketing
              </h3>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="featured" 
                  checked={formData.featured} 
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600" 
                />
                <span className="text-sm font-medium text-slate-700">Featured Book</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="bestseller" 
                  checked={formData.bestseller} 
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600" 
                />
                <span className="text-sm font-medium text-slate-700">Bestseller</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="newArrival" 
                  checked={formData.newArrival} 
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600" 
                />
                <span className="text-sm font-medium text-slate-700">New Arrival</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Form Details */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-white shadow-xl border border-slate-300 overflow-hidden">
            
            {/* Basic Information */}
            <div className="p-8 border-b border-slate-300">
              <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Book Title *</label>
                  <div className="relative">
                    <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="title" 
                      value={formData.title} 
                      type="text" 
                      placeholder="Enter book title" 
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Author Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="author" 
                      value={formData.author} 
                      type="text" 
                      placeholder="Author name" 
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">ISBN</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    name="isbn" 
                    value={formData.isbn} 
                    type="text" 
                    placeholder="978-1234567890" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">About the Book *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  rows="5" 
                  placeholder="Detailed description of the book"
                  required
                  className="w-full p-5 bg-slate-50 border-none rounded-sm outline-none resize-none font-medium" 
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Categorization */}
            <div className="p-8 border-t border-slate-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Categorization</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Category *</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="categories" 
                      value={formData.categories} 
                      type="text" 
                      placeholder="Fiction, Non-Fiction" 
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Genre</label>
                  <input 
                    name="genre" 
                    value={formData.genre} 
                    type="text" 
                    placeholder="Thriller, Romance" 
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                    onChange={handleChange} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Age Group</label>
                  <select 
                    name="ageGroup" 
                    value={formData.ageGroup} 
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                    onChange={handleChange}
                  >
                    <option value="">Select Age Group</option>
                    <option value="Children">Children</option>
                    <option value="Young Adult">Young Adult</option>
                    <option value="Adult">Adult</option>
                    <option value="All Ages">All Ages</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-8 border-t border-slate-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Pricing & Stock</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Price (₹) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="price" 
                      value={formData.price} 
                      type="number" 
                      placeholder="599"
                      required
                      min="0"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Original Price (₹)</label>
                  <input 
                    name="originalPrice" 
                    value={formData.originalPrice} 
                    type="number" 
                    placeholder="799"
                    min="0"
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                    onChange={handleChange} 
                  />
                  <p className="text-xs text-slate-500 ml-1">For showing discounts</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Stock Quantity *</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="stock" 
                      value={formData.stock} 
                      type="number" 
                      placeholder="50"
                      required
                      min="0"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Details */}
            <div className="p-8 border-t border-slate-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Physical Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Total Pages *</label>
                  <input 
                    name="pages" 
                    value={formData.pages} 
                    type="number" 
                    placeholder="350"
                    required
                    min="1"
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                    onChange={handleChange} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Format</label>
                  <select 
                    name="format" 
                    value={formData.format} 
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                    onChange={handleChange}
                  >
                    <option value="Paperback">Paperback</option>
                    <option value="Hardcover">Hardcover</option>
                    <option value="eBook">eBook</option>
                    <option value="Audiobook">Audiobook</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Language</label>
                  <select 
                    name="language" 
                    value={formData.language} 
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                    onChange={handleChange}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Edition</label>
                  <input 
                    name="edition" 
                    value={formData.edition} 
                    type="text" 
                    placeholder="1st Edition, 2nd Edition"
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>

            {/* Publication Details */}
            <div className="p-8 border-t border-slate-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Publication Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Publisher</label>
                  <input 
                    name="publisher" 
                    value={formData.publisher} 
                    type="text" 
                    placeholder="Penguin Books"
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                    onChange={handleChange} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Published Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="publishedDate" 
                      value={formData.publishedDate} 
                      type="date" 
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-sm outline-none font-medium" 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="p-8 bg-slate-50/50 flex justify-end items-center gap-4">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="px-8 py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors"
              >
                Discard
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-sm font-bold transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : (
                  <>
                    {isEditMode ? <Save size={20} /> : <Plus size={20} />}
                    {isEditMode ? "Update Book" : "Add Book"}
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