export const theme = {
  colors: {
    background: "#F8FAFC",
    sidebar: "#0F172A",
    primary: "#3B82F6",
    secondary: "#6366F1",
    accent: "#06B6D4",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    card: "#FFFFFF",
    border: "#E2E8F0",
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      muted: "#94A3B8",
      inverse: "#F8FAFC",
    },
  },
  shadows: {
    card: "0 16px 40px rgba(15, 23, 42, 0.08)",
    soft: "0 10px 30px rgba(15, 23, 42, 0.06)",
  },
  radii: {
    card: "8px",
    control: "8px",
  },
};

export const motionPresets = {
  page: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition: { duration: 0.18, ease: "easeOut" },
  },
  dropdown: {
    initial: { opacity: 0, y: -6, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -6, scale: 0.98 },
    transition: { duration: 0.14, ease: "easeOut" },
  },
};
