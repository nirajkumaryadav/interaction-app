// Add this new controller function:

export const uploadFile = async (req, res) => {
  const { userid: userId, id: roomId } = req.params;
  
  try {
    const user = await User.findById(userId);
    if (!user.rooms.includes(roomId)) {
      return res.status(404).json({ message: "Room not found" });
    }

    const room = await Room.findById(roomId);
    if (room.isProtected && room.host !== userId) {
      return res.status(403).json({ message: "Only host can upload files" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `${process.env.FRONTEND_URL}/uploads/${req.file.filename}`;
    
    // Add file message to room
    room.messages.push({
      senderId: userId,
      sender: user.name,
      message: `[File] ${req.file.originalname}`,
      fileUrl: fileUrl,
      timestamp: new Date()
    });

    room.UpdatedAt = new Date();
    await room.save();

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: fileUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};