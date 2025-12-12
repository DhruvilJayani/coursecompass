import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
} from "react";
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

// Animations
const pulse = keyframes`
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
`;

const messageAppear = keyframes`
  0% {opacity: 0; transform: translateY(10px) scale(0.98);}
  100% {opacity: 1; transform: translateY(0) scale(1);}
`;

/* -------------------------------
   Memoized Message Bubble
-------------------------------- */
const MessageBubble = memo(
  ({ msg, mode }: { msg: Message; mode: "light" | "dark" | string }) => {
    const theme = useTheme();

    return (
      <Box
        role="article"
        aria-label={`${msg.role === "user" ? "You" : "Assistant"} at ${
          msg.timestamp
        }`}
        sx={{
          alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
          background:
            msg.role === "user"
              ? "linear-gradient(135deg, #1D3F63, #24527A)"
              : mode === "light"
              ? "#ffffff"
              : "rgba(30,30,30,0.9)",
          color: msg.role === "user" ? "#FFFFFF" : theme.palette.text.primary,
          px: 2.5,
          py: 1.5,
          borderRadius:
            msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          boxShadow:
            msg.role === "user"
              ? "0 8px 16px rgba(20,53,90,0.55)"
              : "0 6px 12px rgba(0,0,0,0.08)",
          maxWidth: "70%",
          fontFamily:
            msg.role === "bot" ? "'Merriweather', serif" : "'Inter', sans-serif",
          animation: `${messageAppear} 0.35s ease`,
          transition: "transform 0.25s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow:
              msg.role === "user"
                ? "0 10px 20px rgba(20,53,90,0.6)"
                : "0 8px 18px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Typography variant="body1">{msg.content}</Typography>
        <Typography
          variant="caption"
          sx={{ opacity: 0.7, display: "block", mt: 0.5 }}
        >
          {msg.timestamp}
        </Typography>
      </Box>
    );
  }
);

/* -------------------------------
   Memoized Header
-------------------------------- */
const ChatHeader = memo(
  ({
    user,
    mode,
    toggleTheme,
    handleClearChat,
    handleLogout,
  }: {
    user: any;
    mode: "light" | "dark" | string;
    toggleTheme: () => void;
    handleClearChat: () => void;
    handleLogout: () => void;
  }) => {
    return (
      <Paper
        elevation={4}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 4,
          background:
            mode === "light"
              ? "rgba(255,255,255,0.95)"
              : "rgba(25,25,25,0.9)",
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
          <Avatar
            alt={user?.name ? `${user.name} avatar` : "User avatar"}
            sx={{ bgcolor: "#24527A", width: 42, height: 42, fontWeight: 700 }}
          >
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
          <Tooltip
            title={
              mode === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            <IconButton
              onClick={toggleTheme}
              aria-label={
                mode === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {mode === "light" ? (
                <Brightness4RoundedIcon />
              ) : (
                <Brightness7RoundedIcon />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear chat">
            <IconButton
              color="error"
              onClick={handleClearChat}
              aria-label="Clear chat history"
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton
              color="primary"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    );
  }
);

/* -------------------------------
   Memoized Scroll Button
-------------------------------- */
const ScrollButton = memo(
  ({
    visible,
    onClick,
    direction,
  }: {
    visible: boolean;
    onClick: () => void;
    direction: "up" | "down";
  }) => (
    <Zoom in={visible}>
      <Fab
        color="primary"
        size="small"
        onClick={onClick}
        aria-label={
          direction === "up"
            ? "Scroll to first message"
            : "Scroll to latest message"
        }
        sx={{
          position: "fixed",
          bottom: 120,
          [direction === "up" ? "left" : "right"]: 40,
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <KeyboardArrowDownRoundedIcon
          sx={{ transform: direction === "up" ? "rotate(180deg)" : "none" }}
        />
      </Fab>
    </Zoom>
  )
);

/* -------------------------------
   Memoized Chat Input 
   (Local state → ChatPage does NOT re-render when typing)
-------------------------------- */
const ChatInput = memo(
  ({
    mode,
    onSend,
  }: {
    mode: "light" | "dark" | string;
    onSend: (text: string) => void;
  }) => {
    const [value, setValue] = useState("");

    const handleSend = () => {
      if (!value.trim()) return;
      onSend(value);
      setValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
      if (e.key === "Escape") {
        (e.target as HTMLInputElement).blur();
      }
    };

    return (
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
                ? "rgba(250,250,250,0.98)"
                : "rgba(32,32,32,0.9)",
            backdropFilter: "blur(18px)",
            boxShadow:
              mode === "light"
                ? "0 12px 40px rgba(0,0,0,0.18)"
                : "0 8px 35px rgba(255,255,255,0.12)",
            border:
              mode === "light"
                ? "1px solid rgba(0,0,0,0.06)"
                : "1px solid rgba(255,255,255,0.12)",
            transition: "all 0.3s ease",
            "&:focus-within": {
              transform: "scale(1.02)",
              boxShadow:
                mode === "light"
                  ? "0 0 0 3px rgba(36,82,122,0.45)"
                  : "0 0 0 3px rgba(144,202,249,0.7)",
            },
          }}
        >
          <TextField
            fullWidth
            placeholder="Type your scholarly question..."
            aria-label="Message input"
            variant="outlined"
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                background: "transparent",
                "& fieldset": { border: "none" },
                fontSize: "0.95rem",
                color: mode === "light" ? "#111827" : "#F9FAFB",
              },
              "& .MuiInputBase-input::placeholder": {
                color: mode === "light" ? "#6B7280" : "#9CA3AF",
                opacity: 1,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            aria-label="Send message"
            sx={{
              ml: 1,
              transform: "translateY(2px)",
              transition: "transform 0.2s ease, filter 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                filter: "drop-shadow(0 0 6px rgba(36,82,122,0.5))",
              },
            }}
          >
            <SendRoundedIcon />
          </IconButton>
        </Paper>
      </Box>
    );
  }
);

/* -------------------------------
   MAIN CHAT PAGE
-------------------------------- */
const ChatPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load initial messages from localStorage or greeting
  useEffect(() => {
    const saved = localStorage.getItem("coursecompass_chat_history");
    if (saved) setMessages(JSON.parse(saved));
    else {
      setMessages([
        {
          role: "bot",
          content: `📚 Hello ${
            user?.name || "Scholar"
          }! I'm your CourseCompass Academic Assistant. How may I assist you today?`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [user]);

  // Persist messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "coursecompass_chat_history",
        JSON.stringify(messages)
      );
    }
  }, [messages]);

  const scrollToBottom = useCallback(
    (smooth = true) => {
      chatEndRef.current?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
    },
    []
  );

  const scrollToTop = useCallback((smooth = true) => {
    chatContainerRef.current?.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;
    const isAtTop = scrollTop < 80;

    setShowScrollButton(!isAtBottom);
    setShowTopButton(!isAtTop);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const userMsg: Message = { role: "user", content: text, timestamp: now };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const res = await sendChatMessage({ message: text });
        const raw = (res as any)?.data;
        const reply =
          (raw && (raw.reply ?? raw.message ?? raw.text)) ??
          (typeof raw === "string" ? raw : undefined) ??
          "Let's analyze that further…";

        const botMsg: Message = {
          role: "bot",
          content: reply,
          timestamp: now,
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const fallback =
          "⚠️ Network issue — operating in offline academic mode.";
        const botMsg: Message = {
          role: "bot",
          content: fallback,
          timestamp: now,
        };
        setMessages((prev) => [...prev, botMsg]);
      }

      setIsTyping(false);
      scrollToBottom();
    },
    [scrollToBottom]
  );

  const handleClearChat = useCallback(() => {
    if (!window.confirm("Are you sure you want to clear this chat?")) return;
    const resetMsg: Message[] = [
      {
        role: "bot",
        content: `📚 Hello ${
          user?.name || "Scholar"
        }! I'm your CourseCompass Academic Assistant. How may I assist you today?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
    setMessages(resetMsg);
    localStorage.setItem(
      "coursecompass_chat_history",
      JSON.stringify(resetMsg)
    );
  }, [user]);

  const handleLogout = useCallback(() => {
    if (!window.confirm("Do you want to log out?")) return;
    logout();
    localStorage.removeItem("coursecompass_chat_history");
    window.location.href = "/login";
  }, [logout]);

  return (
    <Box
      role="main"
      aria-label="CourseCompass chat interface"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          mode === "light"
            ? "#E5E7EB"
            : "radial-gradient(circle at 10% 10%, #0f1115, #181a1f)",
        color: theme.palette.text.primary,
        position: "relative",
        overflow: "hidden",
        p: 2,
        fontFamily: "'Inter', sans-serif",
        transition: "background 0.6s ease",
      }}
    >
      <ChatHeader
        user={user}
        mode={mode}
        toggleTheme={toggleTheme}
        handleClearChat={handleClearChat}
        handleLogout={handleLogout}
      />

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
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Chat messages"
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
          <MessageBubble key={i} msg={msg} mode={mode} />
        ))}

        {isTyping && (
          <Box
            role="status"
            aria-live="polite"
            sx={{
              alignSelf: "flex-start",
              background:
                mode === "light" ? "#ffffff" : "rgba(30,30,30,0.9)",
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
            <Box sx={{ display: "flex", gap: 0.4 }} aria-hidden="true">
              {[0, 0.2, 0.4].map((delay) => (
                <Box
                  key={delay}
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: "#24527A",
                    borderRadius: "50%",
                    animation: `${pulse} 1.2s infinite ease-in-out ${delay}s`,
                    boxShadow: "0 0 6px rgba(36,82,122,0.6)",
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <div ref={chatEndRef} />
      </Box>

      {/* Scroll buttons */}
      <ScrollButton
        visible={showScrollButton}
        onClick={() => scrollToBottom()}
        direction="down"
      />
      <ScrollButton
        visible={showTopButton}
        onClick={() => scrollToTop()}
        direction="up"
      />

      {/* Floating Input (local state inside) */}
      <ChatInput mode={mode} onSend={handleSend} />
    </Box>
  );
};

export default ChatPage;
