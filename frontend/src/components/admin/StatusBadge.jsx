import { Badge } from "@/components/ui/badge";

/**
 * Reusable status badge component
 * @param {string} status - Status value
 * @param {string} type - Type of status (order, user, payment)
 */
export function StatusBadge({ status, type = "order" }) {
  const getVariant = () => {
    if (type === "order") {
      switch (status?.toLowerCase()) {
        case "pending":
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case "processing":
          return "bg-blue-100 text-blue-800 hover:bg-blue-100";
        case "shipped":
          return "bg-purple-100 text-purple-800 hover:bg-purple-100";
        case "delivered":
          return "bg-green-100 text-green-800 hover:bg-green-100";
        case "cancelled":
          return "bg-red-100 text-red-800 hover:bg-red-100";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      }
    }

    if (type === "payment") {
      switch (status?.toLowerCase()) {
        case "paid":
        case "completed":
          return "bg-green-100 text-green-800 hover:bg-green-100";
        case "pending":
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case "failed":
          return "bg-red-100 text-red-800 hover:bg-red-100";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      }
    }

    if (type === "user") {
      switch (status?.toLowerCase()) {
        case "active":
          return "bg-green-100 text-green-800 hover:bg-green-100";
        case "inactive":
          return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        case "blocked":
          return "bg-red-100 text-red-800 hover:bg-red-100";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      }
    }

    return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  return (
    <Badge className={`${getVariant()} capitalize`}>
      {status}
    </Badge>
  );
}
