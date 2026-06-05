import Contact from "../Model/contactsModel.js";
import User from "../Model/userModel.js";
import Message from "../Model/messageModel.js";

export const getChatList = async (req, res) => {
  try {
    const ownerId = req.cookies?.uid;
    if (!ownerId) {
      return res.status(401).json({ msg: "Unauthorized - User not Logged in" });
    }

    // 1. Get all messages for this user that THEY haven't deleted
    const messages = await Message.find({
      $or: [{ sender: ownerId }, { receiver: ownerId }],
      deletedBy: { $ne: ownerId }
    }).sort({ createdAt: -1 });

    // 2. Collect participant IDs from messages
    const messageParticipantIds = messages.map((m) =>
      m.sender === ownerId ? m.receiver : m.sender
    );

    // 3. Fetch all saved contacts for this user
    const contacts = await Contact.find({ owner: ownerId });

    const contactIds = contacts.map((c) => c.contact);

    // 4. Union of participants (message partners + saved contacts)
    const participantIds = [...new Set([...messageParticipantIds, ...contactIds])];

    // 5. Batch fetch user details
    const users = await User.find({ uniqueId: { $in: participantIds } });

    // Convert to maps for lookup
    const userMap = {};
    users.forEach((u) => (userMap[u.uniqueId] = u));

    const contactMap = {};
    contacts.forEach((c) => (contactMap[c.contact] = c));

    // 6. Build final result
    const result = participantIds.map((pid) => {
      const user = userMap[pid];
      const contact = contactMap[pid];

      // latest message if exists
      const lastMessage = messages.find(
        (m) => m.sender === pid || m.receiver === pid
      );

      return {
        uniqueId: pid,
        name: contact?.nickname || user?.name || "Unknown User",
        img: user?.img || "/default-avatar.jpg",
        isSaved: !!contact,
        lastMessage: lastMessage?.content || null,
        lastMessageAt: lastMessage?.createdAt || null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to fetch chat list" });
  }
};

export const editContact = async (req, res) => {
  try {
    const owner = req.cookies?.uid;
    const { name, cid } = req.body;

    if (!owner) {
      return res.status(401).json({ msg: "Unauthorized - User not Logged in" });
    }

    if (!cid || !name) {
      return res.status(400).json({ msg: "Contact ID and new name are required" });
    }

    const updatedContact = await Contact.findOneAndUpdate(
      { owner, contact: cid },
      { nickname: name },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      msg: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to edit Contact" });
  }
};

export const addContact = async (req, res) => {
  try {
    const owner = req.cookies?.uid;
    const { name, cid } = req.body;

    if (!owner) {
      return res.status(401).json({ msg: "Unauthorized - User not Logged in" });
    }

    if (!cid) {
      return res.status(400).json({ msg: "Contact ID is required" });
    }

    const userExists = await User.findOne({ uniqueId: cid });
    if (!userExists) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    const alreadyExists = await Contact.findOne({ owner, contact: cid });
    if (alreadyExists) {
      return res.status(400).json({ msg: "Contact already saved" });
    }

    const newContact = await Contact.create({
      owner,
      contact: cid,
      nickname: name,
    });

    return res.status(201).json({
      msg: "Contact added successfully",
      contact: newContact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to add Contact" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const owner = req.cookies?.uid;
    const { cid } = req.params;

    if (!owner) {
      return res.status(401).json({ msg: "Unauthorized - User not Logged in" });
    }

    if (!cid) {
      return res.status(400).json({ msg: "Contact ID is required" });
    }

    // Delete the saved contact
    await Contact.findOneAndDelete({ owner, contact: cid });

    // Soft delete messages by adding the owner's UID to deletedBy
    const roomId = [owner, cid].sort().join("_");
    
    await Message.updateMany(
      { roomId, deletedBy: { $ne: owner } },
      { $push: { deletedBy: owner } }
    );

    // Hard delete from MongoDB if BOTH users have deleted the chat
    await Message.deleteMany({
      roomId,
      deletedBy: { $all: [owner, cid] }
    });

    return res.status(200).json({ msg: "Contact and chat history deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to delete Contact" });
  }
};


