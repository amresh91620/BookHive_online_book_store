const User = require("../models/User");
const Book = require("../models/Book");
const Review = require("../models/Review");
const Order = require("../models/Order");
const Contact = require("../models/Contact");
const Razorpay = require("razorpay");
const sendRefundEmail = require("../utils/sendRefundEmail");
const { createLog } = require("./activityLogController");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const ORDER_TRANSITIONS = {
    Pending: ["Processing", "Cancelled"],
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
};

const PAYMENT_TRANSITIONS = {
    pending: ["paid", "failed"],
    paid: ["refunded"],
    failed: ["pending"],
    refunded: [],
};


exports.getDashboardStats = async (req, res) => {
    try {
        const [
          totalUsers,
          totalBooks,
          totalReviews,
          totalOrders,
          totalMessages,
          pendingOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          pendingPayments,
          paidPayments,
          failedPayments,
          refundedPayments,
        ] = await Promise.all([
          User.countDocuments({ role: "user" }),
          Book.countDocuments(),
          Review.countDocuments(),
          Order.countDocuments(),
          Contact.countDocuments(),
          Order.countDocuments({ status: "Pending" }),
          Order.countDocuments({ status: "Processing" }),
          Order.countDocuments({ status: "Shipped" }),
          Order.countDocuments({ status: "Delivered" }),
          Order.countDocuments({ status: "Cancelled" }),
          Order.countDocuments({ paymentStatus: "pending" }),
          Order.countDocuments({ paymentStatus: "paid" }),
          Order.countDocuments({ paymentStatus: "failed" }),
          Order.countDocuments({ paymentStatus: "refunded" }),
        ]);

        const revenueAgg = await Order.aggregate([
          { $group: { _id: "$paymentStatus", total: { $sum: "$total" } } },
        ]);

        const revenueMap = revenueAgg.reduce((acc, row) => {
          acc[row._id] = row.total;
          return acc;
        }, {});

        const totalPaid = revenueMap.paid || 0;
        const totalRefunded = revenueMap.refunded || 0;
        const totalRevenue = totalPaid - totalRefunded;

        res.json({
            totalUsers,
            totalBooks,
            totalReviews,
            totalOrders,
            totalMessages,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            pendingPayments,
            paidPayments,
            failedPayments,
            refundedPayments,
            totalPaid,
            totalRefunded,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getAllUsers = async (req, res) => {
    try {
        const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
        const limitRaw = parseInt(req.query.limit, 10);
        const limit = Number.isFinite(limitRaw) ? Math.max(limitRaw, 1) : 20;
        const search = (req.query.q || "").trim();

        const filter = {};
        
        // Search filter
        if (search) {
            const searchRegex = { $regex: search, $options: "i" };
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex }
            ];
        }

        const total = await User.countDocuments(filter);
        
        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        res.status(200).json({
            users,
            total,
            offset,
            limit
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Alias for backward compatibility
exports.getAllUser = exports.getAllUsers;

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (String(req.user?.id) === String(userId)) {
            return res.status(400).json({ msg: "You cannot delete your own account." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        await Review.deleteMany({ user: userId }); 

        await User.findByIdAndDelete(userId);

        // Log activity
        await createLog(
            req.user.id,
            "user_deleted",
            `User ${user.name} (${user.email}) was deleted`,
            { deletedUserId: userId, deletedUserEmail: user.email },
            req
        );

        res.json({ msg: "User and all their reviews deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body || {};

        if (String(req.user?.id) === String(userId)) {
            return res.status(400).json({ msg: "You cannot change your own role." });
        }

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ msg: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ msg: "Role updated", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.toggleUserBlock = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isBlocked } = req.body || {};

        if (String(req.user?.id) === String(userId)) {
            return res.status(400).json({ msg: "You cannot block your own account." });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: Boolean(isBlocked) },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Log activity
        await createLog(
            req.user.id,
            isBlocked ? "user_blocked" : "user_unblocked",
            `User ${user.name} (${user.email}) was ${isBlocked ? "blocked" : "unblocked"}`,
            { targetUserId: userId, targetUserEmail: user.email },
            req
        );

        res.json({ msg: "User status updated", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
        const limitRaw = parseInt(req.query.limit, 10);
        const limit = Number.isFinite(limitRaw) ? Math.max(limitRaw, 1) : 20;
        const search = (req.query.q || "").trim();
        const { status, paymentStatus, from, to } = req.query || {};
        
        const filter = {};
        
        if (status && ORDER_STATUSES.includes(status)) {
            filter.status = status;
        }
        if (paymentStatus && PAYMENT_STATUSES.includes(paymentStatus)) {
            filter.paymentStatus = paymentStatus;
        }

        if (from || to) {
            filter.createdAt = {};
            let startDate;
            let endDate;
            if (from) {
                startDate = new Date(from);
                if (Number.isNaN(startDate.getTime())) {
                    return res.status(400).json({ msg: "Invalid from date" });
                }
                filter.createdAt.$gte = startDate;
            }
            if (to) {
                endDate = new Date(to);
                if (Number.isNaN(endDate.getTime())) {
                    return res.status(400).json({ msg: "Invalid to date" });
                }
                endDate.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = endDate;
            }
            if (startDate && endDate && startDate > endDate) {
                return res.status(400).json({ msg: "From date must be before To date" });
            }
        }

        // Search filter
        if (search) {
            const searchRegex = { $regex: search, $options: "i" };
            filter.$or = [
                { orderNumber: searchRegex }
            ];
        }

        const total = await Order.countDocuments(filter);

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        res.json({ 
            orders, 
            total,
            offset,
            limit
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderByIdAdmin = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        }
        res.json({ order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, note, trackingNumber, carrier, trackingUrl } = req.body || {};
        if (!ORDER_STATUSES.includes(status)) {
            return res.status(400).json({ msg: "Invalid order status" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        }

        const hasTrackingUpdate = Boolean(trackingNumber || carrier || trackingUrl);
        const hasNote = Boolean(note);
        const isStatusChange = order.status !== status;

        if (order.status === "Cancelled") {
            return res.status(400).json({ msg: "Cancelled orders cannot be updated" });
        }

        if (!isStatusChange && !hasTrackingUpdate && !hasNote) {
            return res.json({ msg: "Order already in this status", order });
        }

        if (isStatusChange) {
            const allowedNext = ORDER_TRANSITIONS[order.status] || [];
            if (!allowedNext.includes(status)) {
                return res.status(400).json({ msg: `Cannot move from ${order.status} to ${status}` });
            }
        }
        if (!order.status || !ORDER_STATUSES.includes(order.status)) {
            return res.status(400).json({ msg: "Invalid current order status" });
        }

        const prevStatus = order.status;
        if (isStatusChange) {
            order.status = status;
        }

        if (isStatusChange || hasNote || hasTrackingUpdate) {
            order.statusHistory = [
                ...(order.statusHistory || []),
                {
                    status: order.status,
                    at: new Date(),
                    by: "admin",
                    note: hasNote ? String(note).slice(0, 200) : undefined,
                },
            ];
        }

        if (order.status === "Shipped") {
            if (isStatusChange) {
                order.shippedAt = new Date();
            }
        }

        if (hasTrackingUpdate) {
            order.tracking = {
                carrier: carrier || order.tracking?.carrier,
                trackingNumber: trackingNumber || order.tracking?.trackingNumber,
                trackingUrl: trackingUrl || order.tracking?.trackingUrl,
            };
        }

        if (order.status === "Delivered") {
            if (isStatusChange) {
                order.deliveredAt = new Date();
            }
            if (order.paymentMethod === "COD") {
                if (order.paymentStatus !== "paid") {
                    order.paymentStatus = "paid";
                    order.paymentHistory = [
                        ...(order.paymentHistory || []),
                        {
                            status: "paid",
                            at: new Date(),
                            by: "admin",
                            note: "COD collected on delivery",
                        },
                    ];
                }
            }
        }

        if (order.status === "Cancelled" && prevStatus !== "Cancelled") {
            // Process refund for online payments
            if (order.paymentStatus === "paid" && order.paymentMethod === "ONLINE") {
                try {
                    // Extract payment ID from payment history
                    const paymentNote = order.paymentHistory?.find(h => h.note?.includes("Razorpay Payment ID:"));
                    const paymentId = paymentNote?.note?.split("Razorpay Payment ID: ")[1]?.trim();
                    
                    if (paymentId) {
                        // Create refund in Razorpay
                        const refund = await razorpay.payments.refund(paymentId, {
                            amount: order.total * 100, // Amount in paise
                            speed: "normal", // normal or optimum
                            notes: {
                                order_id: order.orderNumber,
                                reason: note || "Order cancelled by admin",
                            },
                        });
                        
                        order.paymentStatus = "refunded";
                        order.paymentHistory = [
                            ...(order.paymentHistory || []),
                            {
                                status: "refunded",
                                at: new Date(),
                                by: "admin",
                                note: `Razorpay Refund ID: ${refund.id} - ${note || "Order cancelled"}`,
                            },
                        ];
                    } else {
                        // Mark as refunded even if payment ID not found (for manual processing)
                        order.paymentStatus = "refunded";
                        order.paymentHistory = [
                            ...(order.paymentHistory || []),
                            {
                                status: "refunded",
                                at: new Date(),
                                by: "admin",
                                note: `Refund pending - Manual processing required. ${note || "Order cancelled"}`,
                            },
                        ];
                    }
                } catch (refundError) {
                    console.error("Razorpay refund error:", refundError);
                    // Mark as refunded but note the error
                    order.paymentStatus = "refunded";
                    order.paymentHistory = [
                        ...(order.paymentHistory || []),
                        {
                            status: "refunded",
                            at: new Date(),
                            by: "admin",
                            note: `Refund failed - Manual processing required. Error: ${refundError.message}`,
                        },
                    ];
                }
            } else if (order.paymentStatus === "paid") {
                // COD or other payment methods
                order.paymentStatus = "refunded";
                order.paymentHistory = [
                    ...(order.paymentHistory || []),
                    {
                        status: "refunded",
                        at: new Date(),
                        by: "admin",
                        note: "Refund on cancellation",
                    },
                ];
            }
            
            order.cancelledAt = new Date();
            if (note) {
                order.cancellationReason = String(note).slice(0, 200);
            }
            
            // Restore stock
            await Promise.all(
                order.items.map((item) =>
                    Book.findByIdAndUpdate(item.book, {
                        $inc: { stock: item.quantity, totalSales: -item.quantity },
                    })
                )
            );

            // Send refund email to user
            try {
                const user = await User.findById(order.user);
                if (user && user.email) {
                    // Extract refund ID from payment history
                    const refundNote = order.paymentHistory?.find(h => h.note?.includes("Razorpay Refund ID:"));
                    const refundId = refundNote?.note?.split("Razorpay Refund ID: ")[1]?.split(" - ")[0]?.trim();

                    await sendRefundEmail({
                        email: user.email,
                        userName: user.name || "Customer",
                        orderNumber: order.orderNumber,
                        refundAmount: order.total,
                        refundId: refundId || null,
                        cancelledBy: "admin",
                        cancellationReason: note || null,
                        paymentMethod: order.paymentMethod,
                    });
                }
            } catch (emailError) {
                console.error("Failed to send refund email:", emailError);
                // Don't fail the cancellation if email fails
            }
        }

        await order.save();

        // Log activity
        await createLog(
            req.user.id,
            order.status === "Cancelled" ? "order_cancelled" : "order_updated",
            `Order #${order.orderNumber} status changed from ${prevStatus} to ${order.status}`,
            { orderId: order._id, orderNumber: order.orderNumber, oldStatus: prevStatus, newStatus: order.status },
            req
        );

        res.json({ msg: "Order updated", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body || {};
        if (!PAYMENT_STATUSES.includes(paymentStatus)) {
            return res.status(400).json({ msg: "Invalid payment status" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        }

        if (order.status === "Cancelled" && paymentStatus === "paid") {
            return res.status(400).json({ msg: "Cancelled orders cannot be marked paid" });
        }

        if (order.paymentMethod === "COD" && paymentStatus === "paid" && order.status !== "Delivered") {
            return res.status(400).json({ msg: "COD orders can be marked paid only after delivery" });
        }

        if (order.paymentStatus === paymentStatus) {
            return res.json({ msg: "Payment status unchanged", order });
        }

        const allowedPaymentNext = PAYMENT_TRANSITIONS[order.paymentStatus] || [];
        if (!allowedPaymentNext.includes(paymentStatus)) {
            return res.status(400).json({ msg: `Cannot move payment from ${order.paymentStatus} to ${paymentStatus}` });
        }

        order.paymentStatus = paymentStatus;
        order.paymentHistory = [
            ...(order.paymentHistory || []),
            {
                status: paymentStatus,
                at: new Date(),
                by: "admin",
            },
        ];
        await order.save();

        res.json({ msg: "Payment status updated", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel individual item in order (Admin)
exports.cancelOrderItemAdmin = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { reason } = req.body || {};
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        }

        if (order.status === "Delivered") {
            return res.status(400).json({ msg: "Cannot cancel items from delivered orders" });
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({ msg: "Order is already cancelled" });
        }

        const item = order.items.id(itemId);
        if (!item) {
            return res.status(404).json({ msg: "Item not found in order" });
        }

        if (item.status === "cancelled") {
            return res.status(400).json({ msg: "Item already cancelled" });
        }

        // Mark item as cancelled
        item.status = "cancelled";
        item.cancelledAt = new Date();
        item.cancellationReason = reason || "Cancelled by admin";

        // Add to status history
        order.statusHistory = [
            ...(order.statusHistory || []),
            {
                status: "Item Cancelled",
                at: new Date(),
                by: "admin",
                note: `Item "${item.title}" cancelled by admin. ${reason || ""}`,
            },
        ];

        // Restore stock for cancelled item
        await Book.findByIdAndUpdate(item.book, {
            $inc: { stock: item.quantity, totalSales: -item.quantity },
        });

        // Calculate refund amount for this item
        const itemRefundAmount = item.price * item.quantity;
        
        // Recalculate order totals
        const activeItems = order.items.filter(i => i.status === "active");
        
        if (activeItems.length === 0) {
            // All items cancelled, cancel entire order
            order.status = "Cancelled";
            order.cancelledAt = new Date();
            order.cancellationReason = "All items cancelled by admin";
            
            // Process full refund
            if (order.paymentStatus === "paid" && order.paymentMethod === "ONLINE") {
                try {
                    const paymentNote = order.paymentHistory?.find(h => h.note?.includes("Razorpay Payment ID:"));
                    const paymentId = paymentNote?.note?.split("Razorpay Payment ID: ")[1]?.trim();
                    
                    if (paymentId) {
                        const refund = await razorpay.payments.refund(paymentId, {
                            amount: order.total * 100,
                            speed: "normal",
                            notes: {
                                order_id: order.orderNumber,
                                reason: "All items cancelled by admin",
                            },
                        });
                        
                        order.paymentStatus = "refunded";
                        order.paymentHistory = [
                            ...(order.paymentHistory || []),
                            {
                                status: "refunded",
                                at: new Date(),
                                by: "admin",
                                note: `Full refund - Razorpay Refund ID: ${refund.id}`,
                            },
                        ];
                    }
                } catch (refundError) {
                    console.error("Razorpay refund error:", refundError);
                }
            }
        } else {
            // Partial cancellation - process partial refund
            const Settings = require("../models/Settings");
            const settings = await Settings.getSettings();
            
            const newSubtotal = activeItems.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
            );
            
            const newTax = settings.taxEnabled ? Math.ceil(newSubtotal * settings.taxRate) : 0;
            const newShipping = settings.deliveryEnabled && newSubtotal < settings.freeDeliveryThreshold 
                ? settings.deliveryCharge 
                : 0;
            const newTotal = newSubtotal + newShipping + newTax;
            
            const refundAmount = order.total - newTotal;
            
            // Update order totals
            order.subtotal = newSubtotal;
            order.tax = newTax;
            order.shipping = newShipping;
            order.total = newTotal;
            
            // Process partial refund for online payments
            if (order.paymentStatus === "paid" && order.paymentMethod === "ONLINE" && refundAmount > 0) {
                try {
                    const paymentNote = order.paymentHistory?.find(h => h.note?.includes("Razorpay Payment ID:"));
                    const paymentId = paymentNote?.note?.split("Razorpay Payment ID: ")[1]?.trim();
                    
                    if (paymentId) {
                        const refund = await razorpay.payments.refund(paymentId, {
                            amount: Math.round(refundAmount * 100),
                            speed: "normal",
                            notes: {
                                order_id: order.orderNumber,
                                item_title: item.title,
                                reason: reason || "Item cancelled by admin",
                            },
                        });
                        
                        order.paymentHistory = [
                            ...(order.paymentHistory || []),
                            {
                                status: "partial_refund",
                                at: new Date(),
                                by: "admin",
                                note: `Partial refund ₹${refundAmount} for "${item.title}" - Razorpay Refund ID: ${refund.id}`,
                            },
                        ];
                    }
                } catch (refundError) {
                    console.error("Razorpay partial refund error:", refundError);
                    order.paymentHistory = [
                        ...(order.paymentHistory || []),
                        {
                            status: "partial_refund",
                            at: new Date(),
                            by: "admin",
                            note: `Partial refund ₹${refundAmount} pending - Manual processing required`,
                        },
                    ];
                }
            }
        }

        await order.save();

        // Send email notification
        try {
            const user = await User.findById(order.user);
            if (user && user.email) {
                if (activeItems.length === 0) {
                    // Full order cancelled - send full refund email
                    const refundNote = order.paymentHistory?.find(h => h.note?.includes("Razorpay Refund ID:"));
                    const refundId = refundNote?.note?.split("Razorpay Refund ID: ")[1]?.split(" - ")[0]?.trim();

                    await sendRefundEmail({
                        email: user.email,
                        userName: user.name || "Customer",
                        orderNumber: order.orderNumber,
                        refundAmount: order.total,
                        refundId: refundId || null,
                        cancelledBy: "admin",
                        cancellationReason: "All items cancelled by admin",
                        paymentMethod: order.paymentMethod,
                    });
                } else if (refundAmount > 0) {
                    // Partial refund - send notification about item cancellation
                    const refundNote = order.paymentHistory?.find(h => h.note?.includes(`Partial refund ₹${refundAmount}`));
                    const refundId = refundNote?.note?.split("Razorpay Refund ID: ")[1]?.trim();
                    
                    await sendRefundEmail({
                        email: user.email,
                        userName: user.name || "Customer",
                        orderNumber: order.orderNumber,
                        refundAmount: refundAmount,
                        refundId: refundId || null,
                        cancelledBy: "admin",
                        cancellationReason: `Item "${item.title}" cancelled by admin. ${reason || ""}`,
                        paymentMethod: order.paymentMethod,
                    });
                }
            }
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }

        res.json({ 
            msg: activeItems.length === 0 ? "All items cancelled, order cancelled" : "Item cancelled successfully", 
            order 
        });
    } catch (error) {
        console.error("Cancel order item error:", error);
        res.status(500).json({ msg: "Failed to cancel item" });
    }
};





// Block user
exports.blockUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (String(req.user?.id) === String(userId)) {
            return res.status(400).json({ msg: "You cannot block your own account." });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ msg: "User blocked successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Unblock user
exports.unblockUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: false },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ msg: "User unblocked successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
