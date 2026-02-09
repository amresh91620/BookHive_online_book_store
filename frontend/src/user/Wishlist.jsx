import React from 'react';

const Wishlist = () => {
  // Dummy data array
  const wishlistItems = [
    { id: 1, name: "Apple MacBook Pro", price: "₹1,49,900", category: "Electronics" },
    { id: 2, name: "Nike Air Jordan", price: "₹12,495", category: "Footwear" },
    { id: 3, name: "Sony WH-1000XM5", price: "₹29,990", category: "Accessories" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h3 className="mb-4 text-lg font-semibold">My Wishlist</h3>

      {wishlistItems.map((item) => (
        <div key={item.id} className="mb-3 flex items-center justify-between rounded-md bg-gray-50 p-3">
          <div>
            <p className="font-medium text-gray-800">{item.name}</p>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-900">{item.price}</span>
            <button className="text-sm text-red-500 hover:text-red-700">
              Remove
            </button>
          </div>
        </div>
      ))}

      {wishlistItems.length === 0 && (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      )}

      <button className="mt-4 w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
        Add All to Cart
      </button>
    </div>
  );
};

export default Wishlist;