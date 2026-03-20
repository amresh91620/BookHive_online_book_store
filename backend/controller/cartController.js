// controllers/cartController.js
const Cart = require("../models/Cart");
const User = require("../models/User");

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.book"
  );
  res.json(cart || { items: [] });
};

exports.addToCart = async (req, res) => {
  const { bookId, quantity = 1 } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [{ book: bookId, quantity }],
    });
  } else {
    const item = cart.items.find((i) => i.book.toString() === bookId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ book: bookId, quantity });
    }
    await cart.save();
  }

  await User.findByIdAndUpdate(req.user.id, {
    $pull: { wishlist: bookId },
  });

  await cart.populate("items.book");

  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();

  await cart.populate("items.book");

  res.json(cart);
};

exports.updateQuantity = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });

  const item = cart.items.id(req.params.itemId);
  item.quantity = quantity;
  await cart.save();

  await cart.populate("items.book");

  res.json(cart);
};
