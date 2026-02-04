import { ShoppingCart } from "lucide-react";

const Cart = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 px-8 py-10 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <ShoppingCart size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold font-serif">Your Cart</h1>
              <p className="text-white/70 text-sm mt-1">Review items before checkout</p>
            </div>
          </div>
        </div>
        <div className="p-10 text-center text-slate-500">
          Your cart is empty.
        </div>
      </div>
    </div>
  );
};

export default Cart;
