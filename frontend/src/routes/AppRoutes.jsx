import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { lazy, Suspense, useEffect } from "react";
const HomePage = lazy(() => import("@/pages/HomePage"));
const BooksPage = lazy(() => import("@/pages/BooksPage"));
const NewArrivalsPage = lazy(() => import("@/pages/NewArrivalsPage"));
const BookDetailPage = lazy(() => import("@/pages/BookDetailPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const OrdersPage = lazy(() => import("@/pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("@/pages/OrderDetailPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminBooksPage = lazy(() => import("@/pages/admin/AdminBooksPage"));
const AdminBookFormPage = lazy(() => import("@/pages/admin/AdminBookFormPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminOrdersPage = lazy(() => import("@/pages/admin/AdminOrdersPage"));
const AdminOrderDetailPage = lazy(() => import("@/pages/admin/AdminOrderDetailPage"));
const AdminReviewsPage = lazy(() => import("@/pages/admin/AdminReviewsPage"));
const AdminMessagesPage = lazy(() => import("@/pages/admin/AdminMessagesPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const AuthTestPage = lazy(() => import("@/pages/AuthTestPage"));

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Public Route (redirect if logged in)
function PublicRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    }>
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/auth-test" element={<AuthTestPage />} />
        
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found - Must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Routes with Separate Layout */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute adminOnly>
              <AdminBooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books/add"
          element={
            <ProtectedRoute adminOnly>
              <AdminBookFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <AdminBookFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly>
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute adminOnly>
              <AdminOrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute adminOnly>
              <AdminReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute adminOnly>
              <AdminMessagesPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
    </Suspense>
  );
}
