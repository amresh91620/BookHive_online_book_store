import { useState } from "react";
import { useAdminUsers, useToggleUserBlock } from "@/hooks/api/useAdmin";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Search, Ban, CheckCircle, Download, Users, Shield } from "lucide-react";
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

  const avatarColors = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-amber-400 to-amber-600",
    "from-cyan-400 to-cyan-600",
    "from-rose-400 to-rose-600",
  ];

  const getAvatarColor = (name) => {
    const idx = (name || "A").charCodeAt(0) % avatarColors.length;
    return avatarColors[idx];
  };

  return (
    <div className="admin-page p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
            Manage Users
          </h1>
          <p className="text-stone-500 mt-1.5 text-sm font-medium">
            {filteredUsers.length} registered users
          </p>
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
        <Card className="mb-6 p-4 border-2 border-amber-300 bg-amber-50/50 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-stone-900">
              {selectedUsers.length} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={() => handleBulkBlock(true)}>
                <Ban className="w-4 h-4 mr-1" /> Block All
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkBlock(false)} className="border-2 border-green-600 text-green-700 hover:bg-green-50">
                <CheckCircle className="w-4 h-4 mr-1" /> Unblock All
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="mb-6 animate-slide-in-right stagger-1">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors bg-white/80 backdrop-blur-sm rounded-xl h-11"
          />
        </div>
      </div>

      {/* Users Table/Cards */}
      {isLoading ? (
        <AdminSkeleton type="table" />
      ) : filteredUsers.length === 0 ? (
        <div className="admin-table-wrapper p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
            <Users className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-stone-500 font-semibold text-lg mb-1">No users found</p>
          <p className="text-stone-400 text-sm">Try adjusting your search</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block admin-table-wrapper animate-scale-up stagger-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="admin-thead">
                  <tr>
                    <th style={{width: '40px', paddingLeft: '16px'}}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === paginatedUsers.filter(u => u.role !== "admin").length && paginatedUsers.filter(u => u.role !== "admin").length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-stone-300 accent-amber-600"
                      />
                    </th>
                    <th style={{width: '44px'}}>#</th>
                    <th>User</th>
                    <th className="hidden lg:table-cell">Email</th>
                    <th className="hidden lg:table-cell">Role</th>
                    <th className="hidden xl:table-cell">Joined</th>
                    <th>Status</th>
                    <th style={{textAlign: 'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody className="admin-tbody">
                  {paginatedUsers.map((user, idx) => (
                    <tr key={user._id}>
                      <td className="admin-td" style={{paddingLeft: '16px'}}>
                        {user.role !== "admin" && (
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="w-4 h-4 rounded border-stone-300 accent-amber-600"
                          />
                        )}
                      </td>
                      <td className="admin-td">
                        <span className="admin-row-num">{startIndex + idx + 1}</span>
                      </td>
                      <td className="admin-td">
                        <div className="flex items-center gap-3">
                          <div className={`admin-avatar bg-gradient-to-br ${getAvatarColor(user.name)} text-white shadow-sm`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="admin-cell-primary truncate">{user.name}</div>
                            {user.phone && <div className="admin-cell-secondary">{user.phone}</div>}
                            <div className="lg:hidden admin-cell-secondary truncate">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="admin-td hidden lg:table-cell">
                        <span className="text-sm text-stone-600 truncate">{user.email}</span>
                      </td>
                      <td className="admin-td hidden lg:table-cell">
                        {user.role === "admin" ? (
                          <span className="admin-status info">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="admin-status default">
                            <span className="dot" />
                            User
                          </span>
                        )}
                      </td>
                      <td className="admin-td hidden xl:table-cell">
                        <span className="text-sm text-stone-500">{shortDate(user.createdAt)}</span>
                      </td>
                      <td className="admin-td">
                        <span className={`admin-status ${user.isBlocked ? 'danger' : 'success'}`}>
                          <span className="dot" />
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="admin-td">
                        <div className="admin-actions justify-end">
                          {user.role !== "admin" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                              className={`text-xs h-8 px-3 rounded-lg transition-all ${
                                user.isBlocked
                                  ? "text-green-700 hover:bg-green-50 hover:text-green-800"
                                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
                              }`}
                            >
                              {user.isBlocked ? (
                                <><CheckCircle className="w-3.5 h-3.5 mr-1" /><span className="hidden sm:inline">Unblock</span></>
                              ) : (
                                <><Ban className="w-3.5 h-3.5 mr-1" /><span className="hidden sm:inline">Block</span></>
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="admin-table-footer flex items-center justify-between">
              <span>Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users</span>
              <span className="text-xs text-stone-400">Page {currentPage} of {totalPages || 1}</span>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 animate-scale-up stagger-2">
            {paginatedUsers.map((user) => (
              <div key={user._id} className="admin-mobile-card">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`admin-avatar bg-gradient-to-br ${getAvatarColor(user.name)} text-white shadow-md text-lg w-12 h-12`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 truncate">{user.name}</h3>
                    <p className="text-sm text-stone-500 truncate">{user.email}</p>
                    {user.phone && <p className="text-xs text-stone-400">{user.phone}</p>}
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  {user.role === "admin" ? (
                    <span className="admin-status info text-xs"><Shield className="w-3 h-3" /> Admin</span>
                  ) : (
                    <span className="admin-status default text-xs"><span className="dot" /> User</span>
                  )}
                  <span className={`admin-status text-xs ${user.isBlocked ? 'danger' : 'success'}`}>
                    <span className="dot" />
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
                <div className="text-xs text-stone-400 mb-3">Joined: {shortDate(user.createdAt)}</div>
                {user.role !== "admin" && (
                  <Button
                    variant={user.isBlocked ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                    className={`w-full text-xs h-9 ${user.isBlocked ? "border-2 border-green-500 text-green-700 hover:bg-green-50" : ""}`}
                  >
                    {user.isBlocked ? (
                      <><CheckCircle className="w-4 h-4 mr-2" />Unblock User</>
                    ) : (
                      <><Ban className="w-4 h-4 mr-2" />Block User</>
                    )}
                  </Button>
                )}
              </div>
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
