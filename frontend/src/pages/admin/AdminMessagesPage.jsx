import { useState } from "react";
import { useAdminMessages, useDeleteAdminMessage } from "@/hooks/api/useAdmin";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, Trash2, Mail, User, Phone, Download } from "lucide-react";
import { shortDate } from "@/utils/format";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 20;

export default function AdminMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, messageId: null });
  const [viewDialog, setViewDialog] = useState({ open: false, message: null });
  
  const { data: messagesData, isLoading } = useAdminMessages();
  const deleteMessage = useDeleteAdminMessage();

  const messages = messagesData?.messages || [];

  const handleDelete = async () => {
    if (!deleteDialog.messageId) return;
    
    deleteMessage.mutate(deleteDialog.messageId, {
      onSuccess: () => {
        toast.success("Message deleted successfully");
        setDeleteDialog({ open: false, messageId: null });
      },
      onError: (error) => toast.error(error?.response?.data?.msg || "Failed to delete message"),
    });
  };

  const filteredMessages = Array.isArray(messages) ? messages.filter((message) => {
    const matchesSearch =
      message.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }) : [];

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) {
      toast.error("Please select messages first");
      return;
    }
    
    if (!window.confirm(`Delete ${selectedMessages.length} messages?`)) {
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;

      for (const messageId of selectedMessages) {
        try {
          await deleteMessage.mutateAsync(messageId);
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to delete message ${messageId}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} message(s) deleted successfully`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} message(s) failed to delete`);
      }
      
      setSelectedMessages([]);
    } catch (error) {
      toast.error("Failed to delete messages");
    }
  };

  // Export to CSV
  const handleExport = () => {
    const csvData = filteredMessages.map(message => ({
      Name: message.name,
      Email: message.email,
      Phone: message.phone || "",
      Subject: message.subject,
      Message: message.message?.replace(/,/g, ";") || "",
      Date: new Date(message.createdAt).toLocaleDateString()
    }));

    const headers = Object.keys(csvData[0]).join(",");
    const rows = csvData.map(row => Object.values(row).map(v => `"${v}"`).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Messages exported successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-stone-900 via-amber-900 to-stone-800 bg-clip-text text-transparent">
            Contact Messages
          </h1>
          <p className="text-stone-600 mt-2 font-semibold">Total: {filteredMessages.length} messages</p>
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
      {selectedMessages.length > 0 && (
        <Card className="mb-6 p-4 border-2 border-red-300 bg-red-50/50">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-stone-900">
              {selectedMessages.length} selected
            </span>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete All
            </Button>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-6 border-2 border-stone-200 animate-slide-in-right stagger-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2 border-stone-200 focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <LoadingSkeleton type="list" count={5} />
      ) : filteredMessages.length === 0 ? (
        <Card className="p-12 text-center border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-amber-50/30 animate-scale-up stagger-2">
          <Mail className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 font-medium">No messages found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {paginatedMessages.map((message) => (
            <Card 
              key={message._id} 
              className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border-2 border-stone-200 hover:border-amber-300 bg-white/80 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(message._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMessages(prev => [...prev, message._id]);
                      } else {
                        setSelectedMessages(prev => prev.filter(id => id !== message._id));
                      }
                    }}
                    className="w-4 h-4 rounded border-stone-300 mt-1"
                  />
                  
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-md">
                        <Mail className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-stone-900 truncate">
                          {message.subject}
                        </h3>
                        <p className="text-sm text-stone-500">
                          {shortDate(message.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <span className="text-sm text-stone-700 font-medium truncate">{message.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <span className="text-sm text-stone-700 truncate">{message.email}</span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-stone-400 flex-shrink-0" />
                        <span className="text-sm text-stone-700">{message.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Message Preview */}
                  <p className="text-stone-600 text-sm line-clamp-2 mb-4">
                    {message.message}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewDialog({ open: true, message })}
                      className="border-2 hover:border-amber-500 hover:bg-amber-50 transition-all"
                    >
                      View Full Message
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, messageId: message._id })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
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

      {/* View Message Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, message: null })}>
        <DialogContent className="max-w-2xl border-2 border-stone-200">
          <DialogHeader>
            <DialogTitle className="text-stone-900">{viewDialog.message?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-500">Name</p>
                <p className="text-stone-900">{viewDialog.message?.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-500">Email</p>
                <p className="text-stone-900">{viewDialog.message?.email}</p>
              </div>
              {viewDialog.message?.phone && (
                <div>
                  <p className="text-sm font-semibold text-stone-500">Phone</p>
                  <p className="text-stone-900">{viewDialog.message.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-stone-500">Date</p>
                <p className="text-stone-900">{shortDate(viewDialog.message?.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-500 mb-2">Message</p>
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                {viewDialog.message?.message}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, message: null })}
              className="border-2 hover:border-stone-400"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, messageId: null })}>
        <DialogContent className="border-2 border-stone-200">
          <DialogHeader>
            <DialogTitle className="text-stone-900">Delete Message</DialogTitle>
            <DialogDescription className="text-stone-600">
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, messageId: null })}
              className="border-2 hover:border-stone-400"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="hover:scale-105 transition-transform"
            >
              Delete Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

