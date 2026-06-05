import Message from "../Model/messageModel.js";


export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, messageType, content } = req.body;
    if (!sender || !receiver || !content)
      return res.status(400).json({ msg: "Missing required fields" });

    const roomId = [sender, receiver].sort().join("_");

    const newMsg = new Message({ sender, receiver, roomId, content, messageType: messageType || "text",});

    await newMsg.save();

    res.status(201).json({ success: true, message: newMsg });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.query; // using query params
    if (!user1 || !user2) {
      return res.status(400).json({ success: false, msg: "Missing user IDs" });
    }

    // Generate deterministic roomId
    const roomId = [user1, user2].sort().join("_");
    const owner = req.cookies?.uid || user1;

    // Fetch messages (only ones NOT deleted by this user)
    const messages = await Message.find({ roomId, deletedBy: { $ne: owner } })
      .sort({ createdAt: 1 })
      .populate("sender", "name img uniqueId");

    res.status(200).json({
      success: true,
      roomId,
      count: messages.length,
      messages,
    });
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

