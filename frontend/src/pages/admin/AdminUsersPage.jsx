import { useState } from "react";
import { useAdminUsers, useToggleUserBlock } from "@/hooks/api/useAdmin";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Ban, CheckCircle } from "lucide-react";
import { shortDate } from "@/utils/format";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent mb-8 animate-fade-in-up">
        Manage Users
      </h1>

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
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user._id} 
                      className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-stone-50 transition-all duration-200"
                    >
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
            {filteredUsers.map((user) => (
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
    </div>
  );
}

