import { Card } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

/**
 * Reusable data table component for admin pages
 * @param {Array} columns - Array of column definitions
 * @param {Array} data - Array of data rows
 * @param {boolean} isLoading - Loading state
 * @param {string} emptyMessage - Message to show when no data
 * @param {Function} onRowClick - Optional row click handler
 */
export function DataTable({ 
  columns, 
  data, 
  isLoading, 
  emptyMessage = "No data available",
  onRowClick 
}) {
  if (isLoading) {
    return <LoadingSkeleton type="table" count={1} />;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr 
                key={row._id || row.id || index}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

