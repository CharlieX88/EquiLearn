import { useEffect, useRef, useState } from "react";
import {
  Send,
  Bot,
  User,
  Plus,
  Trash2,
  MessageSquare,
  Sparkles,
  Loader2,
  RefreshCw,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import api from "../services/api";
import Button from "../components/ui/Button";
import { cn } from "../utils/cn";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTIONS = [
  "What is a P/E ratio?",
  "Explain stop loss with an example",
  "How does diversification reduce risk?",
  "Difference between large cap and small cap?",
  "What is a Demat account?",
];

export default function AiMentor() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/ai/chats");
      setChats(data.chats || []);
    } catch (error) {
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const { data } = await api.get(`/ai/chats/${chatId}`);
      setActiveChatId(chatId);
      setMessages(data.chat.messages || []);
      setSidebarOpen(false);
    } catch (error) {
      toast.error("Failed to load chat");
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!confirm("Delete this chat?")) return;
    try {
      await api.delete(`/ai/chats/${chatId}`);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChatId === chatId) {
        startNewChat();
      }
      toast.success("Chat deleted");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const sendMessage = async (text) => {
    const messageText = (text ?? input).trim();
    if (!messageText || sending) return;

    // Optimistically add user message
    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const { data } = await api.post("/ai/chat", {
        message: messageText,
        chatId: activeChatId || undefined,
      });

      // Add AI reply
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);

      // If it's a new chat, update active chat id and refresh list
      if (!activeChatId) {
        setActiveChatId(data.chatId);
        fetchChats();
      } else {
        // Update chat title in list if changed
        setChats((prev) =>
          prev.map((c) =>
            c._id === data.chatId ? { ...c, title: data.title } : c
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "AI failed to respond");
      // Remove optimistic user message on failure
      setMessages((prev) => prev.slice(0, -1));
      setInput(messageText);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmptyState = messages.length === 0 && !sending;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-4">
      {/* -------- SIDEBAR -------- */}
      <aside
        className={cn(
          "w-64 shrink-0 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col overflow-hidden",
          "hidden lg:flex"
        )}
      >
        <div className="p-3 border-b border-white/5">
          <Button
            variant="gradient"
            size="sm"
            className="w-full"
            onClick={startNewChat}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-lg bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-10 px-3">
              <MessageSquare className="w-8 h-8 text-dark-100 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-dark-100">
                No chats yet. Start asking!
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => loadChat(chat._id)}
                className={cn(
                  "group relative p-3 rounded-lg cursor-pointer transition-colors mb-1",
                  activeChatId === chat._id
                    ? "bg-primary-500/10 border border-primary-500/20"
                    : "hover:bg-white/5"
                )}
              >
                <p className="text-sm font-medium truncate pr-6">
                  {chat.title}
                </p>
                <p className="text-xs text-dark-100 truncate mt-0.5">
                  {chat.messageCount} message
                  {chat.messageCount !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={(e) => deleteChat(chat._id, e)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-dark-100 hover:text-danger transition-all p-1"
                  aria-label="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* -------- MAIN CHAT -------- */}
      <div className="flex-1 flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden min-w-0">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30 shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold">AI Mentor</h2>
              <p className="text-xs text-dark-100 truncate">
                Ask anything about stock market
              </p>
            </div>
          </div>
          <button
            onClick={startNewChat}
            className="lg:hidden p-2 text-dark-100 hover:text-white"
            aria-label="New chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer strip */}
        <div className="px-4 py-2 bg-warning/5 border-b border-warning/10 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-warning shrink-0" />
          <p className="text-[11px] text-dark-100">
            Educational only. AI never gives buy/sell advice.
          </p>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          {isEmptyState ? (
            <EmptyState onSuggestionClick={sendMessage} />
          ) : (
            <div className="space-y-5 max-w-3xl mx-auto">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <MessageBubble key={i} message={m} />
                ))}
              </AnimatePresence>

              {sending && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 focus-within:border-primary-500/50 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about stock market..."
                rows={1}
                disabled={sending}
                className="flex-1 bg-transparent resize-none outline-none text-sm px-3 py-2 max-h-32 placeholder:text-dark-100/60"
                style={{ minHeight: "40px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 128) + "px";
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || sending}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                  input.trim() && !sending
                    ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white hover:scale-105 shadow-lg shadow-primary-600/30"
                    : "bg-white/5 text-dark-100 cursor-not-allowed"
                )}
                aria-label="Send"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-dark-100 text-center mt-2">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------- SUB-COMPONENTS --------

function EmptyState({ onSuggestionClick }) {
  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 mb-5 shadow-xl shadow-primary-600/30"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">Hi, I'm Mentor 👋</h2>
        <p className="text-sm text-dark-100 mb-6">
          Ask me anything about the stock market — concepts, terms, strategies.
          I'm here to help you learn.
        </p>

        <div className="space-y-2">
          {SUGGESTIONS.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSuggestionClick(s)}
              className="w-full text-left px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-primary-500/30 hover:bg-primary-500/5 text-sm text-dark-100 hover:text-white transition-all group flex items-center justify-between"
            >
              <span>{s}</span>
              <Send className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary-400 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
    const isUser = message.role === "user";
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={cn("flex gap-3", isUser && "flex-row-reverse")}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            isUser
              ? "bg-gradient-to-br from-primary-500 to-primary-700"
              : "bg-white/5 border border-white/10"
          )}
        >
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-primary-400" />
          )}
        </div>
  
        <div
          className={cn(
            "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words overflow-hidden",
            isUser
              ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-tr-sm"
              : "bg-white/5 border border-white/5 text-dark-50 rounded-tl-sm"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-dark-100">{children}</em>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 mb-3 last:mb-0 pl-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 mb-3 last:mb-0 pl-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  h1: ({ children }) => (
                    <h3 className="text-base font-bold mt-3 mb-2 text-white">
                      {children}
                    </h3>
                  ),
                  h2: ({ children }) => (
                    <h3 className="text-base font-bold mt-3 mb-2 text-white">
                      {children}
                    </h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="text-sm font-bold mt-3 mb-2 text-white">
                      {children}
                    </h4>
                  ),
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="px-1.5 py-0.5 rounded bg-white/10 text-primary-300 font-mono text-xs">
                        {children}
                      </code>
                    ) : (
                      <pre className="p-3 rounded-lg bg-dark-950 border border-white/5 overflow-x-auto my-3">
                        <code className="text-primary-300 font-mono text-xs">
                          {children}
                        </code>
                      </pre>
                    ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-primary-500/50 pl-3 my-3 text-dark-100 italic">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3">
                      <table className="w-full text-xs border-collapse">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="border-b border-white/10">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="text-left p-2 font-semibold text-white">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="p-2 text-dark-100 border-b border-white/5">
                      {children}
                    </td>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-primary-400" />
      </div>
      <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}