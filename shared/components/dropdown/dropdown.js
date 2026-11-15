export const Dropdown = {
  // ==========================================================
  // CONFIGURATION
  // ==========================================================

  defaults: {
    source: null,

    type: "select",
    mode: "single",

    placeholder: "Sélectionner une option",
    searchPlaceholder: "Rechercher...",
    emptyMessage: "Aucun résultat",

    valueKey: "id",
    labelKey: "nom",
    searchKeys: null,

    defaultValue: null,
    disabled: false,

    renderOption: null,
    renderValue: null,

    onChange: null,
    options: [],
  },

  // = Instances actives.

  instances: new Set(),

  // ==========================================================
  // CRÉATION
  // ==========================================================

  async create(options = {}) {
    const config = {
      ...this.defaults,
      ...options,
    };

    const container = typeof config.container === "string" ? document.querySelector(config.container) : config.container;

    if (!container) {
      console.error("[Dropdown] Conteneur introuvable.");
      return null;
    }

    if (!["filter", "select"].includes(config.type)) {
      console.error("[Dropdown] Type invalide.");
      return null;
    }

    if (!["single", "multiple"].includes(config.mode)) {
      console.error("[Dropdown] Mode invalide.");
      return null;
    }

    try {
      let data;

      // = Données fournies directement.

      if (Array.isArray(options.options)) {
        data = options.options;
      }

      // = Chargement depuis une URL.
      else if (config.source) {
        const response = await fetch(config.source);

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const json = await response.json();

        data = Array.isArray(json) ? json : json.members;
      }

      if (!Array.isArray(data)) {
        throw new Error("Aucune donnée valide trouvée.");
      }

      // = Création de l'instance.

      const instance = {
        ...config,
        container,
        options: data,
        selected: config.mode === "multiple" ? [] : null,
        search: "",
        isOpen: false,
        activeIndex: -1,
      };

      this.initialize(instance);

      this.instances.add(instance);

      return instance;
    } catch (error) {
      console.error("[Dropdown] Erreur de chargement :", error);
      container.innerHTML = "";
      return null;
    }
  },

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  initialize(instance) {
    const { container, mode } = instance;

    container.innerHTML = "";

    container.classList.add("dropdown");
    container.dataset.type = instance.type;
    container.dataset.mode = mode;

    // = Structure HTML.

    const wrapper = document.createElement("div");
    wrapper.className = "dropdown__wrapper";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "dropdown__trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.disabled = instance.disabled;

    const value = document.createElement("span");
    value.className = "dropdown__value";

    const arrow = document.createElement("span");
    arrow.className = "dropdown__arrow";
    arrow.setAttribute("aria-hidden", "true");

    trigger.append(value, arrow);

    const menu = document.createElement("div");
    menu.className = "dropdown__menu";
    menu.hidden = true;

    // = Recherche.

    const searchWrapper = document.createElement("div");
    searchWrapper.className = "dropdown__search-wrapper";

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.className = "dropdown__search";
    searchInput.placeholder = instance.searchPlaceholder;
    searchInput.autocomplete = "off";
    searchInput.setAttribute("aria-label", instance.searchPlaceholder);

    searchWrapper.appendChild(searchInput);

    // = Actions de sélection multiple.

    const actionsWrapper = document.createElement("div");
    actionsWrapper.className = "dropdown__actions";
    actionsWrapper.hidden = mode !== "multiple";

    const selectAllButton = document.createElement("button");
    selectAllButton.type = "button";
    selectAllButton.className = "dropdown__action dropdown__action--select";
    selectAllButton.textContent = "Tout sélectionner";

    selectAllButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.selectAll(instance);
    });

    const deselectAllButton = document.createElement("button");
    deselectAllButton.type = "button";
    deselectAllButton.className = "dropdown__action dropdown__action--deselect";
    deselectAllButton.textContent = "Tout désélectionner";

    deselectAllButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.clear(instance);
    });

    actionsWrapper.append(selectAllButton, deselectAllButton);

    // = Options.

    const optionsElement = document.createElement("div");
    optionsElement.className = "dropdown__options";
    optionsElement.setAttribute("role", "listbox");

    if (mode === "multiple") {
      optionsElement.setAttribute("aria-multiselectable", "true");
    }

    const emptyElement = document.createElement("div");
    emptyElement.className = "dropdown__empty";
    emptyElement.textContent = instance.emptyMessage;
    emptyElement.hidden = true;

    menu.append(searchWrapper, actionsWrapper, optionsElement, emptyElement);
    wrapper.append(trigger, menu);
    container.appendChild(wrapper);

    // = Références.

    Object.assign(instance, {
      wrapper,
      trigger,
      valueElement: value,
      menu,
      searchInput,
      actionsWrapper,
      selectAllButton,
      deselectAllButton,
      optionsElement,
      emptyElement,
    });

    // = Valeur par défaut.

    if (instance.defaultValue !== null) {
      const values = Array.isArray(instance.defaultValue) ? instance.defaultValue : [instance.defaultValue];

      if (mode === "multiple") {
        instance.selected = instance.options.filter((option) => values.some((value) => String(option[instance.valueKey]) === String(value)));
      } else {
        instance.selected = instance.options.find((option) => String(option[instance.valueKey]) === String(instance.defaultValue)) || null;
      }
    }

    this.bindEvents(instance);
    this.render(instance);
  },

  // ==========================================================
  // ÉVÉNEMENTS
  // ==========================================================

  bindEvents(instance) {
    const { trigger, searchInput, wrapper } = instance;

    // = Ouverture.

    trigger.addEventListener("click", () => {
      this.toggle(instance);
    });

    // = Recherche.

    searchInput.addEventListener("input", () => {
      instance.search = searchInput.value;
      instance.activeIndex = -1;

      this.renderOptions(instance);
    });

    // = Navigation depuis le bouton.

    trigger.addEventListener("keydown", (event) => {
      if (["ArrowDown", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        this.open(instance);
        searchInput.focus();
      }
    });

    // = Navigation dans la recherche.

    searchInput.addEventListener("keydown", (event) => {
      const options = this.getVisibleOptions(instance);

      if (event.key === "Escape") {
        event.preventDefault();
        this.close(instance);
        trigger.focus();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        instance.activeIndex = Math.min(instance.activeIndex + 1, options.length - 1);

        this.updateActiveOption(instance);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        instance.activeIndex = Math.max(instance.activeIndex - 1, 0);

        this.updateActiveOption(instance);
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const option = options[instance.activeIndex];

        if (option) {
          this.select(instance, option);
        } else if (options.length === 1) {
          this.select(instance, options[0]);
        }
      }
    });

    // = Fermeture extérieure.

    instance.outsideClick = (event) => {
      if (!wrapper.contains(event.target)) {
        this.close(instance);
      }
    };

    document.addEventListener("click", instance.outsideClick);
  },

  // ==========================================================
  // OUVERTURE / FERMETURE
  // ==========================================================

  toggle(instance) {
    instance.isOpen ? this.close(instance) : this.open(instance);
  },

  open(instance) {
    if (instance.disabled || instance.isOpen) return;

    instance.isOpen = true;

    instance.menu.hidden = false;
    instance.trigger.setAttribute("aria-expanded", "true");
    instance.container.classList.add("dropdown--open");

    instance.searchInput.focus();
  },

  close(instance) {
    if (!instance.isOpen) return;

    instance.isOpen = false;

    instance.menu.hidden = true;
    instance.trigger.setAttribute("aria-expanded", "false");
    instance.container.classList.remove("dropdown--open");

    instance.search = "";
    instance.activeIndex = -1;
    instance.searchInput.value = "";

    this.renderOptions(instance);
  },

  // ==========================================================
  // AFFICHAGE GÉNÉRAL
  // ==========================================================

  render(instance) {
    this.renderValue(instance);
    this.renderOptions(instance);
  },

  // = Valeur sélectionnée.

  renderValue(instance) {
    const { mode, selected, placeholder, valueElement, renderValue } = instance;

    valueElement.innerHTML = "";

    const hasSelection = mode === "multiple" ? selected.length > 0 : selected !== null;

    valueElement.classList.toggle("dropdown__value--placeholder", !hasSelection);

    if (!hasSelection) {
      valueElement.textContent = placeholder;
      return;
    }

    if (typeof renderValue === "function") {
      const result = renderValue(selected);

      if (result instanceof Node) {
        valueElement.appendChild(result);
      } else if (result !== null && result !== undefined) {
        valueElement.textContent = String(result);
      }

      return;
    }

    if (mode === "multiple") {
      valueElement.textContent = `${selected.length} élément${selected.length > 1 ? "s" : ""} sélectionné${selected.length > 1 ? "s" : ""}`;
    } else {
      valueElement.textContent = selected[instance.labelKey] ?? "";
    }
  },

  // ==========================================================
  // RECHERCHE
  // ==========================================================

  getFilteredOptions(instance) {
    const query = instance.search.trim().toLocaleLowerCase();

    if (!query) return instance.options;

    const keys = instance.searchKeys || [instance.labelKey];

    return instance.options.filter((option) =>
      keys.some((key) =>
        String(option[key] ?? "")
          .toLocaleLowerCase()
          .includes(query),
      ),
    );
  },

  // ==========================================================
  // AFFICHAGE DES OPTIONS
  // ==========================================================

  renderOptions(instance) {
    const { optionsElement, emptyElement, mode, selected, valueKey, renderOption } = instance;

    // = Mémoriser le scroll.

    const scrollPosition = optionsElement.scrollTop;

    const filteredOptions = this.getFilteredOptions(instance);

    optionsElement.innerHTML = "";

    emptyElement.hidden = filteredOptions.length > 0;

    filteredOptions.forEach((option, index) => {
      const value = option[valueKey];

      const isSelected = mode === "multiple" ? selected.some((item) => String(item[valueKey]) === String(value)) : selected && String(selected[valueKey]) === String(value);

      const element = document.createElement("button");

      // = Éviter le déplacement du scroll au clic.

      element.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });

      element.type = "button";
      element.className = "dropdown__option";
      element.disabled = option.disabled === true;

      element.setAttribute("role", "option");
      element.setAttribute("aria-selected", String(!!isSelected));

      element.classList.toggle("dropdown__option--selected", !!isSelected);

      // = Rendu personnalisé.

      if (typeof renderOption === "function") {
        const result = renderOption(option, {
          selected: !!isSelected,
          index,
        });

        if (result instanceof Node) {
          element.appendChild(result);
        } else if (result !== null && result !== undefined) {
          element.textContent = String(result);
        }
      } else {
        element.textContent = option[instance.labelKey] ?? "";
      }

      // = Indicateur multiple.

      if (mode === "multiple") {
        const checkbox = document.createElement("span");

        checkbox.className = "dropdown__checkbox";
        checkbox.setAttribute("aria-hidden", "true");

        element.prepend(checkbox);
      }

      // = Sélection.

      element.addEventListener("click", (event) => {
        event.stopPropagation();
        this.select(instance, option);
      });

      optionsElement.appendChild(element);
    });

    instance.visibleOptions = filteredOptions;

    // = Restaurer le scroll.

    optionsElement.scrollTop = scrollPosition;
  },

  // ==========================================================
  // NAVIGATION CLAVIER
  // ==========================================================

  getVisibleOptions(instance) {
    return Array.from(instance.optionsElement.querySelectorAll(".dropdown__option:not(:disabled)")).map((element) => {
      const index = Array.from(instance.optionsElement.children).indexOf(element);

      return instance.visibleOptions[index];
    });
  },

  updateActiveOption(instance) {
    const elements = instance.optionsElement.querySelectorAll(".dropdown__option:not(:disabled)");

    elements.forEach((element) => {
      element.classList.remove("dropdown__option--active");
    });

    const active = elements[instance.activeIndex];

    if (active) {
      active.classList.add("dropdown__option--active");
      active.scrollIntoView({ block: "nearest" });
    }
  },

  // ==========================================================
  // SÉLECTION
  // ==========================================================

  select(instance, option) {
    if (option.disabled === true) return;

    const { mode, valueKey } = instance;

    if (mode === "multiple") {
      const index = instance.selected.findIndex((item) => String(item[valueKey]) === String(option[valueKey]));

      if (index >= 0) {
        instance.selected.splice(index, 1);
      } else {
        instance.selected.push(option);
      }
    } else {
      instance.selected = option;

      // = Fermer uniquement en mode single.

      this.close(instance);
    }

    // = Actualiser l'affichage.

    this.render(instance);

    // = Transmettre la sélection.

    if (typeof instance.onChange === "function") {
      const value = mode === "multiple" ? instance.selected.map((item) => item[valueKey]) : instance.selected[valueKey];

      instance.onChange(value, instance.selected);
    }
  },

  // ==========================================================
  // TOUT SÉLECTIONNER
  // ==========================================================

  selectAll(instance) {
    if (!instance || instance.mode !== "multiple") return;

    instance.selected = instance.options.filter((option) => option.disabled !== true);

    this.render(instance);

    if (typeof instance.onChange === "function") {
      instance.onChange(
        instance.selected.map((item) => item[instance.valueKey]),
        instance.selected,
      );
    }
  },

  // ==========================================================
  // RÉINITIALISATION
  // ==========================================================

  clear(instance) {
    if (!instance) return;

    instance.selected = instance.mode === "multiple" ? [] : null;

    this.render(instance);

    if (typeof instance.onChange === "function") {
      instance.onChange(instance.mode === "multiple" ? [] : null, instance.selected);
    }
  },

  // ==========================================================
  // DESTRUCTION
  // ==========================================================

  destroy(instance) {
    if (!instance) return;

    document.removeEventListener("click", instance.outsideClick);

    instance.container.innerHTML = "";
    instance.container.classList.remove("dropdown--open");
    instance.container.classList.remove("dropdown");

    delete instance.container.dataset.type;
    delete instance.container.dataset.mode;

    instance.isOpen = false;

    this.instances.delete(instance);
  },
};
