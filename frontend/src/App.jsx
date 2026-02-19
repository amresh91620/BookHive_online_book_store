import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ToastProvider from "./components/providers/ToastProvider";

// Pages
import HomeSection from "./pages/HomeSection";
import Books from "./pages/Books";
import BookRatingPage from "./pages/BookRatingPage";
import Categories from "./pages/Categories";
import Bestsellers from "./pages/Bestsellers";
import NewArrivals from "./pages/NewArrivals";
import Deals from "./pages/Deals";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// User Components
import Profile from "./user/ProfileDashboard";
import EditProfile from "./user/EditProfile";
import UserLayout from "./user/UserLayout";
import Wishlist from "./user/Wishlist";
import Orders from "./user/Orders";
import OrderDetails from "./user/OrderDetails";
import Address from "./user/Address";
import Payments from "./user/Payments";
import UserRoute from "./user/UserRoute";


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
import WishlistProvider from "./context/wishlist/WishlistProvider";
import AddressProvider from "./context/address/AddressProvider";

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
        <Route path="/categories" element={<Categories />} />
        <Route path="/bestsellers" element={<Bestsellers />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/book-rating/:id" element={<BookRatingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <UserRoute>
              <Checkout />
            </UserRoute>
          }
        />

        {/* ===== USER PROFILE ROUTES ===== */}
        <Route
          path="/user"
          element={
            <UserRoute>
              <UserLayout>
                <Profile />
              </UserLayout>
            </UserRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <UserRoute>
              <UserLayout>
                <Profile />
              </UserLayout>
            </UserRoute>
          }
        />
        <Route
          path="/user/profile/edit"
          element={
            <UserRoute>
              <UserLayout>
                <EditProfile />
              </UserLayout>
            </UserRoute>
          }
        />
        <Route
          path="/user/wishlist"
          element={
            <UserRoute>
              <UserLayout>
                <Wishlist />
              </UserLayout>
            </UserRoute>
          }
        />
        <Route
          path="/user/orders"
          element={
            <UserRoute>
              <UserLayout>
                <Orders />
              </UserLayout>
            </UserRoute>
          }
        />
        <Route
          path="/user/orders/:id"
          element={
            <UserRoute>
              <UserLayout>
                <OrderDetails />
              </UserLayout>
            </UserRoute>
          }
        />
        <Route
          path="/user/address"
          element={
            <UserRoute>
              <UserLayout>
                <Address />
              </UserLayout>
            </UserRoute>
          }
        />
        <Route
          path="/user/payments"
          element={
            <UserRoute>
              <UserLayout>
                <Payments />
              </UserLayout>
            </UserRoute>
          }
        />

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
            <WishlistProvider>
              <AddressProvider>
              <AdminProvider>
                <ToastProvider />
                <AppWrapper />
              </AdminProvider>
              </AddressProvider>
            </WishlistProvider>
            </CartProvider>
          </ReviewProvider>
        </BookProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
