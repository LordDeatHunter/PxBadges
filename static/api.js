import { $c, API_BASE } from "./config.js";
import { showNotification } from "./ui.js";

/**
 * Load available technologies from the API
 * @param {HTMLSelectElement} techSelect - The technology select element
 */
export const loadTechs = async (techSelect) => {
  try {
    const response = await fetch(`${API_BASE}/techs`);

    if (!response.ok) {
      throw new Error(`Failed to load technologies: ${response.status}`);
    }

    const data = await response.json();

    if (!data.techs || !Array.isArray(data.techs)) {
      throw new Error("Invalid response format from server");
    }

    techSelect.innerHTML = '<option value="">Select a technology...</option>';
    data.techs.forEach((tech) => {
      const option = $c`option`;
      option.value = tech;
      option.textContent = tech.charAt(0).toUpperCase() + tech.slice(1);
      techSelect.appendChild(option);
    });
    techSelect.children[0].selected = true;
  } catch (error) {
    console.error("Error loading technologies:", error);
    techSelect.innerHTML =
      '<option value="">Error loading technologies</option>';
    showNotification(
      "Failed to load technologies. Please refresh the page.",
      "error",
    );
    throw error;
  }
};

/**
 * Load available materials from the API
 * @param {HTMLSelectElement} materialSelect - The material select element
 */
export const loadMaterials = async (materialSelect) => {
  try {
    const response = await fetch(`${API_BASE}/materials`);

    if (!response.ok) {
      throw new Error(`Failed to load materials: ${response.status}`);
    }

    const data = await response.json();

    if (!data.materials || !Array.isArray(data.materials)) {
      throw new Error("Invalid response format from server");
    }

    materialSelect.innerHTML = "";
    data.materials.forEach((material) => {
      const option = $c`option`;
      option.value = material;
      option.textContent = material.charAt(0).toUpperCase() + material.slice(1);
      materialSelect.appendChild(option);
    });
    materialSelect.children[0].selected = true;
  } catch (error) {
    console.error("Error loading materials:", error);
    materialSelect.innerHTML =
      '<option value="">Error loading materials</option>';
    showNotification(
      "Failed to load materials. Please refresh the page.",
      "error",
    );
    throw error;
  }
};
