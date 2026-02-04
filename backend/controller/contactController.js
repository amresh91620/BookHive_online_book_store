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
    const messages = await Contact.find().select("-__v").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalMessages: messages.length,
      messages: messages, // ✅ Changed to plural
    });
  } catch (error) {
    console.error("Get all messages error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

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