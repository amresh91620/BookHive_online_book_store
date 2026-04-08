import { useState } from "react";
import { useAdminUsers, useToggleUserBlock } from "@/hooks/api/useAdmin";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Search, Ban, CheckCircle, Download } from "lucide-react";
import { shortDate } from "@/utils/format";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 20;

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const { data: usersData, isLoading } = useAdminUsers();
  const toggleUserBlock = useToggleUserBlock();

  const users = usersData?.users || [];

  const handleToggleBlock = async (userId, currentStatus) => {
    toggleUserBlock.mutate(
      { userId, isBlocked: !currentStatus },
      {
        onSuccess: () => toast.success(currentStatus ? "User unblocked" : "User blocked"),
        onError: (error) => toast.error(error?.response?.data?.msg || "Failed to update user"),
      }
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bulk actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedUsers.filter(u => u.role !== "admin").map(u => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkBlock = async (shouldBlock) => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users first");
      return;
    }
    
    if (!window.confirm(`${shouldBlock ? 'Block' : 'Unblock'} ${selectedUsers.length} users?`)) {
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;

      for (const userId of selectedUsers) {
        try {
          await toggleUserBlock.mutateAsync({ userId, isBlocked: shouldBlock });
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to update user ${userId}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} user(s) ${shouldBlock ? 'blocked' : 'unblocked'} successfully`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} user(s) failed to update`);
      }
      
      setSelectedUsers([]);
    } catch (error) {
      toast.error("Failed to update users");
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (filteredUsers.length === 0) {
      toast.error("No users to export");
      return;
    }

    try {
      const csvData = filteredUsers.map(user => ({
        Name: user.name || "",
        Email: user.email || "",
        Phone: user.phone || "",
        Role: user.role || "",
        Status: user.isBlocked ? "Blocked" : "Active",
        Joined: new Date(user.createdAt).toLocaleDateString()
      }));

      const headers = Object.keys(csvData[0]).join(",");
      const rows = csvData.map(row => Object.values(row).join(","));
      const csv = [headers, ...rows].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${filteredUsers.length} users exported successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export users");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
            Manage Users
          </h1>
          <p className="text-stone-600 mt-2">Total: {filteredUsers.length} users</p>
        </div>
        <Button 
          onClick={handleExport}
          variant="outline"
          className="border-2 border-green-600 text-green-700 hover:bg-green-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card className="mb-6 p-4 border-2 border-amber-300 bg-amber-50/50">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-stone-900">
                {selectedUsers.length} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkBlock(true)}
                >
                  <Ban className="w-4 h-4 mr-1" />
                  Block All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkBlock(false)}
                  className="border-2 border-green-600 text-green-700 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Unblock All
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6 animate-slide-in-right stagger-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Users Table/Cards */}
        {isLoading ? (
          <LoadingSkeleton type="table" count={1} />
        ) : (
          <>
            {/* Desktop Table */}
            <Card className="hidden md:block border-2 border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-up stagger-2 bg-white/80 backdrop-blur-sm">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-stone-50 to-amber-50/50 border-b-2 border-stone-200">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === paginatedUsers.filter(u => u.role !== "admin").length && paginatedUsers.filter(u => u.role !== "admin").length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-stone-300"
                      />
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginatedUsers.map((user) => (
                    <tr 
                      key={user._id} 
                      className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-stone-50 transition-all duration-200"
                    >
                      <td className="px-4 py-4">
                        {user.role !== "admin" && (
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="w-4 h-4 rounded border-stone-300"
                          />
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-md">
                            <span className="text-amber-700 font-bold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-stone-900 truncate">{user.name}</div>
                            {user.phone && (
                              <div className="text-sm text-stone-500 truncate">{user.phone}</div>
                            )}
                            <div className="md:hidden text-xs text-stone-400 truncate">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-stone-900">{user.email}</td>
                      <td className="hidden lg:table-cell px-6 py-4">
                        <Badge 
                          variant={user.role === "admin" ? "default" : "secondary"}
                          className={user.role === "admin" ? "bg-gradient-to-r from-amber-600 to-amber-700 shadow-sm" : "shadow-sm"}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 text-sm text-stone-900">
                        {shortDate(user.createdAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Badge 
                          variant={user.isBlocked ? "destructive" : "success"}
                          className="shadow-sm"
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        {user.role !== "admin" && (
                          <Button
                            variant={user.isBlocked ? "outline" : "destructive"}
                            size="sm"
                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                            className={user.isBlocked ? "border-2 hover:bg-green-50 hover:text-green-700 hover:border-green-500 transition-all" : "hover:scale-105 transition-transform"}
                          >
                            {user.isBlocked ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Unblock</span>
                              </>
                            ) : (
                              <>
                                <Ban className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Block</span>
                              </>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 animate-scale-up stagger-2">
            {paginatedUsers.map((user) => (
              <Card key={user._id} className="p-4 border-2 border-stone-200 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-amber-700 font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 truncate">{user.name}</h3>
                    <p className="text-sm text-stone-600 truncate">{user.email}</p>
                    {user.phone && <p className="text-xs text-stone-500">{user.phone}</p>}
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"} className={user.role === "admin" ? "bg-gradient-to-r from-amber-600 to-amber-700 shadow-sm" : "shadow-sm"}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.isBlocked ? "destructive" : "success"} className="shadow-sm">
                    {user.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </div>
                <div className="text-sm text-stone-600 mb-3">
                  Joined: {shortDate(user.createdAt)}
                </div>
                {user.role !== "admin" && (
                  <Button variant={user.isBlocked ? "outline" : "destructive"} size="sm" onClick={() => handleToggleBlock(user._id, user.isBlocked)} className={user.isBlocked ? "w-full border-2 hover:bg-green-50 hover:text-green-700 hover:border-green-500" : "w-full"}>
                    {user.isBlocked ? (
                      <><CheckCircle className="w-4 h-4 mr-2" />Unblock User</>
                    ) : (
                      <><Ban className="w-4 h-4 mr-2" />Block User</>
                    )}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 animate-fade-in-up">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
    </div>
  );
}

