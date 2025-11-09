import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Divider,
  Tooltip,
  Fab,
  Zoom,
  Avatar,
  useTheme,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded";
import Brightness7RoundedIcon from "@mui/icons-material/Brightness7Rounded";
import { keyframes } from "@emotion/react";
import { sendChatMessage } from "../../services/chatService";
import { useAuthStore } from "../../store/authStore";
import { useThemeContext } from "../../context/ThemeProvider";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ChatPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("coursecompass_chat_history");
    if (saved) setMessages(JSON.parse(saved));
    else
      setMessages([
        {
          role: "bot",
          content: `👋 Hi ${user?.name || "there"}! I'm your CourseCompass assistant. How can I help you plan your semester today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
  }, [user]);

  useEffect(() => {
    if (messages.length > 0)
      localStorage.setItem("coursecompass_chat_history", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = (smooth = true) => {
    chatEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;
    setShowScrollButton(!isAtBottom);
  };

  const streamBotReply = (text: string) => {
    const words = text.split(" ");
    let current = "";
    let index = 0;
    const interval = setInterval(() => {
      if (index < words.length) {
        current += (index === 0 ? "" : " ") + words[index];
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = current;
          return updated;
        });
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 60);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { role: "user", content: input, timestamp: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await sendChatMessage({ message: input });
      const reply = res.data.reply || "I’m here to help you plan your semester!";
      const botMsg: Message = { role: "bot", content: "", timestamp: now };
      setMessages((prev) => [...prev, botMsg]);
      streamBotReply(reply);
    } catch {
      const fallback = "⚠️ Server unreachable. (This is a mock reply — backend is offline.)";
      const botMsg: Message = { role: "bot", content: "", timestamp: now };
      setMessages((prev) => [...prev, botMsg]);
      streamBotReply(fallback);
    }
    scrollToBottom();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (!window.confirm("Are you sure you want to clear this chat?")) return;
    const resetMsg: Message[] = [
  {
    role: "bot",
    content: `👋 Hi ${user?.name || "there"}! I'm your CourseCompass assistant. How can I help you plan your semester today?`,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];
setMessages(resetMsg);
localStorage.setItem("coursecompass_chat_history", JSON.stringify(resetMsg));
  };

  const handleLogout = () => {
    if (!window.confirm("Do you want to log out?")) return;
    logout();
    localStorage.removeItem("coursecompass_chat_history");
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: theme.palette.background.default,
        p: 2,
        position: "relative",
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 1,
          borderRadius: 3,
          background: theme.palette.background.paper,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Hi, {user?.name || "there"} 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CourseCompass Assistant 💬
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Toggle theme">
            <IconButton onClick={toggleTheme}>
              {mode === "light" ? <Brightness4RoundedIcon /> : <Brightness7RoundedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear chat">
            <IconButton color="error" onClick={handleClearChat}>
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton color="primary" onClick={handleLogout}>
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Divider />

      {/* Chat messages */}
      <Box
        ref={chatContainerRef}
        onScroll={handleScroll}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              bgcolor:
                msg.role === "user"
                  ? theme.palette.primary.main
                  : theme.palette.background.paper,
              color: msg.role === "user" ? "#fff" : "text.primary",
              px: 2,
              py: 1,
              borderRadius: 3,
              boxShadow:
                msg.role === "user"
                  ? "0 2px 6px rgba(25,118,210,0.3)"
                  : "0 2px 6px rgba(0,0,0,0.2)",
              maxWidth: "75%",
            }}
          >
            <Typography variant="body1">{msg.content}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 0.5 }}>
              {msg.timestamp}
            </Typography>
          </Box>
        ))}

        {isTyping && (
          <Box
            sx={{
              alignSelf: "flex-start",
              bgcolor: theme.palette.background.paper,
              px: 2,
              py: 1,
              borderRadius: 3,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              maxWidth: "60%",
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              CourseCompass is typing
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[0, 0.2, 0.4].map((delay) => (
                <Box
                  key={delay}
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: "#1976d2",
                    borderRadius: "50%",
                    animation: `${pulse} 1s infinite ease-in-out ${delay}s`,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        <div ref={chatEndRef} />
      </Box>

      <Zoom in={showScrollButton}>
        <Fab
          color="primary"
          size="small"
          onClick={() => scrollToBottom()}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 30,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <KeyboardArrowDownRoundedIcon />
        </Fab>
      </Zoom>

      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 3,
          p: 1,
          mt: 1,
          background: theme.palette.background.paper,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
          }}
        />
        <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
          <SendRoundedIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatPage;
