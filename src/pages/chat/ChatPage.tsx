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

interface Particle {
  id: number;
  leftPct: number;
  topPct: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// Animations
const pulse = keyframes`
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
`;

const messageAppear = keyframes`
  0% {opacity: 0; transform: translateY(10px) scale(0.98);}
  100% {opacity: 1; transform: translateY(0) scale(1);}
`;

const drift = keyframes`
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  50%  { transform: translate3d(10px, -50px, 0) scale(1.02); }
  100% { transform: translate3d(0, -100px, 0) scale(1); }
`;

const ChatPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // particles
  useEffect(() => {
    const PARTICLE_COUNT = 30;
    const next: Particle[] = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      leftPct: Math.random() * 100,
      topPct: Math.random() * 100,
      size: 4 + Math.random() * 10,
      duration: 20 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.05 + Math.random() * 0.1,
    }));
    setParticles(next);
  }, [mode]);

  useEffect(() => {
    const saved = localStorage.getItem("coursecompass_chat_history");
    if (saved) setMessages(JSON.parse(saved));
    else
      setMessages([
        {
          role: "bot",
          content: `📚 Hello ${user?.name || "Scholar"}! I'm your CourseCompass Academic Assistant. How may I assist you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
  }, [user]);

  useEffect(() => {
    if (messages.length > 0)
      localStorage.setItem("coursecompass_chat_history", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = (smooth = true) =>
    chatEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight >= 80);
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
    }, 45);
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
      const reply = res?.data?.reply || "Let's analyze that further…";
      const botMsg: Message = { role: "bot", content: "", timestamp: now };
      setMessages((prev) => [...prev, botMsg]);
      streamBotReply(reply);
    } catch {
      const fallback = "⚠️ Network issue — operating in offline academic mode.";
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
        content: `📚 Hello ${user?.name || "Scholar"}! I'm your CourseCompass Academic Assistant. How may I assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          mode === "light"
            ? "#E5E7EB" // soft gray background
            : "radial-gradient(circle at 10% 10%, #0f1115, #181a1f)",
        color: theme.palette.text.primary,
        position: "relative",
        overflow: "hidden",
        p: 2,
        fontFamily: "'Inter', sans-serif",
        transition: "background 0.6s ease",
      }}
    >
      {/* Background Particles */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {particles.map((p) => (
          <Box
            key={p.id}
            sx={{
              position: "absolute",
              left: `${p.leftPct}%`,
              top: `${p.topPct}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background:
                mode === "light"
                  ? "radial-gradient(circle, rgba(62,124,177,0.12), rgba(62,124,177,0))"
                  : "radial-gradient(circle, rgba(255,255,255,0.12), rgba(255,255,255,0))",
              opacity: p.opacity,
              animation: `${drift} ${p.duration}s linear ${p.delay}s infinite`,
              willChange: "transform",
            }}
          />
        ))}
      </Box>

      {/* Header */}
      <Paper
        elevation={4}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 4,
          background: mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(25,25,25,0.9)",
          border: "1px solid rgba(0,0,0,0.05)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow:
            mode === "light"
              ? "0 8px 24px rgba(0,0,0,0.05)"
              : "0 8px 24px rgba(255,255,255,0.05)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: "#3E7CB1", width: 42, height: 42, fontWeight: 700 }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Welcome, {user?.name || "Scholar"} 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Academic Assistant • CourseCompass
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleTheme}>
              {mode === "light" ? <Brightness4RoundedIcon /> : <Brightness7RoundedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear Chat">
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

      {/* Divider */}
      <Divider sx={{ mb: 2, "&::before, &::after": { borderColor: "#d4c7a1" } }}>
        <Typography
          variant="caption"
          sx={{
            color: "#bca86a",
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontFamily: "'EB Garamond', serif",
          }}
        >
          ✦ Academic Dialogue ✦
        </Typography>
      </Divider>

      {/* Chat Area */}
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
          pb: 14,
        }}
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              transition: "transform 0.25s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow:
                  msg.role === "user"
                    ? "0 10px 20px rgba(62,124,177,0.4)"
                    : "0 8px 18px rgba(0,0,0,0.08)",
              },

              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user"
                  ? "linear-gradient(135deg, #3E7CB1, #5B9BD5)"
                  : mode === "light"
                  ? "#ffffff"
                  : "rgba(30,30,30,0.85)",
              color: msg.role === "user" ? "#fff" : theme.palette.text.primary,
              px: 2.5,
              py: 1.5,
              borderRadius:
                msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              boxShadow:
                msg.role === "user"
                  ? "0 8px 16px rgba(62,124,177,0.35)"
                  : "0 6px 12px rgba(0,0,0,0.08)",
              maxWidth: "70%",
              fontFamily: msg.role === "bot" ? "'Merriweather', serif" : "'Inter', sans-serif",
              animation: `${messageAppear} 0.35s ease`,
            }}
          >
            <Typography variant="body1">{msg.content}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.6, display: "block", mt: 0.5 }}>
              {msg.timestamp}
            </Typography>
          </Box>
        ))}
        {isTyping && (
          <Box
            sx={{
              alignSelf: "flex-start",
              background: mode === "light" ? "#fff" : "rgba(30,30,30,0.85)",
              px: 2,
              py: 1,
              borderRadius: "18px 18px 18px 4px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Assistant is composing
            </Typography>
            <Box sx={{ display: "flex", gap: 0.4 }}>
              {[0, 0.2, 0.4].map((delay) => (
                <Box
                  key={delay}
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: "#3E7CB1",
                    borderRadius: "50%",
                    animation: `${pulse} 1.2s infinite ease-in-out ${delay}s`,
                    boxShadow: "0 0 6px rgba(62,124,177,0.5)",
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        <div ref={chatEndRef} />
      </Box>

      {/* Floating Input */}
      <Box
        sx={{
          position: "fixed",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          width: "72%",
          maxWidth: 850,
          zIndex: 5,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: 8,
            px: 2.2,
            py: 1.2,
            background:
              mode === "light"
                ? "rgba(250,250,250,0.95)" // light gray to contrast gray bg
                : "rgba(32,32,32,0.85)",
            backdropFilter: "blur(18px)",
            boxShadow:
              mode === "light"
                ? "0 12px 40px rgba(0,0,0,0.18)"
                : "0 8px 35px rgba(255,255,255,0.08)",
            border:
              mode === "light"
                ? "1px solid rgba(0,0,0,0.04)"
                : "1px solid rgba(255,255,255,0.08)",
            transition: "all 0.3s ease",
            "&:focus-within": {
              transform: "scale(1.02)",
              boxShadow:
                mode === "light"
                  ? "0 12px 40px rgba(62,124,177,0.25)"
                  : "0 12px 40px rgba(62,124,177,0.3)",
            },
          }}
        >
          <TextField
            fullWidth
            placeholder="Type your scholarly question..."
            variant="outlined"
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                background: "transparent",
                "& fieldset": { border: "none" },
                fontSize: "0.95rem",
                color: mode === "light" ? "#1E1E1E" : "#f5f5f5",
                "&::placeholder": {
                  color: mode === "light" ? "#7a7a7a" : "#999",
                  opacity: 1,
                },
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            sx={{
              ml: 1,
              transform: "translateY(2px)",
              transition: "transform 0.2s ease, filter 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                filter: "drop-shadow(0 0 6px rgba(62,124,177,0.4))",
              },
            }}
          >
            <SendRoundedIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatPage;
