"use strict";

// ==========================================================
// CONFIGURATION
// ==========================================================

const NAVIGATION = {
  dashboard: {
    label: "Dashboard des modérations",
    icon: "https://www.pokepedia.fr/images/5/51/Pilule_Talent-CA.png?20140703123045",
    href: "/tools/dashboard/dashboard.html",
    description: "Vue d'ensemble de la modération",
  },

  categories: [
    {
      label: "Pokédex & Exploration",
      items: [
        {
          label: "Pokédex",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/poke-radar.png",
          href: "/tools/pokedex/pokedex.html",
          description: "Consulter les données des Pokémon",
        },
        {
          label: "Pokémon d'Eleftheria",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/old-sea-map.png",
          href: "#",
          description: "Pokémon de la région",
        },
        {
          label: "Rareté",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/star-piece.png",

          href: "#",
          description: "Consulter les niveaux de rareté",
        },
        {
          label: "Générateur de captures",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/poke-ball.png",
          href: "#",
          description: "Générer une capture de Pokémon",
        },
        {
          label: "Échanges mystères",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/prop-case.png",
          href: "#",
          description: "Gérer les échanges mystères",
        },
      ],
    },
    {
      label: "Écuries & Récompenses",
      items: [
        {
          label: "Défi des écuries",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/lucky-punch.png",
          href: "#",
          description: "Suivre les défis des écuries",
        },
        {
          label: "Coffres",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/coin-case.png",
          href: "#",
          description: "Gérer les coffres et récompenses",
        },
        {
          label: "Talents de la quinzaine",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/explorer-kit.png",
          href: "/tools/talents/talents.html",
          description: "Gérer les talents disponibles",
        },
      ],
    },
    {
      label: "Gestion & Modération",
      items: [
        {
          label: "Messages de modération",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/letter.png",
          href: "#",
          description: "Consulter les messages de modération",
        },
        {
          label: "Votes des Top Sites",
          icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gen5/amulet-coin.png",
          href: "/tools/top-sites/top-sites.html",
          description: "Suivre les votes des Top Sites",
        },
      ],
    },
  ],
};

// ==========================================================
// NAVBAR
// ==========================================================

function initNavbar() {
  // = Création de la navbar.
  const navbar = document.createElement("nav");
  navbar.className = "navbar";
  navbar.setAttribute("aria-label", "Navigation principale");

  // = Gestion du lien actif.
  function setActiveLink() {
    const currentPath = window.location.pathname;

    navbar.querySelectorAll(".navbar__link").forEach((link) => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      const isActive = linkPath === currentPath && link.getAttribute("href") !== "#";

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // = Génération d'une icône.
  function buildIcon(item) {
    const icon = document.createElement("span");
    icon.className = "navbar__icon";

    if (item.icon.startsWith("http")) {
      const image = document.createElement("img");

      image.className = "navbar__img";
      image.src = item.icon;
      image.alt = "";

      icon.append(image);
    } else {
      icon.textContent = item.icon;
    }

    return icon;
  }

  // = Génération d'un titre avec sa copie blanche.
  function buildLabel(labelText) {
    const wrapper = document.createElement("span");
    wrapper.className = "navbar__label-wrap";

    const label = document.createElement("span");
    label.className = "navbar__label";
    label.textContent = labelText;

    const labelLight = document.createElement("span");
    labelLight.className = "navbar__label-light";
    labelLight.textContent = labelText;
    labelLight.setAttribute("aria-hidden", "true");

    wrapper.append(label, labelLight);

    return wrapper;
  }

  // = Génération d'un lien.
  function buildLink(item, number = null) {
    const link = document.createElement("a");
    link.className = "navbar__link";
    link.href = item.href;

    if (number !== null) {
      const numberElement = document.createElement("span");
      numberElement.className = "navbar__number";
      numberElement.textContent = String(number).padStart(2, "0");

      link.append(numberElement);
    }

    if (number === null) {
      link.append(buildIcon(item));
    }

    // = Génération du label.
    const label = number !== null ? buildLabel(item.label) : document.createElement("span");

    if (number === null) {
      label.className = "navbar__label";
      label.textContent = item.label;
    }

    const description = document.createElement("span");
    description.className = "navbar__description";
    description.textContent = item.description;

    link.append(label, description);

    return link;
  }

  // = Génération du Dashboard.
  const dashboardItem = document.createElement("div");
  dashboardItem.className = "navbar__item navbar__item--main";
  dashboardItem.append(buildLink(NAVIGATION.dashboard, 1));

  // = Génération des catégories.
  function buildCategory(category, index) {
    const item = document.createElement("div");
    item.className = "navbar__item navbar__item--dropdown";

    const button = document.createElement("button");
    button.className = "navbar__trigger";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `navbar-menu-${index}`);

    const number = document.createElement("span");
    number.className = "navbar__number";
    number.textContent = String(index + 2).padStart(2, "0");

    const label = buildLabel(category.label);

    button.append(number, label);

    const menu = document.createElement("div");
    menu.className = "navbar__dropdown";
    menu.id = `navbar-menu-${index}`;
    menu.hidden = true;

    const dropdownList = document.createElement("ul");
    dropdownList.className = "navbar__list";

    category.items.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.className = "navbar__dropdown-item";
      listItem.append(buildLink(entry));
      dropdownList.append(listItem);
    });

    menu.append(dropdownList);
    item.append(button, menu);

    // = Ouverture au survol.
    item.addEventListener("mouseenter", () => {
      closeAllDropdowns(item);
      openDropdown(item);
    });

    // = Fermeture à la sortie du menu.
    item.addEventListener("mouseleave", () => {
      if (!item.classList.contains("navbar__item--pinned") && !item.contains(document.activeElement)) {
        closeDropdown(item);
      }
    });

    // = Ouverture et fermeture au clic.
    button.addEventListener("click", () => {
      const isPinned = item.classList.contains("navbar__item--pinned");

      closeAllDropdowns(item);

      if (isPinned) {
        closeDropdown(item);
        hideIndicator();
      } else {
        openDropdown(item);
        item.classList.add("navbar__item--pinned");
        moveIndicator(item);
      }
    });

    // = Fermeture avec Escape.
    item.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown(item);
        button.focus();
      }
    });

    // = Fermeture au clic en dehors.
    document.addEventListener("click", (event) => {
      if (!item.contains(event.target)) {
        closeDropdown(item);
      }
    });

    return item;
  }

  // = Gestion des dropdowns.
  function openDropdown(item) {
    const button = item.querySelector(".navbar__trigger");
    const menu = item.querySelector(".navbar__dropdown");

    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
    item.classList.add("navbar__item--open");
  }

  function closeDropdown(item) {
    const button = item.querySelector(".navbar__trigger");
    const menu = item.querySelector(".navbar__dropdown");

    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
    item.classList.remove("navbar__item--open", "navbar__item--pinned");
  }

  // = Fermeture de tous les dropdowns.
  function closeAllDropdowns(except = null) {
    navbar.querySelectorAll(".navbar__item--dropdown").forEach((item) => {
      if (item !== except) {
        closeDropdown(item);
      }
    });
  }

  // = Assemblage de la navbar.
  const list = document.createElement("div");
  list.className = "navbar__items";

  // = Création du fond animé.
  const indicator = document.createElement("div");
  indicator.className = "navbar__indicator";
  indicator.setAttribute("aria-hidden", "true");

  list.append(indicator, dashboardItem);

  NAVIGATION.categories.forEach((category, index) => {
    list.append(buildCategory(category, index));
  });

  navbar.append(list);
  document.body.prepend(navbar);

  setActiveLink();

  // = Titres de la navigation principale uniquement.
  const labels = Array.from(
    list.querySelectorAll(".navbar__item > .navbar__link > .navbar__label-wrap .navbar__label-light, " + ".navbar__item > .navbar__trigger > .navbar__label-wrap .navbar__label-light"),
  );

  let animationFrame = null;
  let isIndicatorVisible = false;

  // = Révélation du texte recouvert par l'indicateur.
  function updateLabelMasks() {
    animationFrame = null;

    if (!isIndicatorVisible) return;

    const indicatorRect = indicator.getBoundingClientRect();

    labels.forEach((labelLight) => {
      const labelRect = labelLight.getBoundingClientRect();

      if (!labelRect.width || !labelRect.height) {
        labelLight.style.clipPath = "inset(0 100% 0 0)";
        return;
      }

      const left = Math.max(indicatorRect.left, labelRect.left);
      const right = Math.min(indicatorRect.right, labelRect.right);
      const top = Math.max(indicatorRect.top, labelRect.top);
      const bottom = Math.min(indicatorRect.bottom, labelRect.bottom);

      if (right <= left || bottom <= top) {
        labelLight.style.clipPath = "inset(0 100% 0 0)";
        return;
      }

      const insetTop = top - labelRect.top;
      const insetRight = labelRect.right - right;
      const insetBottom = labelRect.bottom - bottom;
      const insetLeft = left - labelRect.left;

      labelLight.style.clipPath = `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px)`;
    });

    animationFrame = requestAnimationFrame(updateLabelMasks);
  }

  // = Démarrage du suivi du masque.
  function startLabelMaskTracking() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }

    animationFrame = requestAnimationFrame(updateLabelMasks);
  }

  // = Déplacement du fond animé.
  function moveIndicator(item) {
    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    indicator.style.width = `${itemRect.width}px`;
    indicator.style.height = `${itemRect.height}px`;
    indicator.style.transform = `translate(${itemRect.left - listRect.left}px, ${itemRect.top - listRect.top}px)`;

    indicator.classList.add("navbar__indicator--visible");
    isIndicatorVisible = true;

    startLabelMaskTracking();
  }

  // = Masquage du fond animé.
  function hideIndicator() {
    const pinnedItem = list.querySelector(".navbar__item--pinned");

    if (pinnedItem) {
      moveIndicator(pinnedItem);
      return;
    }

    indicator.classList.remove("navbar__indicator--visible");
    isIndicatorVisible = false;

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    labels.forEach((labelLight) => {
      labelLight.style.clipPath = "inset(0 100% 0 0)";
    });
  }

  // = Suivi du survol.
  list.querySelectorAll(".navbar__item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      moveIndicator(item);
    });
  });

  // = Masquage lorsque la souris quitte la navbar.
  list.addEventListener("mouseleave", hideIndicator);

  // = Repositionnement lors du redimensionnement.
  window.addEventListener("resize", () => {
    const activeItem = list.querySelector(".navbar__item:hover");

    if (activeItem) {
      moveIndicator(activeItem);
    } else if (isIndicatorVisible) {
      hideIndicator();
    }
  });
}

// ==========================================================
// INITIALISATION
// ==========================================================

document.addEventListener("DOMContentLoaded", initNavbar);
