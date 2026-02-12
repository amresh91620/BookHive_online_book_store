import React from "react";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "../components/ui";
import { EmptyState } from "../components/common";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

const Wishlist = () => {
  const navigate = useNavigate();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddAllToCart = async () => {
    if (!user) {
      return;
    }
    for (const item of wishlistItems) {
      await addToCart(item._id);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Start adding books you love to your wishlist."
          actionLabel="Browse Books"
          onAction={() => navigate("/books")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">My Wishlist</h3>
          <p className="text-slate-600 text-sm mt-1">{wishlistItems.length} items saved</p>
        </div>
        <Button variant="primary" icon={ShoppingCart} onClick={handleAddAllToCart}>
          Add All to Cart
        </Button>
      </div>

      <div className="space-y-4">
        {wishlistItems.map((item) => (
          <Card key={item._id} variant="elevated" padding="lg" hover>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-16 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <Badge variant="secondary" size="sm">
                      {item.categories || "General"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{item.author}</p>
                  <p className="text-lg font-black text-slate-900">₹{item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  icon={ShoppingCart}
                  onClick={() => addToCart(item._id)}
                  disabled={!user}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => removeFromWishlist(item._id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
