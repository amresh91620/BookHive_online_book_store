import React from 'react';
import { Package, Eye } from 'lucide-react';

const Orders = () => {
  const orders = [
    {
      id: "BH10234",
      product: "Wireless Headphones",
      date: "Jan 15, 2025",
      status: "Delivered",
      price: 2499,
      statusColor: "green"
    },
    {
      id: "BH10210",
      product: "Smart Watch",
      date: "Jan 20, 2025",
      status: "In Transit",
      price: 3999,
      statusColor: "blue"
    },
    {
      id: "BH10245",
      product: "Mechanical Keyboard",
      date: "Jan 25, 2025",
      status: "Processing",
      price: 4200,
      statusColor: "orange"
    },
    {
      id: "BH10198",
      product: "Running Shoes",
      date: "Jan 10, 2025",
      status: "Delivered",
      price: 5999,
      statusColor: "green"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
        <div className="mb-5 flex items-center gap-2 border-b pb-3 text-lg font-semibold text-slate-700">
          <Package size={18} />
          <span>My Orders</span>
          <span className="ml-auto text-sm font-normal text-slate-500">
            {orders.length} orders
          </span>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-slate-200 p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{order.product}</h3>
                  <p className="text-sm text-slate-500 mt-1">Order #{order.id}</p>
                  <p className="text-xs text-slate-400 mt-1">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₹{order.price.toLocaleString()}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    order.statusColor === 'green' 
                      ? 'bg-green-100 text-green-700' 
                      : order.statusColor === 'blue'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-200">
                <button className="flex-1 rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 flex items-center justify-center gap-2">
                  <Eye size={16} />
                  View Details
                </button>
                {order.status === "Delivered" && (
                  <button className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Buy Again
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;