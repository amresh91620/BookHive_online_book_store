import { MapPin, Edit2, Trash2, Plus } from "lucide-react";

const Address = ({
  addresses = [],
  compact = false,
  showActions = false,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const displayAddresses = compact ? addresses.slice(0, 1) : addresses;

  if (addresses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <MapPin size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm text-slate-500">No addresses saved.</p>
        </div>
        {showActions && (
          <AddressActions
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            hasAddresses={false}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayAddresses.map((address) => (
        <AddressCard key={address.id} address={address} />
      ))}

      {(!compact || showActions) && (
        <AddressActions
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          hasAddresses={addresses.length > 0}
        />
      )}
    </div>
  );
};

const AddressCard = ({ address }) => {
  const isDefault = address.id === "default";

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {address.label || "Address"}
        </span>
        {isDefault && (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            DEFAULT
          </span>
        )}
      </div>
      <div className="space-y-0.5">
        {address.lines.map((line, index) => (
          <p key={`${address.id}-line-${index}`}>{line}</p>
        ))}
      </div>
    </div>
  );
};

const AddressActions = ({ onAdd, onEdit, onDelete, hasAddresses }) => {
  return (
    <div className="flex flex-wrap gap-3 pt-1">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        <Plus size={16} />
        <span>Add Address</span>
      </button>

      {hasAddresses && (
        <>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            <Edit2 size={16} />
            <span>Edit Address</span>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 rounded-md border border-rose-300 px-4 py-2 text-sm text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            <Trash2 size={16} />
            <span>Delete Address</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Address;