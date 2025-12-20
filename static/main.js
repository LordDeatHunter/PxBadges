import { $ } from "./config.js";
import { loadTechs, loadMaterials } from "./api.js";
import { initRangeSlider, debounce } from "./ui.js";
import { createBadgeGenerator, copyToClipboard } from "./badge.js";

const techSelect = $("tech");
const scoreInput = $("score");
const scoreValue = $("score-value");
const scaleInput = $("scale");
const scaleValue = $("scale-value");
const materialSelect = $("material");
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

techSelect.addEventListener("change", handleGenerate);
materialSelect.addEventListener("change", handleGenerate);
copyBtn.addEventListener("click", handleCopy);

initSliders();
initOptions();
