import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomeSection from "./pages/HomeSection";
import BookRatingPage from "./pages/BookRatingPage";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";

import { useAuth } from "./hooks/useAuth";
 
// admin
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ManageBooks from "./admin/ManageBooks";
import ManageUsers from "./admin/ManageUsers";
import ManageReviews from "./admin/ManageReviews";
import AddBook from "./admin/AddBook";
import AdminProvider from "./context/admin/AdminProvider";
import AuthProvider from "./context/auth/AuthProvider";
import { BookProvider } from "./context/book/BookProvider";
import { ReviewProvider } from "./context/review/ReviewProvider";
import ManageMessages from "./admin/ManageMessage";


function AppWrapper() {
  const location = useLocation();
  const { user } = useAuth();

  // Hide Navbar/Footer for admin panel
  const hideLayout =
    location.pathname.startsWith("/admin") && user?.role === "admin";

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<HomeSection />} />
        <Route path="/book-rating/:id" element={<BookRatingPage />}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />

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
          path="/admin/messsge"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageMessages />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* ✅ ADD BOOK ROUTE */}
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

        {/* ✅ EDIT BOOK ROUTE (Uses the same AddBook component) */}
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
          <AdminProvider>
            <AppWrapper />
          </AdminProvider>
          </ReviewProvider>
        </BookProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
