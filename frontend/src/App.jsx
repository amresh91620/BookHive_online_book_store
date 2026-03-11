import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "@/routes/AppRoutes.jsx";
import { fetchCart } from "@/store/slices/cartSlice";
import { fetchWishlist } from "@/store/slices/wishlistSlice";

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch once when user and token exist
    if (user && token && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
    
    // Reset flag when user logs out
    if (!user || !token) {
      hasFetched.current = false;
    }
  }, [user, token, dispatch]);

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
