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
 * Initialize a range slider with gradient updates
 * @param {HTMLInputElement} slider - The range input element
 * @param {HTMLElement} valueDisplay - The element displaying the current value
 * @param {Function} onChange - Optional callback function to call when value changes
 */
export const initRangeSlider = (slider, valueDisplay, onChange) => {
  valueDisplay.textContent = slider.value;

  slider.addEventListener("input", () => {
    valueDisplay.textContent = slider.value;
    onChange?.();
  });
};
