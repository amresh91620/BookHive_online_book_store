import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Loader2, CheckCircle, XCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";

export default function BulkUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [checking, setChecking] = useState(false);
  const [excludedRows, setExcludedRows] = useState(new Set()); // Track excluded rows

  const handleDeleteDuplicate = (isbn, title, rowNumber) => {
    if (!confirm(`Exclude "${title}" from upload? (Row ${rowNumber} will be skipped)`)) {
      return;
    }

    // Add row to excluded set
    setExcludedRows(prev => {
      const newSet = new Set([...prev, rowNumber]);
      
      // Remove from preview duplicates list
      setPreviewData(prevData => {
        if (!prevData) return prevData;
        
        const newDuplicates = prevData.duplicates.filter(d => d.row !== rowNumber);
        return {
          ...prevData,
          duplicates: newDuplicates,
          newBooks: prevData.total - newSet.size
        };
      });
      
      return newSet;
    });
    
    toast.success(`Row ${rowNumber} excluded from upload`);
  };

  const handleExcludeAllDuplicates = () => {
    if (!previewData || previewData.duplicates.length === 0) return;
    
    const count = previewData.duplicates.length;
    if (!confirm(`Exclude all ${count} duplicate books from upload?`)) {
      return;
    }

    // Add all duplicate rows to excluded set
    const allDuplicateRows = previewData.duplicates.map(d => d.row);
    setExcludedRows(prev => {
      const newSet = new Set([...prev, ...allDuplicateRows]);
      
      // Update preview after state is set
      setPreviewData(prevData => ({
        ...prevData,
        duplicates: [],
        newBooks: prevData.total - newSet.size
      }));
      
      return newSet;
    });
    
    toast.success(`${count} duplicate rows excluded from upload`);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv') {
      toast.error("Please select a valid CSV file");
      return;
    }

    setFile(selectedFile);
    setResults(null);
    setPreviewData(null);
    setExcludedRows(new Set()); // Reset excluded rows
    setChecking(true);

    try {
      // Read and parse CSV
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error("CSV file is empty or invalid");
        setChecking(false);
        return;
      }

      // Parse CSV with proper quote handling
      const parseCSVLine = (line) => {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        return values;
      };

      // Parse headers
      const headers = parseCSVLine(lines[0]).map(h => h.replace(/['"]/g, '').toLowerCase());
      const titleIndex = headers.indexOf('title');
      const isbnIndex = headers.indexOf('isbn');
      
      const booksToCheck = [];
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const title = values[titleIndex]?.replace(/^"|"$/g, '').trim() || '';
        const isbn = values[isbnIndex]?.replace(/^"|"$/g, '').trim() || '';
        
        if (title) {
          booksToCheck.push({ row: i + 1, title, isbn });
        }
      }

      const duplicates = [];
      for (const book of booksToCheck) {
        if (book.isbn && book.isbn.length > 5) { // Valid ISBN check
          try {
            // Search by exact ISBN match
            const response = await api.get('/api/books', {
              params: { limit: 1000 }
            });
            const books = response.data.books || [];
            const existing = books.find(b => b.isbn && b.isbn.trim() === book.isbn.trim());
            
            if (existing) {
              duplicates.push({
                ...book,
                existingId: existing._id,
                existingTitle: existing.title
              });
            }
          } catch (error) {
            console.error('Error checking book:', error);
          }
        }
      }

      setPreviewData({
        total: booksToCheck.length,
        duplicates: duplicates,
        newBooks: booksToCheck.length - duplicates.length
      });

      if (duplicates.length > 0) {
        toast.error(`Found ${duplicates.length} duplicate ISBN(s) in database!`);
      } else {
        toast.success(`All ${booksToCheck.length} books are new - ready to upload!`);
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error("Failed to parse CSV file");
    } finally {
      setChecking(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    setUploading(true);
    
    try {
      // Read and filter CSV based on excluded rows
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Filter out excluded rows
      const filteredLines = [lines[0]]; // Keep header
      for (let i = 1; i < lines.length; i++) {
        const rowNumber = i + 1;
        if (!excludedRows.has(rowNumber)) {
          filteredLines.push(lines[i]);
        }
      }
      
      // Create new CSV content
      const filteredCSV = filteredLines.join('\n');
      const blob = new Blob([filteredCSV], { type: 'text/csv' });
      const filteredFile = new File([blob], file.name, { type: 'text/csv' });
      
      // Upload filtered CSV
      const formData = new FormData();
      formData.append('file', filteredFile);

      const response = await api.post('/api/books/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data);
      
      if (response.data.successCount > 0) {
        toast.success(`Successfully uploaded ${response.data.successCount} books!`);
        if (onUploadComplete) {
          onUploadComplete();
        }
      }
      
      if (response.data.failedCount > 0) {
        toast.error(`${response.data.failedCount} books failed to upload`);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to upload CSV");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `title,author,aboutBook,aboutAuthor,categories,price,originalPrice,pages,publishedDate,coverImage,isbn,publisher,language,format,stock,ageGroup,featured,bestseller,newArrival
"The Great Gatsby","F. Scott Fitzgerald","A classic novel about the Jazz Age and the American Dream","","Fiction",15.99,19.99,180,"1925-04-10","https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg","9780743273565","Scribner","English","Paperback",50,"Adult",false,true,false
"1984","George Orwell","A dystopian novel about totalitarianism","","Fiction",12.99,16.99,328,"1949-06-08","https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg","9780451524935","Signet Classic","English","Paperback",100,"Adult",false,true,false
"Harry Potter","J.K. Rowling","A young wizard discovers his magical heritage","","Fantasy",14.99,18.99,309,"1997-06-26","https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg","9780439708180","Scholastic","English","Hardcover",75,"Children",true,true,true

INSTRUCTIONS:
1. aboutBook: Write SHORT description (1-2 sentences). Gemini AI expands to 200 words!
2. aboutAuthor: Leave EMPTY. Gemini AI generates 100-word biography!
3. ageGroup: Children, Young Adult, Adult, All Ages (shortcuts: 16+, All, Kids, Teen, YA)
4. ISBN: Must be unique
5. Gemini AI automatically generates professional descriptions from your short hints!`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'book_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Books</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Upload multiple books at once using a CSV file. Download the template to see the required format.
          </p>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <p className="font-semibold text-blue-800 mb-1">✨ Gemini AI Integration:</p>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Write SHORT descriptions (1-2 sentences) - Gemini expands to 200 words!</li>
              <li>Leave aboutAuthor EMPTY - Gemini generates 100-word biography!</li>
              <li>Saves time and ensures professional, consistent content</li>
            </ul>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={downloadTemplate}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV Template
          </Button>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-sm font-medium">Select CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={checking || uploading}
            />
          </label>
          {file && (
            <p className="text-sm text-green-600">
              Selected: {file.name}
            </p>
          )}
          {checking && (
            <p className="text-sm text-blue-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking for duplicates...
            </p>
          )}
        </div>

        {previewData && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Preview</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p>Total books in CSV: {previewData.total}</p>
              <p className="text-green-700">✅ New books: {previewData.newBooks}</p>
              {previewData.duplicates.length > 0 && (
                <p className="text-red-700">⚠️ Duplicates found: {previewData.duplicates.length}</p>
              )}
            </div>
            
            {previewData.duplicates.length > 0 && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded max-h-40 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-red-800">Duplicate ISBNs:</p>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleExcludeAllDuplicates}
                    className="h-6 px-2 text-xs"
                    title="Exclude all duplicates from upload"
                  >
                    Exclude All ({previewData.duplicates.length})
                  </Button>
                </div>
                <ul className="text-xs text-red-700 space-y-1">
                  {previewData.duplicates.map((dup, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-2">
                      <span className={excludedRows.has(dup.row) ? 'line-through text-gray-400' : ''}>
                        Row {dup.row}: {dup.title} (ISBN: {dup.isbn})
                      </span>
                      {!excludedRows.has(dup.row) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDuplicate(dup.isbn, dup.title, dup.row)}
                          className="h-5 px-2 text-xs text-red-600 hover:text-red-700"
                          title="Exclude from upload"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Click [X] to exclude individual rows or use "Exclude All" button above.
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Books
            </>
          )}
        </Button>

        {results && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold mb-2">Upload Results</h4>
              <div className="space-y-1 text-sm">
                <p>Total: {results.total}</p>
                <p className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Success: {results.successCount}
                </p>
                <p className="text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  Failed: {results.failedCount}
                </p>
              </div>
            </div>

            {results.results.failed.length > 0 && (
              <div className="p-3 bg-red-50 rounded max-h-60 overflow-y-auto">
                <h4 className="font-semibold text-red-800 mb-2">Failed Rows</h4>
                <div className="space-y-2 text-sm">
                  {results.results.failed.map((fail, idx) => (
                    <div key={idx} className="border-b border-red-200 pb-2">
                      <p className="font-medium">Row {fail.row}: {fail.data.title || 'Unknown'}</p>
                      <ul className="list-disc list-inside text-red-700 text-xs">
                        {fail.errors.map((error, errIdx) => (
                          <li key={errIdx} className="break-words">{error}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
