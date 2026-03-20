import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Camera } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";

export default function ISBNLookup({ onDataFetched }) {
  const [isbn, setIsbn] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleLookup = async () => {
    if (!isbn.trim()) {
      toast.error("Please enter an ISBN");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/api/books/lookup/${isbn.trim()}`);
      
      if (response.data.found) {
        toast.success(`Book found from ${response.data.data.source}!`);
        onDataFetched(response.data.data);
      } else {
        toast.error("Book not found in external databases");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Book not found. Please fill the form manually.");
      } else {
        toast.error(error.response?.data?.msg || "Failed to lookup ISBN");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScan = async () => {
    // Check if browser supports barcode detection
    if (!('BarcodeDetector' in window)) {
      toast.error("Barcode scanning not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    try {
      setScanning(true);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create barcode detector
      const barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'ean_8'] });

      // Scan for barcode
      const detectBarcode = async () => {
        try {
          const barcodes = await barcodeDetector.detect(video);
          
          if (barcodes.length > 0) {
            const detectedISBN = barcodes[0].rawValue;
            
            // Stop camera
            stream.getTracks().forEach(track => track.stop());
            setScanning(false);
            
            toast.success("Barcode detected!");
            
            // Set ISBN and trigger lookup with the detected value
            setIsbn(detectedISBN);
            
            // Call lookup directly with detected ISBN instead of relying on state
            try {
              const response = await api.get(`/api/books/lookup/${detectedISBN.trim()}`);
              
              if (response.data.found) {
                toast.success(`Book found from ${response.data.data.source}!`);
                onDataFetched(response.data.data);
              } else {
                toast.error("Book not found in external databases");
              }
            } catch (err) {
              if (err.response?.status === 404) {
                toast.error("Book not found. Please fill the form manually.");
              } else {
                toast.error(err.response?.data?.msg || "Failed to lookup ISBN");
              }
            }
          } else {
            // Keep scanning
            requestAnimationFrame(detectBarcode);
          }
        } catch (err) {
          console.error('Barcode detection error:', err);
        }
      };

      // Start detection after video is ready
      video.onloadedmetadata = () => {
        detectBarcode();
      };

      // Timeout after 30 seconds
      setTimeout(() => {
        if (scanning) {
          stream.getTracks().forEach(track => track.stop());
          setScanning(false);
          toast.error("Barcode scan timeout");
        }
      }, 30000);

    } catch (error) {
      console.error('Camera access error:', error);
      toast.error("Camera access denied or not available");
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
      <h3 className="text-lg font-semibold">Quick Add with ISBN</h3>
      <p className="text-sm text-gray-600">
        Enter ISBN or scan barcode to auto-fill book details from Google Books or Open Library
      </p>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="isbn-lookup">ISBN Number</Label>
          <Input
            id="isbn-lookup"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Enter ISBN (e.g., 9780134685991)"
            onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleLookup}
          disabled={loading || scanning}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Looking up...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Lookup ISBN
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={handleBarcodeScan}
          disabled={loading || scanning}
          variant="outline"
          className="flex-1"
        >
          {scanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Scan Barcode
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        Note: Barcode scanning requires Chrome or Edge browser with camera access
      </p>
    </div>
  );
}
