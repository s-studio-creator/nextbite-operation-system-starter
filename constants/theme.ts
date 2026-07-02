export const colors = {
  primary: "#E73D2F",
  primaryPressed: "#C92F24",
  accent: "#F2B84B",
  healthy: "#41A765",
  background: "#FFF8F1",
  surface: "#FFFFFF",
  card: "#FFFDF9",
  border: "#D9D0C8",
  textPrimary: "#201A17",
  textSecondary: "#6E625D",
  error: "#D93838"
};

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999
};

export const shadow = {
  card: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4
  },
  floating: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 8
  }
};
