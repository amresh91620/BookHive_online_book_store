import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useBookDetails, useCreateBook, useUpdateBook } from "@/hooks/api/useBooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import ISBNLookup from "@/components/admin/ISBNLookup";
import BulkUpload from "@/components/admin/BulkUpload";

export default function AdminBookFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);

  // Get return URL from location state or default to /admin/books
  const returnUrl = location.state?.from || "/admin/books";

  const { data: book } = useBookDetails(id);
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    aboutBook: "",
    aboutAuthor: "",
    categories: "",
    price: "",
    originalPrice: "",
    pages: "",
    isbn: "",
    publisher: "",
    language: "English",
    format: "Paperback",
    stock: "",
    publishedDate: "",
    featured: false,
    bestseller: false,
    newArrival: false,
    ageGroup: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isApiData, setIsApiData] = useState(false);

  useEffect(() => {
    if (isEdit && book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        aboutBook: book.aboutBook || book.description || "",
        aboutAuthor: book.aboutAuthor || "",
        categories: book.categories || "",
        price: book.price || "",
        originalPrice: book.originalPrice || "",
        pages: book.pages || "",
        isbn: book.isbn || "",
        publisher: book.publisher || "",
        language: book.language || "English",
        format: book.format || "Paperback",
        stock: book.stock || "",
        publishedDate: book.publishedDate ? book.publishedDate.split("T")[0] : "",
        featured: book.featured || false,
        bestseller: book.bestseller || false,
        newArrival: book.newArrival || false,
        ageGroup: book.ageGroup || "",
      });
    }
  }, [book, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
    setCoverImageUrl("");
  };

  const handleISBNDataFetched = (data) => {
    setIsApiData(true);
    setFormData({
      ...formData,
      title: data.title || "",
      author: data.author || "",
      aboutBook: data.aboutBook || "",
      aboutAuthor: data.aboutAuthor || "",
      categories: data.categories || "",
      pages: data.pages || "",
      isbn: data.isbn || "",
      publisher: data.publisher || "",
      language: data.language || "English",
      publishedDate: data.publishedDate ? data.publishedDate.split('T')[0] : "",
    });
    
    // Set cover image URL from API
    if (data.coverImage) {
      setCoverImageUrl(data.coverImage);
    }
    
    // Don't show another toast here - success toast already shown in ISBNLookup
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.price || !formData.stock) {
      toast.error("Please fill in price and stock");
      return;
    }

    // Validate aboutBook is not empty
    if (!formData.aboutBook || formData.aboutBook.trim() === '') {
      toast.error("About Book is required");
      return;
    }

    const payload = { ...formData };
    
    // Ensure aboutBook and aboutAuthor are included even if empty
    if (!payload.aboutBook) payload.aboutBook = '';
    if (!payload.aboutAuthor) payload.aboutAuthor = '';
    
    // Handle cover image
    if (coverImage) {
      payload.coverImage = coverImage;
    } else if (coverImageUrl && !isEdit) {
      // Use URL from API
      payload.coverImageUrl = coverImageUrl;
    }

    if (isEdit) {
      updateBook.mutate(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Book updated successfully");
            navigate(returnUrl);
          },
          onError: (error) => toast.error(error?.response?.data?.msg || "Failed to update book"),
        }
      );
    } else {
      createBook.mutate(payload, {
        onSuccess: () => {
          toast.success("Book added successfully");
          navigate(returnUrl);
        },
        onError: (error) => {
          console.error('Book creation error:', error);
          const errorMsg = error?.response?.data?.error || 
                          error?.response?.data?.msg || 
                          "Failed to add book";
          
          // Show specific error for duplicate ISBN
          if (errorMsg.includes('ISBN')) {
            toast.error(`Duplicate ISBN: ${formData.isbn || 'Unknown'} already exists`);
          } else {
            toast.error(errorMsg);
          }
        },
      });
    }
  };

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={() => navigate(returnUrl)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Books
      </Button>

      {!isEdit && (
        <Tabs defaultValue="single" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="single">Single Book</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single">
            {/* ISBN Lookup Section */}
            <div className="mb-6">
              <ISBNLookup onDataFetched={handleISBNDataFetched} />
            </div>

            {isApiData && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-800">Data loaded from external API</p>
                  <p className="text-yellow-700">Please review all fields and add pricing, stock, and tags manually. You can edit any incorrect information.</p>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Add New Book</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">{renderForm()}</form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <BulkUpload onUploadComplete={() => navigate(returnUrl)} />
          </TabsContent>
        </Tabs>
      )}

      {isEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">{renderForm()}</form>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function renderForm() {
    return (
      <>
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="aboutBook">About Book *</Label>
                    <Textarea
                      id="aboutBook"
                      name="aboutBook"
                      value={formData.aboutBook}
                      onChange={handleChange}
                      rows={4}
                      required
                      placeholder="Describe what the book is about..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="aboutAuthor">About Author</Label>
                    <Textarea
                      id="aboutAuthor"
                      name="aboutAuthor"
                      value={formData.aboutAuthor}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Information about the author (optional)..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="categories">Category *</Label>
                    <Input
                      id="categories"
                      name="categories"
                      value={formData.categories}
                      onChange={handleChange}
                      placeholder="e.g., Fiction"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Book Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="isbn">ISBN (Optional - Must be unique)</Label>
                    <Input
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      placeholder="e.g., 9780451524935"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty if not available. Each ISBN must be unique.</p>
                  </div>
                  <div>
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pages">Pages *</Label>
                    <Input
                      id="pages"
                      name="pages"
                      type="number"
                      value={formData.pages}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="publishedDate">Published Date</Label>
                    <Input
                      id="publishedDate"
                      name="publishedDate"
                      type="date"
                      value={formData.publishedDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="format">Format</Label>
                    <select
                      id="format"
                      name="format"
                      value={formData.format}
                      onChange={handleChange}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
                    >
                      <option value="Paperback">Paperback</option>
                      <option value="Hardcover">Hardcover</option>
                      <option value="eBook">eBook</option>
                      <option value="Audiobook">Audiobook</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="ageGroup">Age Group</Label>
                    <select
                      id="ageGroup"
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleChange}
                      className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Children">Children</option>
                      <option value="Young Adult">Young Adult</option>
                      <option value="Adult">Adult</option>
                      <option value="All Ages">All Ages</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cover Image</h3>
                <div>
                  <Label htmlFor="coverImage">
                    Upload Cover Image {!isEdit && !coverImageUrl && "*"}
                  </Label>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!isEdit && !coverImageUrl}
                  />
                  {coverImageUrl && !coverImage && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Cover from API:</p>
                      <img
                        src={coverImageUrl}
                        alt="API cover"
                        className="w-32 h-40 object-cover rounded"
                      />
                      <p className="text-xs text-gray-500 mt-1">You can upload a different image if needed</p>
                    </div>
                  )}
                  {isEdit && book?.coverImage && !coverImage && !coverImageUrl && (
                    <div className="mt-2">
                      <img
                        src={book.coverImage}
                        alt="Current cover"
                        className="w-32 h-40 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Flags */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Display Options</h3>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="bestseller"
                      checked={formData.bestseller}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm">Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="newArrival"
                      checked={formData.newArrival}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm">New Arrival</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-2">
                <Button type="submit" disabled={createBook.isPending || updateBook.isPending}>
                  {(createBook.isPending || updateBook.isPending) ? "Saving..." : isEdit ? "Update Book" : "Add Book"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(returnUrl)}
                >
                  Cancel
                </Button>
              </div>
            </>
          );
        }
      }
    
