import { $ } from "./config.js";
import { loadTechs, loadMaterials } from "./api.js";
import { initRangeSlider } from "./ui.js";
import { generateBadge, copyToClipboard } from "./badge.js";

const techSelect = $("tech");
const scoreInput = $("score");
const scoreValue = $("score-value");
const scaleInput = $("scale");
const scaleValue = $("scale-value");
const materialSelect = $("material");
const generateBtn = $("generate-btn");
const previewContainer = $("preview-container");
const urlSection = $("url-section");
const badgeUrlInput = $("badge-url");
const markdownCode = $("markdown-code");
const copyBtn = $("copy-btn");

const initSliders = () => {
  initRangeSlider(scoreInput, scoreValue);
  initRangeSlider(scaleInput, scaleValue);
};

const initOptions = async () => {
  try {
    await Promise.all([loadTechs(techSelect), loadMaterials(materialSelect)]);
  } catch (error) {
    console.error("Failed to load options:", error);
  }
};

const handleGenerate = async () => {
  const tech = techSelect.value;
  const score = scoreInput.value;
  const scale = scaleInput.value;
  const material = materialSelect.value;

  if (!tech) {
    alert("Please select a technology");
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  previewContainer.innerHTML =
    '<p class="placeholder">Generating your badge...</p>';

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
    previewContainer.innerHTML =
      '<p class="error">Error generating badge. Please try again.</p>';
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Badge";
  }
};
generateBtn.addEventListener("click", handleGenerate);

const handleCopy = async () => {
  try {
    await copyToClipboard(badgeUrlInput.value, copyBtn);
  } catch (error) {
    alert("Failed to copy URL. Please copy manually.");
  }
};
copyBtn.addEventListener("click", handleCopy);

initSliders();
initOptions();
