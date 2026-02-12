import React from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { Card, Button, Badge } from "../components/ui";
import { EmptyState } from "../components/common";

const Payments = ({
  payments = [],
  compact = false,
  showActions = false,
  onAdd,
  onRemove,
}) => {
  const displayPayments = compact ? payments.slice(0, 1) : payments;

  if (payments.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={CreditCard}
          title="No payment methods"
          description="Add a payment method to make purchases easier"
          actionLabel={showActions ? "Add Payment Method" : undefined}
          onAction={showActions ? onAdd : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayPayments.map((method) => (
        <PaymentCard key={method.id} payment={method} />
      ))}

      {(!compact || showActions) && (
        <PaymentActions
          onAdd={onAdd}
          onRemove={onRemove}
          hasPayments={payments.length > 0}
        />
      )}
    </div>
  );
};

const PaymentCard = ({ payment }) => {
  const isDefault = payment.status === "Default";

  return (
    <Card variant="default" padding="md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <CreditCard size={20} className="text-slate-600" />
          </div>
          <span className="font-semibold text-slate-900">{payment.label}</span>
        </div>

        {isDefault && (
          <Badge variant="primary" size="sm">
            {payment.status}
          </Badge>
        )}
      </div>
    </Card>
  );
};

const PaymentActions = ({ onAdd, onRemove, hasPayments }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" size="sm" icon={Plus} onClick={onAdd}>
        Add Payment Method
      </Button>

      {hasPayments && (
        <Button variant="danger" size="sm" icon={Trash2} onClick={onRemove}>
          Remove Payment Method
        </Button>
      )}
    </div>
  );
};

export default Payments;
