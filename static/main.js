import { $ } from "./config.js";
import { loadTechs, loadMaterials } from "./api.js";
import { initRangeSlider, debounce } from "./ui.js";
import { createBadgeGenerator, copyToClipboard } from "./badge.js";
import { createAutocomplete } from "./autocomplete.js";

const techRoot = $("tech");
const techSelect = createAutocomplete(techRoot, {
  placeholder: "Loading...",
});
const scoreInput = $("score");
const scoreValue = $("score-value");
const scaleInput = $("scale");
const scaleValue = $("scale-value");
const materialRoot = $("material");
const materialSelect = createAutocomplete(materialRoot, {
  placeholder: "Loading...",
});
const previewContainer = $("preview-container");
const urlSection = $("url-section");
const badgeUrlInput = $("badge-url");
const markdownCode = $("markdown-code");
const copyBtn = $("copy-btn");

const handleGenerate = createBadgeGenerator({
  techSelect,
  scoreInput,
  scaleInput,
  materialSelect,
  previewContainer,
  urlSection,
  badgeUrlInput,
  markdownCode,
});

const debouncedGenerate = debounce(handleGenerate, 300);

const initSliders = () => {
  initRangeSlider(scoreInput, scoreValue, debouncedGenerate);
  initRangeSlider(scaleInput, scaleValue, debouncedGenerate);
};

const initOptions = async () => {
  try {
    await Promise.all([loadTechs(techSelect), loadMaterials(materialSelect)]);
  } catch (error) {
    console.error("Failed to load options:", error);
  }
};

const handleCopy = async () => {
  try {
    await copyToClipboard(badgeUrlInput.value, copyBtn);
  } catch (error) {
    alert("Failed to copy URL. Please copy manually.");
  }
};

techRoot.addEventListener("change", handleGenerate);
materialRoot.addEventListener("change", handleGenerate);
copyBtn.addEventListener("click", handleCopy);

initSliders();
initOptions();
