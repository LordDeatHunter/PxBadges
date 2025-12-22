import { $ } from "./config.js";

const THEMES = ["light", "dark", "system"];
const THEME_ICONS = {
  light: "☀️",
  dark: "🌙",
  system: "💻",
};

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (preference) => {
  const theme = preference === "system" ? getSystemTheme() : preference;
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon(preference, theme);
};

const updateThemeIcon = (preference) => {
  const themeIcon = $`theme-icon`;
  if (themeIcon) {
    themeIcon.textContent = THEME_ICONS[preference];
  }
};

const initTheme = () => {
  const savedPreference = localStorage.getItem("theme-preference") || "system";
  applyTheme(savedPreference);

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const currentPreference =
        localStorage.getItem("theme-preference") || "system";

      if (currentPreference === "system") {
        applyTheme("system");
      }
    });
};

const toggleTheme = () => {
  const currentPreference =
    localStorage.getItem("theme-preference") || "system";

  const currentThemeIndex = THEMES.indexOf(currentPreference);
  const newPreference = THEMES[(currentThemeIndex + 1) % THEMES.length];

  localStorage.setItem("theme-preference", newPreference);
  applyTheme(newPreference);
};

initTheme();

$`theme-toggle`?.addEventListener("click", toggleTheme);
