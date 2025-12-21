import { $$, $c } from "./config.js";

/**
 * Create a debounced version of a function
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Show a notification popup
 * @param {string|string[]} message - Message or array of messages to display
 * @param {string} type - Type of notification ('error', 'success', 'info')
 * @param {number} duration - Duration in milliseconds before auto-dismiss
 */
export const showNotification = (message, type = "info", duration = 3000) => {
  const container = $$`.notification-container`;

  const notification = $c`div`;
  notification.className = `notification notification-${type}`;

  if (Array.isArray(message)) {
    const ul = $c`ul`;
    message.forEach((msg) => {
      const li = $c`li`;
      li.textContent = msg;
      ul.appendChild(li);
    });
    notification.appendChild(ul);
  } else {
    notification.textContent = message;
  }

  container.appendChild(notification);

  setTimeout(() => notification.classList.add("show"), 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, duration);
};

/**
 * Initialize a range slider with gradient updates
 * @param {HTMLInputElement} slider - The range input element
 * @param {HTMLElement} valueDisplay - The element displaying the current value
 * @param {Function} onChange - Optional callback function to call when value changes
 */
export const initRangeSlider = (slider, valueDisplay, onChange) => {
  const updateFill = () => {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const value = parseFloat(slider.value);
    const percentage = ((value - min) / (max - min)) * 100;
    slider.style.setProperty("--range-progress", `${percentage}%`);
  };

  valueDisplay.textContent = slider.value;
  updateFill();

  slider.addEventListener("input", () => {
    valueDisplay.textContent = slider.value;
    updateFill();
    onChange?.();
  });
};
