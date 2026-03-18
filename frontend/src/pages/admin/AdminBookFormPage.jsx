import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBookDetails, useCreateBook, useUpdateBook } from "@/hooks/api/useBooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBookFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: book } = useBookDetails(id);
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    categories: "",
    price: "",
    originalPrice: "",
    pages: "",
    isbn: "",
    publisher: "",
    language: "English",
    format: "Paperback",
    edition: "",
    genre: "",
    stock: "",
    publishedDate: "",
    featured: false,
    bestseller: false,
    newArrival: false,
    ageGroup: "",
  });

  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    if (isEdit && book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        categories: book.categories || "",
        price: book.price || "",
        originalPrice: book.originalPrice || "",
        pages: book.pages || "",
        isbn: book.isbn || "",
        publisher: book.publisher || "",
        language: book.language || "English",
        format: book.format || "Paperback",
        edition: book.edition || "",
        genre: book.genre || "",
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };
    if (coverImage) {
      payload.coverImage = coverImage;
    }

    if (isEdit) {
      updateBook.mutate(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Book updated successfully");
            navigate("/admin/books");
          },
          onError: (error) => toast.error(error?.response?.data?.msg || "Failed to update book"),
        }
      );
    } else {
      createBook.mutate(payload, {
        onSuccess: () => {
          toast.success("Book added successfully");
          navigate("/admin/books");
        },
        onError: (error) => toast.error(error?.response?.data?.msg || "Failed to add book"),
      });
    }
  };

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/books")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Books
      </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Edit Book" : "Add New Book"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      required
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
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      placeholder="e.g., Mystery"
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
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                    />
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
                    <Label htmlFor="publishedDate">Published Date *</Label>
                    <Input
                      id="publishedDate"
                      name="publishedDate"
                      type="date"
                      value={formData.publishedDate}
                      onChange={handleChange}
                      required
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
                    <Label htmlFor="edition">Edition</Label>
                    <Input
                      id="edition"
                      name="edition"
                      value={formData.edition}
                      onChange={handleChange}
                    />
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
                    Upload Cover Image {!isEdit && "*"}
                  </Label>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!isEdit}
                  />
                  {isEdit && book?.coverImage && !coverImage && (
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
                  onClick={() => navigate("/admin/books")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}
