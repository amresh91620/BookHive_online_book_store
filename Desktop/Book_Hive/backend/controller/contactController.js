const Contact = require("../models/Contact");

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newMessage = new Contact({
      name,
      email,
      message,
    });

    await newMessage.save();

    res.status(201).json({ msg: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserAllMessages = async (req, res) => {
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
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ];
    }

    const total = await Contact.countDocuments(filter);
    
    const messages = await Contact.find(filter)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.status(200).json({
      success: true,
      messages,
      total,
      offset,
      limit
    });
  } catch (error) {
    console.error("Get all messages error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Alias for admin
exports.getAllMessages = exports.getUserAllMessages;

exports.deleteUserMessage = async (req, res) => {
  try {
    const deletedMessage = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedMessage) {
      return res.status(404).json({ 
        success: false, 
        msg: "Message not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      msg: "Message deleted successfully" 
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Alias for admin
exports.deleteMessage = exports.deleteUserMessage;