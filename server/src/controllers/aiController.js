import AiChat from "../models/AiChat.js";
import { askMentor, generateChatTitle } from "../services/aiService.js";

// @desc    Send message to AI Mentor (new or existing chat)
// @route   POST /api/v1/ai/chat
// @access  Private
export const chat = async (req, res, next) => {
  try {
    const { message, chatId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message too long (max 1000 characters)",
      });
    }

    // Get or create chat
    let chat;
    if (chatId) {
      chat = await AiChat.findOne({ _id: chatId, userId: req.user._id });
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }
    } else {
      chat = await AiChat.create({
        userId: req.user._id,
        title: "New Chat",
        messages: [],
      });
    }

    // Ask AI with existing history (before adding new message)
    const reply = await askMentor(message.trim(), chat.messages);

    // Add user message + AI reply to chat
    chat.messages.push({ role: "user", content: message.trim() });
    chat.messages.push({ role: "assistant", content: reply });

    // Generate title if this is the first message
    if (chat.messages.length === 2 && chat.title === "New Chat") {
      chat.title = await generateChatTitle(message.trim());
    }

    await chat.save();

    res.status(200).json({
      success: true,
      chatId: chat._id,
      title: chat.title,
      reply,
    });
  } catch (error) {
    if (error.message.includes("GROQ_API_KEY")) {
      return res.status(500).json({
        success: false,
        message: "AI service not configured. Please contact support.",
      });
    }
    next(error);
  }
};

// @desc    Get all user's chats
// @route   GET /api/v1/ai/chats
// @access  Private
export const getChats = async (req, res, next) => {
  try {
    const chats = await AiChat.find({ userId: req.user._id })
      .select("title createdAt updatedAt messages")
      .sort({ updatedAt: -1 })
      .limit(30);

    const chatsWithPreview = chats.map((c) => ({
      _id: c._id,
      title: c.title,
      messageCount: c.messages.length,
      lastMessage:
        c.messages.length > 0
          ? c.messages[c.messages.length - 1].content.slice(0, 80) + "..."
          : "",
      updatedAt: c.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: chatsWithPreview.length,
      chats: chatsWithPreview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chat by ID
// @route   GET /api/v1/ai/chats/:id
// @access  Private
export const getChatById = async (req, res, next) => {
  try {
    const chat = await AiChat.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a chat
// @route   DELETE /api/v1/ai/chats/:id
// @access  Private
export const deleteChat = async (req, res, next) => {
  try {
    const chat = await AiChat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat deleted",
    });
  } catch (error) {
    next(error);
  }
};