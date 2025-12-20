import { API_BASE } from "./config.js";
import { showNotification } from "./ui.js";

/**
 * Create a badge generation handler
 * @param {Object} elements - DOM elements needed for badge generation
 * @returns {Function} Handler function for generating badges
 */
export const createBadgeGenerator = (elements) => {
  const {
    techSelect,
    scoreInput,
    scaleInput,
    materialSelect,
    previewContainer,
    urlSection,
    badgeUrlInput,
    markdownCode,
  } = elements;

  return async () => {
    const tech = techSelect.value;
    const score = scoreInput.value;
    const scale = scaleInput.value;
    const material = materialSelect.value;

    if (!tech) {
      previewContainer.innerHTML =
        '<p class="placeholder">Select a technology to generate your badge</p>';
      urlSection.classList.add("hidden");
      return;
    }

    try {
      await generateBadge(
        { tech, score, scale, material },
        previewContainer,
        urlSection,
        badgeUrlInput,
        markdownCode,
      );
    } catch (error) {
      console.error("Error generating badge:", error);

      if (error.validationErrors) {
        showNotification(error.validationErrors, "error");
      } else {
        showNotification(
          "Unable to generate badge. Please try again later.",
          "error",
        );
      }

      previewContainer.innerHTML =
        '<p class="placeholder">Select a technology to generate your badge</p>';
      urlSection.classList.add("hidden");
    }
  };
};

/**
 * Generate and display a badge
 * @param {Object} params - Badge parameters
 * @param {string} params.tech - Technology name
 * @param {number} params.score - Score value (0-6)
 * @param {number} params.scale - Scale value (1-20)
 * @param {string} params.material - Material type
 * @param {HTMLElement} previewContainer - Container for badge preview
 * @param {HTMLElement} urlSection - Section containing URL info
 * @param {HTMLInputElement} badgeUrlInput - Input showing badge URL
 * @param {HTMLElement} markdownCode - Element showing Markdown code
 * @returns {Promise<string>} The badge URL
 */
export const generateBadge = async (
  params,
  previewContainer,
  urlSection,
  badgeUrlInput,
  markdownCode,
) => {
  const { tech, score, scale, material } = params;

  const searchParams = new URLSearchParams({
    tech,
    score: String(score),
    scale: String(scale),
    material,
  });
  const badgeUrl = `${API_BASE}/badge?${searchParams}`;

  const response = await fetch(badgeUrl);

  if (!response.ok) {
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        const errors = Array.isArray(errorData.detail)
          ? errorData.detail
          : [errorData.detail];
        const error = new Error("Validation error");
        error.validationErrors = errors;
        throw error;
      }
    } catch (parseError) {
      if (parseError.validationErrors) {
        throw parseError;
      }
    }

    throw new Error(`Server error: ${response.status}`);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      previewContainer.innerHTML = "";
      previewContainer.appendChild(img);

      urlSection.classList.remove("hidden");
      badgeUrlInput.value = badgeUrl;
      markdownCode.textContent = `![${tech} badge](${badgeUrl})`;

      resolve(badgeUrl);
    };

    img.onerror = () => {
      reject(new Error("Failed to load badge image"));
    };

    img.src = badgeUrl;
    img.alt = `${tech} badge`;
  });
};

/**
 * Copy text to clipboard with visual feedback
 * @param {string} text - Text to copy
 * @param {HTMLButtonElement} button - Button to show feedback on
 */
export const copyToClipboard = async (text, button) => {
  try {
    await navigator.clipboard.writeText(text);

    const originalText = button.textContent;
    button.textContent = "Copied!";
    button.style.background = "#10b981";
    button.style.color = "white";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = "";
      button.style.color = "";
    }, 2000);
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    throw error;
  }
};
