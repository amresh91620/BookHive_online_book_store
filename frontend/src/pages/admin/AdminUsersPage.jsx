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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <LoadingSkeleton type="table" count={1} />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-amber-600 font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            {user.phone && (
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {shortDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.isBlocked ? "destructive" : "success"}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role !== "admin" && (
                          <Button
                            variant={user.isBlocked ? "outline" : "destructive"}
                            size="sm"
                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                          >
                            {user.isBlocked ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <Ban className="w-4 h-4 mr-1" />
                                Block
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
        )}
    </div>
  );
}
