/**
 * Initialize a range slider with gradient updates
 * @param {HTMLInputElement} slider - The range input element
 * @param {HTMLElement} valueDisplay - The element displaying the current value
 */
export const initRangeSlider = (slider, valueDisplay) => {
  valueDisplay.textContent = slider.value;

  slider.addEventListener("input", () => {
    valueDisplay.textContent = slider.value;
  });
};
