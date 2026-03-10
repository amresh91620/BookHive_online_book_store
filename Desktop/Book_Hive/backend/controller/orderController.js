const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const Book = require("../models/Book");

const PAYMENT_METHODS = ["COD"];
const CANCEL_ALLOWED_STATUSES = ["Pending", "Processing"];

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
    const shipping = 0;
    const tax = 0;
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
    if (order.paymentStatus === "paid") {
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

    res.json({ msg: "Order cancelled", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ msg: "Failed to cancel order" });
  }
};
