import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminMessages, deleteAdminMessage } from "@/store/slices/adminSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, Trash2, Mail, User, Phone } from "lucide-react";
import { shortDate } from "@/utils/format";
import toast from "react-hot-toast";

export default function AdminMessagesPage() {
  const dispatch = useDispatch();
  const { messages = [], status } = useSelector((state) => state.admin);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, messageId: null });
  const [viewDialog, setViewDialog] = useState({ open: false, message: null });

  useEffect(() => {
    dispatch(fetchAdminMessages());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!deleteDialog.messageId) return;
    
    try {
      await dispatch(deleteAdminMessage(deleteDialog.messageId)).unwrap();
      toast.success("Message deleted successfully");
      setDeleteDialog({ open: false, messageId: null });
      dispatch(fetchAdminMessages());
    } catch (error) {
      toast.error(error || "Failed to delete message");
    }
  };

  const filteredMessages = Array.isArray(messages) ? messages.filter((message) => {
    const matchesSearch =
      message.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }) : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600 mt-1">Total: {Array.isArray(messages) ? messages.length : 0} messages</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Messages List */}
      {status === "loading" ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No messages found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((message) => (
            <Card key={message._id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Mail className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {message.subject}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {shortDate(message.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{message.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{message.email}</span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{message.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Message Preview */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {message.message}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewDialog({ open: true, message })}
                    >
                      View Full Message
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, messageId: message._id })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, message: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewDialog.message?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-gray-900">{viewDialog.message?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{viewDialog.message?.email}</p>
              </div>
              {viewDialog.message?.phone && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{viewDialog.message.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-gray-900">{shortDate(viewDialog.message?.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {viewDialog.message?.message}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, message: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, messageId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, messageId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
