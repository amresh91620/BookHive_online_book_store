import { useState } from "react";
import { useActivityLogs, useActivityStats } from "@/hooks/api/useActivityLogs";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Search, Activity, User, Clock, TrendingUp } from "lucide-react";
import { shortDate } from "@/utils/format";

const ITEMS_PER_PAGE = 50;

const ACTION_COLORS = {
  user_login: "bg-blue-100 text-blue-800",
  user_register: "bg-green-100 text-green-800",
  user_blocked: "bg-red-100 text-red-800",
  user_unblocked: "bg-green-100 text-green-800",
  user_deleted: "bg-red-100 text-red-800",
  order_created: "bg-purple-100 text-purple-800",
  order_updated: "bg-blue-100 text-blue-800",
  order_cancelled: "bg-red-100 text-red-800",
  book_created: "bg-green-100 text-green-800",
  book_updated: "bg-blue-100 text-blue-800",
  book_deleted: "bg-red-100 text-red-800",
  review_created: "bg-amber-100 text-amber-800",
  review_deleted: "bg-red-100 text-red-800",
  blog_created: "bg-green-100 text-green-800",
  blog_updated: "bg-blue-100 text-blue-800",
  blog_deleted: "bg-red-100 text-red-800",
  settings_updated: "bg-purple-100 text-purple-800",
  message_deleted: "bg-red-100 text-red-800",
};

export default function AdminActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: logsData, isLoading } = useActivityLogs({
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    action: actionFilter || undefined,
  });

  const { data: stats } = useActivityStats();

  const logs = logsData?.logs || [];
  const total = logsData?.total || 0;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatAction = (action) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const actionTypes = [
    "user_login",
    "user_register",
    "user_blocked",
    "user_unblocked",
    "order_created",
    "order_updated",
    "order_cancelled",
    "book_created",
    "book_updated",
    "book_deleted",
    "review_created",
    "review_deleted",
  ];

  return (
    <div className="admin-page p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
          Activity Logs
        </h1>
        <p className="text-stone-600 mt-2 font-semibold">
          Track all admin and user activities
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-2 border-stone-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Total Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-stone-900">{stats.totalLogs}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Today's Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">{stats.todayLogs}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Most Common
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-amber-700">
                {stats.actionStats[0]
                  ? formatAction(stats.actionStats[0]._id)
                  : "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-6 border-2 border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by user or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Action Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={actionFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setActionFilter("")}
              className={
                actionFilter === ""
                  ? "bg-gradient-to-r from-amber-600 to-amber-700"
                  : "border-2"
              }
            >
              All Actions
            </Button>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-sm border-2 border-stone-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
            >
              <option value="">All Actions</option>
              {actionTypes.map((action) => (
                <option key={action} value={action}>
                  {formatAction(action)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Logs List */}
      {isLoading ? (
        <AdminSkeleton type="activity-log" count={10} />
      ) : filteredLogs.length === 0 ? (
        <Card className="p-12 text-center border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-amber-50/30">
          <Activity className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 font-medium text-lg mb-2">No activity logs found</p>
          <p className="text-stone-400 text-sm">
            {searchQuery || actionFilter 
              ? "Try adjusting your search or filters" 
              : "Activity logs will appear here as actions are performed"}
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <Card
                key={log._id}
                className="p-4 border-2 border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-md flex-shrink-0">
                      <User className="w-5 h-5 text-amber-700" />
                    </div>

                    {/* Log Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-stone-900">
                          {log.user?.name || "Unknown User"}
                        </span>
                        <Badge
                          className={`${
                            ACTION_COLORS[log.action] || "bg-[#f5ece3] text-stone-800"
                          } shadow-sm`}
                        >
                          {formatAction(log.action)}
                        </Badge>
                      </div>
                      <p className="text-sm text-stone-600 mb-1">
                        {log.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {shortDate(log.createdAt)}
                        </span>
                        {log.ipAddress && (
                          <span>IP: {log.ipAddress}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
