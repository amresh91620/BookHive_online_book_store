import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Camera, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";
import { BrowserMultiFormatReader } from '@zxing/library';

export default function ISBNLookup({ onDataFetched }) {
  const [isbn, setIsbn] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

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
    try {
      setScanning(true);
      
      // Initialize code reader
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      // Get available video devices
      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        toast.error("No camera found on this device");
        setScanning(false);
        return;
      }

      // Use back camera if available, otherwise use first camera
      const selectedDeviceId = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      )?.deviceId || videoInputDevices[0].deviceId;

      // Start decoding from video device
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        async (result, error) => {
          if (result) {
            const detectedISBN = result.getText();
            
            // Stop scanning
            codeReader.reset();
            setScanning(false);
            
            toast.success(`Barcode detected: ${detectedISBN}`);
            
            // Set ISBN
            setIsbn(detectedISBN);
            
            // Lookup the ISBN
            setLoading(true);
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
            } finally {
              setLoading(false);
            }
          }
          
          if (error && error.name !== 'NotFoundException') {
            console.error('Barcode scan error:', error);
          }
        }
      );

      // Timeout after 30 seconds
      setTimeout(() => {
        if (scanning) {
          codeReader.reset();
          setScanning(false);
          toast.error("Barcode scan timeout. Please try again.");
        }
      }, 30000);

    } catch (error) {
      console.error('Camera access error:', error);
      if (error.name === 'NotAllowedError') {
        toast.error("Camera access denied. Please allow camera permission.");
      } else if (error.name === 'NotFoundError') {
        toast.error("No camera found on this device.");
      } else {
        toast.error("Failed to start camera. Please enter ISBN manually.");
      }
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setScanning(false);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
      <h3 className="text-lg font-semibold">Quick Add with ISBN</h3>
      <p className="text-sm text-gray-600">
        Enter ISBN or scan barcode to auto-fill book details from Google Books or Open Library
      </p>
      
      {/* Camera Preview */}
      {scanning && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-yellow-400 w-64 h-32 rounded-lg"></div>
          </div>
          <Button
            type="button"
            onClick={stopScanning}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
            size="sm"
          >
            <X className="w-4 h-4 mr-1" />
            Stop
          </Button>
          <p className="absolute bottom-2 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
            Position barcode within the yellow frame
          </p>
        </div>
      )}
      
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="isbn-lookup">ISBN Number</Label>
          <Input
            id="isbn-lookup"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Enter ISBN (e.g., 9780134685991)"
            onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
            disabled={scanning}
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
        <strong>Tip:</strong> Works on all modern browsers with camera access. 
        Hold barcode steady within the frame for best results.
      </p>
    </div>
  );
}

