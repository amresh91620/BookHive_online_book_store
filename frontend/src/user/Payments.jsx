import React from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";

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
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <CreditCard size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm text-slate-500">No payment methods found.</p>
        </div>
        {showActions && (
          <PaymentActions onAdd={onAdd} onRemove={onRemove} hasPayments={false} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
    <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-slate-200 p-2">
          <CreditCard size={18} className="text-slate-600" />
        </div>
        <span className="text-sm font-medium text-slate-800">
          {payment.label}
        </span>
      </div>

      {isDefault && (
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
          {payment.status}
        </span>
      )}
    </div>
  );
};

const PaymentActions = ({ onAdd, onRemove, hasPayments }) => {
  return (
    <div className="flex flex-wrap gap-3 pt-1">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        <Plus size={16} />
        <span>Add Payment Method</span>
      </button>

      {hasPayments && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 rounded-md border border-rose-300 px-4 py-2 text-sm text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          <Trash2 size={16} />
          <span>Remove Payment Method</span>
        </button>
      )}
    </div>
  );
};

export default Payments;