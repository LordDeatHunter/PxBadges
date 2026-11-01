/**
 * Create a searchable autocomplete (combobox) inside a root element
 * @param {HTMLElement} root - Container element (its id is used for the input id)
 * @param {Object} [options]
 * @param {string} [options.placeholder] - Input placeholder text
 * @returns {{value: string, setOptions: Function, setPlaceholder: Function, setError: Function}}
 */
export const createAutocomplete = (root, { placeholder = "" } = {}) => {
  const input = document.createElement("input");
  input.type = "text";
  input.id = `${root.id}-input`;
  input.placeholder = placeholder;
  input.autocomplete = "off";
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-controls", `${root.id}-list`);

  const list = document.createElement("ul");
  list.id = `${root.id}-list`;
  list.className = "autocomplete-list hidden";
  list.setAttribute("role", "listbox");

  root.append(input, list);

  let options = [];
  let filtered = [];
  let selected = null;
  let activeIndex = -1;

  const isOpen = () => !list.classList.contains("hidden");

  const close = () => {
    list.classList.add("hidden");
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
  };

  const setActive = (index) => {
    activeIndex = index;
    [...list.children].forEach((li, i) => {
      li.classList.toggle("active", i === index);
      if (i === index) {
        input.setAttribute("aria-activedescendant", li.id);
        li.scrollIntoView({ block: "nearest" });
      }
    });
  };

  const select = (option) => {
    const changed = (selected?.value ?? "") !== (option?.value ?? "");
    selected = option;
    input.value = option ? option.label : "";
    close();
    if (changed) root.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const render = () => {
    const query = input.value.trim().toLowerCase();
    const matches = options.filter((o) => o.label.toLowerCase().includes(query));
    filtered = [
      ...matches.filter((o) => o.label.toLowerCase().startsWith(query)),
      ...matches.filter((o) => !o.label.toLowerCase().startsWith(query)),
    ];

    list.innerHTML = "";
    filtered.forEach((option, i) => {
      const li = document.createElement("li");
      li.id = `${root.id}-option-${i}`;
      li.className = "autocomplete-option";
      li.setAttribute("role", "option");
      li.textContent = option.label;
      // mousedown fires before the input's blur, so the selection isn't lost
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        select(option);
      });
      list.appendChild(li);
    });

    if (!filtered.length) {
      const li = document.createElement("li");
      li.className = "autocomplete-empty";
      li.textContent = "No matches";
      list.appendChild(li);
    }

    list.classList.remove("hidden");
    input.setAttribute("aria-expanded", "true");
    setActive(filtered.length ? 0 : -1);
  };

  input.addEventListener("focus", () => {
    input.select();
    render();
  });
  input.addEventListener("click", () => {
    if (!isOpen()) render();
  });
  input.addEventListener("input", () => {
    if (!input.value) select(null);
    render();
  });
  input.addEventListener("blur", () => {
    const text = input.value.trim().toLowerCase();
    const exact = options.find((o) => o.label.toLowerCase() === text);
    if (exact) select(exact);
    else input.value = selected ? selected.label : "";
    close();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen()) return render();
      if (!filtered.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      if (isOpen() && filtered[activeIndex]) {
        e.preventDefault();
        select(filtered[activeIndex]);
      }
    } else if (e.key === "Escape") {
      input.value = selected ? selected.label : "";
      close();
    }
  });

  return {
    get value() {
      return selected ? selected.value : "";
    },
    set value(v) {
      select(options.find((o) => o.value === v) ?? null);
    },
    /** @param {{value: string, label: string}[]} newOptions */
    setOptions(newOptions) {
      options = newOptions;
      input.disabled = false;
      input.classList.remove("error");
    },
    setPlaceholder(text) {
      input.placeholder = text;
    },
    setError(text) {
      options = [];
      selected = null;
      input.value = "";
      input.placeholder = text;
      input.classList.add("error");
    },
  };
};
