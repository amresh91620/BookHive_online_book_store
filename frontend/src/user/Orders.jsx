import React from 'react';
import { Package, Eye } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { EmptyState } from '../components/common';

const Orders = () => {
  const orders = [];

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Start shopping to see your orders here"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card variant="elevated" padding="lg">
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title className="flex items-center gap-2">
              <Package size={20} />
              My Orders
            </Card.Title>
            <Badge variant="secondary">{orders.length} orders</Badge>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} variant="default" padding="md" hover>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{order.product}</h3>
                    <p className="text-sm text-slate-600">Order #{order.id}</p>
                    <p className="text-xs text-slate-400 mt-1">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-black text-slate-900">₹{order.price.toLocaleString()}</p>
                      <Badge variant={order.statusColor} size="sm" className="mt-2">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                  <Button variant="primary" size="sm" icon={Eye} fullWidth>
                    View Details
                  </Button>
                  {order.status === "Delivered" && (
                    <Button variant="secondary" size="sm" fullWidth>
                      Buy Again
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Orders;
