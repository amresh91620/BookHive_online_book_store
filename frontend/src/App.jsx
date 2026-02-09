import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import HomeSection from "./pages/HomeSection";
import Books from "./pages/Books";
import BookRatingPage from "./pages/BookRatingPage";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart";

// User Components
import Profile from "./user/ProfileDashboard";
import UserLayout from "./user/UserLayout";
import Wishlist from "./user/Wishlist";
import Orders from "./user/Orders";
import Address from "./user/Address";
import Payments from "./user/Payments";


// Admin
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ManageBooks from "./admin/ManageBooks";
import ManageUsers from "./admin/ManageUsers";
import ManageReviews from "./admin/ManageReviews";
import AddBook from "./admin/AddBook";
import ManageMessages from "./admin/ManageMessage";

// Context Providers
import AdminProvider from "./context/admin/AdminProvider";
import AuthProvider from "./context/auth/AuthProvider";
import { BookProvider } from "./context/book/BookProvider";
import { ReviewProvider } from "./context/review/ReviewProvider";
import { CartProvider } from "./context/cart/CartProvider";

function AppWrapper() {
  const location = useLocation();

  // Hide Navbar/Footer for admin panel 
  const hideLayout = 
    location.pathname.startsWith("/admin") 
  return (
    <>
      {!hideLayout && <Navbar />}
      <ScrollToTop />

      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<HomeSection />} />
        <Route path="/books" element={<Books />} />
        <Route path="/book-rating/:id" element={<BookRatingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />

        {/* ===== USER PROFILE ROUTES ===== */}
        <Route path="/user/profile" element={<UserLayout><Profile /></UserLayout>} />
        <Route path="/user/wishlist" element={<UserLayout><Wishlist /></UserLayout>} />
        <Route path="/user/orders" element={<UserLayout><Orders /></UserLayout>} />
        <Route path="/user/address" element={<UserLayout><Address /></UserLayout>} />
        <Route path="/user/payments" element={<UserLayout><Payments /></UserLayout>} />

        {/* ===== ADMIN ROUTES (PROTECTED) ===== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageBooks />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageUsers />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageReviews />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageMessages />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-book"
          element={
            <AdminRoute>
              <AdminLayout>
                <AddBook />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-book/:id"
          element={
            <AdminRoute>
              <AdminLayout>
                <AddBook />
              </AdminLayout>
            </AdminRoute>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookProvider>
          <ReviewProvider>
            <CartProvider>
            <AdminProvider>
              <AppWrapper />
            </AdminProvider>
            </CartProvider>
          </ReviewProvider>
        </BookProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;