const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const Book = require("../models/Book");
const Settings = require("../models/Settings");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const sendRefundEmail = require("../utils/sendRefundEmail");

const PAYMENT_METHODS = ["COD", "ONLINE"];
const CANCEL_ALLOWED_STATUSES = ["Pending", "Processing"];

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const pad2 = (value) => String(value).padStart(2, "0");

const generateOrderNumber = () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(
    now.getDate()
  )}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${datePart}-${rand}`;
};

const generateUniqueOrderNumber = async () => {
  for (let i = 0; i < 5; i += 1) {
    const candidate = generateOrderNumber();
    const exists = await Order.exists({ orderNumber: candidate });
    if (!exists) return candidate;
  }
  return `ORD-${Date.now()}-${Math.random().toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
};

const reserveStock = async (items) => {
  const updated = [];

  for (const item of items) {
    const book = await Book.findOneAndUpdate(
      { _id: item.book, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity, totalSales: item.quantity } },
      { new: true }
    );

    if (!book) {
      await Promise.all(
        updated.map((prev) =>
          Book.findByIdAndUpdate(prev.book, {
            $inc: { stock: prev.quantity, totalSales: -prev.quantity },
          })
        )
      );
      return { ok: false, title: item.title || "this item" };
    }

    updated.push({ book: item.book, quantity: item.quantity });
  }

  return { ok: true };
};

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { addressId } = req.body || {};

    if (!addressId) {
      return res.status(400).json({ msg: "Address is required" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.book");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const selectedAddress = user.address.id(addressId);
    if (!selectedAddress) {
      return res.status(400).json({ msg: "Address not found" });
    }

    // Check stock
    for (const item of cart.items) {
      if (!item.book) {
        return res.status(400).json({ msg: "Invalid cart item" });
      }
      if (item.book.stock < item.quantity) {
        return res.status(400).json({
          msg: `Insufficient stock for ${item.book.title}`,
        });
      }
    }

    const items = cart.items.map((item) => ({
      book: item.book._id,
      title: item.book.title,
      author: item.book.author,
      coverImage: item.book.coverImage,
      price: Number(item.book.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    // Get settings for tax and delivery calculation
    const settings = await Settings.getSettings();
    
    // Calculate tax
    const tax = settings.taxEnabled ? Math.ceil(subtotal * settings.taxRate) : 0;
    
    // Calculate delivery charge
    const shipping = settings.deliveryEnabled && subtotal < settings.freeDeliveryThreshold 
      ? settings.deliveryCharge 
      : 0;
    
    const total = subtotal + shipping + tax;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.id,
        addressId: addressId,
      },
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: total,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
      subtotal,
      tax,
      shipping,
      total,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({ msg: error.message || "Failed to create payment order" });
  }
};

// Verify Razorpay Payment
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ msg: "Missing payment details" });
    }

    if (!addressId) {
      return res.status(400).json({ msg: "Address is required" });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ msg: "Invalid payment signature" });
    }

    // Payment verified, create order
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.book");
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    const selectedAddress = user.address.id(addressId);
    if (!selectedAddress) {
      return res.status(400).json({ msg: "Address not found" });
    }

    const items = cart.items.map((item) => ({
      book: item.book._id,
      title: item.book.title,
      author: item.book.author,
      coverImage: item.book.coverImage,
      price: Number(item.book.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    // Get settings for tax and delivery calculation
    const settings = await Settings.getSettings();
    
    // Calculate tax
    const tax = settings.taxEnabled ? Math.ceil(subtotal * settings.taxRate) : 0;
    
    // Calculate delivery charge
    const shipping = settings.deliveryEnabled && subtotal < settings.freeDeliveryThreshold 
      ? settings.deliveryCharge 
      : 0;
    
    const total = subtotal + shipping + tax;

    const orderNumber = await generateUniqueOrderNumber();
    
    const reserveResult = await reserveStock(items);
    
    if (!reserveResult.ok) {
      return res.status(400).json({
        msg: `Insufficient stock for ${reserveResult.title}`,
      });
    }

    let order;
    try {
      order = await Order.create({
        orderNumber,
        user: req.user.id,
        items,
        address: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        },
        paymentMethod: "ONLINE",
        paymentStatus: "paid",
        status: "Pending",
        statusHistory: [
          {
            status: "Pending",
            at: new Date(),
            by: "user",
            note: "Order placed with online payment",
          },
        ],
        subtotal,
        shipping,
        tax,
        total,
        paymentHistory: [
          {
            status: "paid",
            at: new Date(),
            by: "system",
            note: `Razorpay Payment ID: ${razorpay_payment_id}`,
          },
        ],
      });
      
    } catch (createError) {
      console.error("Order creation failed:", createError);
      await Promise.all(
        items.map((item) =>
          Book.findByIdAndUpdate(item.book, {
            $inc: { stock: item.quantity, totalSales: -item.quantity },
          })
        )
      );
      throw createError;
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({
      msg: "Payment verified and order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ 
      msg: error.message || "Failed to verify payment",
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body || {};
    const normalizedMethod = String(paymentMethod || "COD").toUpperCase();

    if (!addressId) {
      return res.status(400).json({ msg: "Address is required" });
    }
    if (!PAYMENT_METHODS.includes(normalizedMethod)) {
      return res.status(400).json({ msg: "Invalid payment method" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.book"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const selectedAddress = user.address.id(addressId);
    if (!selectedAddress) {
      return res.status(400).json({ msg: "Address not found" });
    }

    for (const item of cart.items) {
      if (!item.book) {
        return res.status(400).json({ msg: "Invalid cart item" });
      }
      if (item.book.stock < item.quantity) {
        return res.status(400).json({
          msg: `Insufficient stock for ${item.book.title}`,
        });
      }
    }

    const items = cart.items.map((item) => ({
      book: item.book._id,
      title: item.book.title,
      author: item.book.author,
      coverImage: item.book.coverImage,
      price: Number(item.book.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    // Get settings for tax and delivery calculation
    const settings = await Settings.getSettings();
    
    // Calculate tax
    const tax = settings.taxEnabled ? Math.round(subtotal * settings.taxRate) : 0;
    
    // Calculate delivery charge
    const shipping = settings.deliveryEnabled && subtotal < settings.freeDeliveryThreshold 
      ? settings.deliveryCharge 
      : 0;
    
    const total = subtotal + shipping + tax;

    const paymentStatus = normalizedMethod === "COD" ? "pending" : "paid";
    const orderNumber = await generateUniqueOrderNumber();

    const reserveResult = await reserveStock(items);
    if (!reserveResult.ok) {
      return res.status(400).json({
        msg: `Insufficient stock for ${reserveResult.title}`,
      });
    }

    let order;
    try {
      order = await Order.create({
        orderNumber,
        user: req.user.id,
        items,
        address: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        },
        paymentMethod: normalizedMethod,
        paymentStatus,
        status: "Pending",
        statusHistory: [
          {
            status: "Pending",
            at: new Date(),
            by: "user",
            note: "Order placed",
          },
        ],
        subtotal,
        shipping,
        tax,
        total,
        paymentHistory: [
          {
            status: paymentStatus,
            at: new Date(),
            by: "system",
            note:
              normalizedMethod === "COD"
                ? "Cash on Delivery"
                : "Payment received",
          },
        ],
      });
    } catch (createError) {
      await Promise.all(
        items.map((item) =>
          Book.findByIdAndUpdate(item.book, {
            $inc: { stock: item.quantity, totalSales: -item.quantity },
          })
        )
      );
      throw createError;
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({
      msg: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ msg: "Failed to place order" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ msg: "Failed to fetch orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ msg: "Failed to fetch order" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body || {};
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (!CANCEL_ALLOWED_STATUSES.includes(order.status)) {
      return res
        .status(400)
        .json({ msg: "Order cannot be cancelled at this stage" });
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    if (reason) {
      order.cancellationReason = String(reason).slice(0, 200);
    }
    order.statusHistory = [
      ...(order.statusHistory || []),
      {
        status: "Cancelled",
        at: new Date(),
        by: "user",
        note: reason ? String(reason).slice(0, 200) : "Cancelled by user",
      },
    ];
    
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
            speed: "normal",
            notes: {
              order_id: order.orderNumber,
              reason: reason || "Order cancelled by user",
            },
          });
          
          order.paymentStatus = "refunded";
          order.paymentHistory = [
            ...(order.paymentHistory || []),
            {
              status: "refunded",
              at: new Date(),
              by: "system",
              note: `Razorpay Refund ID: ${refund.id} - ${reason || "Cancelled by user"}`,
            },
          ];
        } else {
          order.paymentStatus = "refunded";
          order.paymentHistory = [
            ...(order.paymentHistory || []),
            {
              status: "refunded",
              at: new Date(),
              by: "system",
              note: `Refund pending - Manual processing required. ${reason || "Cancelled by user"}`,
            },
          ];
        }
      } catch (refundError) {
        console.error("Razorpay refund error:", refundError);
        order.paymentStatus = "refunded";
        order.paymentHistory = [
          ...(order.paymentHistory || []),
          {
            status: "refunded",
            at: new Date(),
            by: "system",
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
          by: "system",
          note: "Auto-refund on cancellation",
        },
      ];
    }
    
    await order.save();

    await Promise.all(
      order.items.map((item) =>
        Book.findByIdAndUpdate(item.book, {
          $inc: { stock: item.quantity, totalSales: -item.quantity },
        })
      )
    );

    // Send refund email to user
    try {
      const user = await User.findById(req.user.id);
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
          cancelledBy: "user",
          cancellationReason: reason || null,
          paymentMethod: order.paymentMethod,
        });
      }
    } catch (emailError) {
      console.error("Failed to send refund email:", emailError);
      // Don't fail the cancellation if email fails
    }

    res.json({ msg: "Order cancelled", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ msg: "Failed to cancel order" });
  }
};
