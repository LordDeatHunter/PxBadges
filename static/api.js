import { API_BASE } from "./config.js";
import { showNotification } from "./ui.js";

const toOption = (value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
});

/**
 * Load available technologies from the API
 * @param {ReturnType<typeof import("./autocomplete.js").createAutocomplete>} techSelect - The technology autocomplete
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

    techSelect.setOptions(data.techs.map(toOption));
    techSelect.setPlaceholder("Search for a technology...");
  } catch (error) {
    console.error("Error loading technologies:", error);
    techSelect.setError("Error loading technologies");
    showNotification(
      "Failed to load technologies. Please refresh the page.",
      "error",
    );
    throw error;
  }
};

/**
 * Load available materials from the API
 * @param {ReturnType<typeof import("./autocomplete.js").createAutocomplete>} materialSelect - The material autocomplete
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

    materialSelect.setOptions(data.materials.map(toOption));
    materialSelect.setPlaceholder("Search for a material...");
    if (data.materials.length) materialSelect.value = data.materials[0];
  } catch (error) {
    console.error("Error loading materials:", error);
    materialSelect.setError("Error loading materials");
    showNotification(
      "Failed to load materials. Please refresh the page.",
      "error",
    );
    throw error;
  }
};
