import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-amber-600 mb-4">404</h1>
          <div className="text-6xl mb-4">📚</div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for seems to have wandered off into the stacks. It might
          have been moved, deleted, or perhaps it never existed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" size="lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate("/")} size="lg">
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
          <Button onClick={() => navigate("/books")} variant="outline" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Browse Books
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-gray-600 mb-4">Here are some helpful links instead:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <a href="/" className="text-amber-600 hover:text-amber-700 hover:underline">
              Home
            </a>
            <a href="/books" className="text-amber-600 hover:text-amber-700 hover:underline">
              All Books
            </a>
            <a href="/about" className="text-amber-600 hover:text-amber-700 hover:underline">
              About Us
            </a>
            <a href="/contact" className="text-amber-600 hover:text-amber-700 hover:underline">
              Contact
            </a>
            <a href="/faq" className="text-amber-600 hover:text-amber-700 hover:underline">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

