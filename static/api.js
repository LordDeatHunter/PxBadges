import { $c, API_BASE } from "./config.js";

/**
 * Load available technologies from the API
 * @param {HTMLSelectElement} techSelect - The technology select element
 */
export const loadTechs = async (techSelect) => {
  try {
    const response = await fetch(`${API_BASE}/techs`);
    const data = await response.json();

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
    const data = await response.json();

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
    throw error;
  }
};
