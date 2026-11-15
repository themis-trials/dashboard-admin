import { Button } from "https://sixtinerpg.github.io/themis-lise/components/buttons/buttons.js";
import { DateFilter } from "https://sixtinerpg.github.io/themis-lise/components/date-filter/date-filter.js";
import { Dropdown } from "https://sixtinerpg.github.io/themis-lise/components/dropdown/dropdown.js";
import { ForumAPI } from "https://sixtinerpg.github.io/themis-lise/forum.js?v=2";
// ==========================================================
// CONFIGURATION
// ==========================================================

const URLS = {
  talents: "https://sixtinerpg.github.io/themis-lise/talents/talents.json",
  members: "https://sixtinerpg.github.io/themis-lise/talents/memberlist_local.json",
  objets: "https://sixtinerpg.github.io/themis-lise/talents/objets.json?v=2",
  distributions: "https://opensheet.elk.sh/1sRWoDg-4tnX_oiE_v0PK_D7ZGnxLk6OAeJY91PVFkoU/Distributions",
  googleSheets: "https://script.google.com/macros/s/AKfycby7sfWJyZ_2PMn1gm8MuaHk594uk6_dEUxTEEEV6j5Bo3lp2rgoBhcHPzbMmWSuGjtoGw/exec",
};

const TARGET_TALENTS = {
  Prévoyant: {
    type: "automatique",
    delai: "quinzaine",
    effet: "Récupérer 4 Poké Balls.",
  },

  "Fana de l’évolution": {
    type: "aléatoire",
    delai: "quinzaine",
    effet: "Récupérer 1 objet évolutif aléatoire.",
  },

  "Expert en Omelette": {
    type: "aléatoire",
    delai: "quinzaine",
    effet: "Récupérer 1 œuf à tirer avec la roulette.",
  },

  "Docteur du Jurassique": {
    type: "aléatoire",
    delai: "quinzaine",
    effet: "Récupérer 1 fossile aléatoire.",
  },

  "Chasseur de primes": {
    type: "demande",
    delai: "quinzaine",
    effet: "Permet d’accepter une mission de capture d’espèces spécifiques contre 20, 30 ou 40 PO.",
  },

  Chef: {
    type: "demande",
    delai: "quinzaine",
    effet: "Cuisiner un plat aléatoire.",
  },

  Pensionnaire: {
    type: "demande",
    delai: "quinzaine",
    effet: "Demander une reproduction entre deux Pokémon de joueurs.",
  },

  "Passeur de savoir": {
    type: "demande",
    delai: "quinzaine",
    effet: "Prêt temporaire d’un talent de rang D ou C à un autre joueur.",
  },

  Mentor: {
    type: "demande",
    delai: "quinzaine",
    effet: "Offrir une montée de rang D → C à un autre joueur.",
  },

  "Graveur de CD": {
    type: "demande",
    delai: "quinzaine",
    effet: "Fabrication d’une CT à usage unique.",
  },

  "Donneur de capacités": {
    type: "demande",
    delai: "quinzaine",
    effet: "Enseignement d’une attaque de reproduction / donneur de capacités.",
  },

  "Professeur Pokémon": {
    type: "demande",
    delai: "quinzaine",
    effet: "Proposition d’une mission de recherche à d’autres joueurs.",
  },

  "CT Douteuse": {
    type: "demande",
    delai: "quinzaine",
    effet: "Enseignement d’une attaque normalement inaccessible à un Pokémon (validation du staff).",
  },

  Transmission: {
    type: "demande",
    delai: "quinzaine",
    effet: "Offre à un autre joueur du bénéfice d’un talent à utilisation unique de rang A ou inférieur.",
  },

  "Aimant à raretés": {
    type: "demande",
    delai: "quinzaine",
    effet: "Demande d’une apparition tirée uniquement parmi les Pokémon Peu Communs et Rares.",
  },

  Cristalliseur: {
    type: "demande",
    delai: "mensuel",
    effet: "Fabrication d’un Cristal Z.",
  },

  Joaillier: {
    type: "demande",
    delai: "mensuel",
    effet: "Fabrication d’une Méga-Gemme.",
  },

  "Pousseur de fonte": {
    type: "demande",
    delai: "mensuel",
    effet: "Fabrication d’un objet Dynamax ou Gigamax.",
  },

  Princesse: {
    type: "demande",
    delai: "mensuel",
    effet: "Fabrication d’un Orbe Téracristal.",
  },
};

// Configuration des catégories d'objets.

const TALENTS_OBJETS = {
  "Fana de l’évolution": "objets_evolutifs",
  "Docteur du Jurassique": "fossiles",
};

// Configuration des quantités de récompenses.

const TALENTS_QUANTITES = {
  Prévoyant: {
    nom: "Poké Balls",
    inventaireNom: "Poké Ball",
    quantite: 4,
  },
};

// Configuration des dropdowns de récompenses.

const TALENTS_DROPDOWNS = {
  Cristalliseur: "cristal-z",
  Joaillier: "mega-gemmes",
  "Pousseur de fonte": "dynamax",
  Princesse: "teracristal",
  "Graveur de CD": "ct",
  "Passeur de savoir": "passeur",
  Mentor: "mentor",
  Transmission: "transmission",
};

// Configuration des dropdowns d'objets.

const DROPDOWNS_OBJETS = [
  {
    categorie: "cristal-z",
    type: "cristal-z",
    placeholder: "Choisir un Cristal Z",
  },
  {
    categorie: "mega-gemmes",
    type: "mega-gemmes",
    placeholder: "Choisir une Méga-Gemme",
  },
  {
    categorie: "dynamax",
    type: "dynamax",
    placeholder: "Choisir un objet Dynamax",
  },
  {
    categorie: "teracristal",
    type: "teracristal",
    placeholder: "Choisir un objet Téracristal",
  },
  {
    categorie: "ct",
    type: "ct",
    placeholder: "Choisir une CT",
  },
];

// Configuration des dropdowns de joueurs.

const DROPDOWNS_JOUEURS = {
  "Passeur de savoir": "Choisir un joueur à qui prêter le talent",
  Mentor: "Choisir un joueur à qui offrir une montée de rang",
  Transmission: "Choisir un joueur bénéficiaire",
};

// Talents dont la récompense modifie l'inventaire.

const TALENTS_RECOMPENSES_INVENTAIRE = new Set(["Prévoyant", "Fana de l’évolution", "Graveur de CD", "Docteur du Jurassique", "Cristalliseur", "Joaillier", "Pousseur de fonte", "Princesse"]);

// Talents dont l'historique ne doit pas afficher le dernier objet.

const TALENTS_SANS_DERNIER_ITEM = new Set(["Prévoyant", "Chef"]);

// Talents dont la récompense est un joueur.

const TALENTS_RECOMPENSE_JOUEUR = new Set(["Passeur de savoir", "Mentor", "Transmission"]);

// ==========================================================
// ÉLÉMENTS HTML
// ==========================================================

const talentsList = document.querySelector("#talents-list");
const talentsJoueurs = document.querySelector("#talents-joueurs");

let synchroniserButton = null;
const synchroniserMessage = document.querySelector("#synchroniser-message");
const synchroniserFrame = document.querySelector("#synchroniser-frame");
const synchroniserCompteur = document.querySelector("#synchroniser-compteur");

// ==========================================================
// DONNÉES
// ==========================================================

let objetsData = {};

const modificationsEnAttente = new Map();

let synchronisationEnCours = null;

let joueursSelectionnes = [];
let talentsSelectionnes = [];

let datesSelectionnees = {
  mode: "avant",
  start: null,
  end: null,
};

// ==========================================================
// UTILITAIRES
// ==========================================================

// = Charger des données JSON.

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} : ${url}`);
  }

  return response.json();
}

// = Normaliser une chaîne.

function normalizeName(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "'")
    .trim()
    .toLowerCase();
}

// = Échapper le HTML.

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

// = Formater une date.

function formatDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// = Formater une date de distribution.

function formatDistributionDate(value) {
  return formatDate(parseDate(value));
}

// = Indexer une configuration par nom normalisé.

function createNormalizedMap(object) {
  return new Map(Object.entries(object).map(([name, value]) => [normalizeName(name), value]));
}

const TARGET_TALENTS_BY_NAME = createNormalizedMap(TARGET_TALENTS);
const TALENTS_OBJETS_BY_NAME = createNormalizedMap(TALENTS_OBJETS);
const TALENTS_DROPDOWNS_BY_NAME = createNormalizedMap(TALENTS_DROPDOWNS);
const TALENTS_QUANTITES_BY_NAME = createNormalizedMap(TALENTS_QUANTITES);

const TALENTS_RECOMPENSES_INVENTAIRE_KEYS = new Set([...TALENTS_RECOMPENSES_INVENTAIRE].map(normalizeName));

const TALENTS_SANS_DERNIER_ITEM_KEYS = new Set([...TALENTS_SANS_DERNIER_ITEM].map(normalizeName));

const TALENTS_RECOMPENSE_JOUEUR_KEYS = new Set([...TALENTS_RECOMPENSE_JOUEUR].map(normalizeName));

// = Récupérer les talents concernés.

function getTargetTalents(talents) {
  return talents.filter((talent) => TARGET_TALENTS_BY_NAME.has(normalizeName(talent.nom)));
}

// = Récupérer la configuration d'un talent.

function getTalentConfig(name) {
  return TARGET_TALENTS_BY_NAME.get(normalizeName(name));
}

// = Récupérer les objets fixes d'un talent.

function getInitialInventory(talentName) {
  const config = TALENTS_QUANTITES_BY_NAME.get(normalizeName(talentName));

  if (!config) return {};

  return {
    [config.inventaireNom || config.nom]: config.quantite,
  };
}

// = Créer un élément HTML.

function createElement(tag, className, textContent) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return element;
}

// = Créer un rendu joueur / objet.

function renderMemberOption(item, { imageKey, labelKey }) {
  const wrapper = createElement("div", "dropdown__member");

  const image = createElement("img", "dropdown__avatar");

  image.src = item[imageKey] || "";
  image.alt = "";
  image.loading = "lazy";

  const label = createElement("span", "", item[labelKey]);

  wrapper.append(image, label);

  return wrapper;
}

// ==========================================================
// GESTION DES DATES
// ==========================================================

// = Convertir une date en objet Date.

function parseDate(value) {
  if (!value) return null;

  const text = String(value).trim();

  let year;
  let month;
  let day;

  // Format AAAA-MM-JJ.

  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (match) {
    [, year, month, day] = match;
  } else {
    // Format JJ/MM/AAAA.

    match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (!match) return null;

    [, day, month, year] = match;
  }

  year = Number(year);
  month = Number(month);
  day = Number(day);

  const date = new Date(year, month - 1, day);

  // Vérifier la validité de la date.

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

// = Calculer la prochaine distribution.

function getNextDistribution(value, delai) {
  const date = parseDate(value);

  if (!date) return null;

  if (delai === "quinzaine") {
    date.setDate(date.getDate() + 15);
  }

  if (delai === "mensuel") {
    const originalDay = date.getDate();

    date.setDate(1);
    date.setMonth(date.getMonth() + 1);

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    date.setDate(Math.min(originalDay, lastDay));
  }

  return date;
}

// = Calculer le statut d'une récompense.

function getRewardStatus(derniereDistribution, delai) {
  const prochaineDistribution = getNextDistribution(derniereDistribution, delai);

  if (!prochaineDistribution) {
    return "attente";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  prochaineDistribution.setHours(0, 0, 0, 0);

  return today < prochaineDistribution ? "distribue" : "attente";
}

// = Actualiser les dates de distribution.

function updateDistributionDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  document.querySelectorAll(".talents__joueur-talent-prochaine-date").forEach((element) => {
    const date = parseDate(element.textContent.trim());

    if (!date) {
      delete element.dataset.date;
      return;
    }

    date.setHours(0, 0, 0, 0);

    const difference = Math.round((date - today) / 86400000);

    const statuses = {
      0: "today",
      "-3": "3daysBefore",
      "-1": "yesterday",
      3: "3daysAfter",
    };

    const status = statuses[difference];

    if (status) {
      element.dataset.date = status;
    } else {
      delete element.dataset.date;
    }
  });
}

// ==========================================================
// MODIFICATIONS EN ATTENTE
// ==========================================================

// = Enregistrer une modification.

function marquerModification(key, data) {
  const existing = modificationsEnAttente.get(key) || {};

  modificationsEnAttente.set(key, {
    ...existing,
    ...data,
  });

  actualiserCompteur();
}

// = Actualiser le compteur.

function actualiserCompteur() {
  if (!synchroniserCompteur) return;

  const count = modificationsEnAttente.size;

  synchroniserCompteur.textContent = count ? `${count} modification${count > 1 ? "s" : ""} non enregistrée${count > 1 ? "s" : ""} sur Google Sheets` : "Aucune modification en attente";
}

// = Avertissement avant de quitter.

window.addEventListener("beforeunload", (event) => {
  if (!modificationsEnAttente.size) return;

  event.preventDefault();
  event.returnValue = "";
});

// ==========================================================
// RENDU DES TALENTS
// ==========================================================

function renderTalents(talents) {
  if (!talentsList) return;

  const sections = [
    {
      delai: "quinzaine",
      title: "Quinzaine",
    },
    {
      delai: "mensuel",
      title: "Mensuel",
    },
  ];

  const selectedTalents = getTargetTalents(talents);

  talentsList.innerHTML = sections
    .map(({ delai, title }) => {
      const items = selectedTalents
        .filter((talent) => getTalentConfig(talent.nom)?.delai === delai)
        .map(renderTalentItem)
        .join("");

      if (!items) return "";

      return `
        <li class="talents__section">
          <h2 class="talents__section-title">${title}</h2>

          <ul class="talents__items">
            ${items}
          </ul>
        </li>
      `;
    })
    .join("");
}

// = Rendu d'un talent.

function renderTalentItem(talent) {
  const config = getTalentConfig(talent.nom);

  return `
    <li class="talents__item">
      ${renderTalentIcon(talent, "talents__icon")}

      <h3 class="talents__name">
        ${escapeHtml(talent.nom)}
      </h3>

      <div
        class="talents__type"
        data-type="${escapeHtml(config?.type || "")}"
      ></div>

      <p class="talents__effet">
        ${escapeHtml(config?.effet || "")}
      </p>
    </li>
  `;
}

// = Rendu d'une icône.

function renderTalentIcon(talent, className) {
  if (!talent.icon) return "";

  return `
    <img
      class="${className}"
      src="${escapeHtml(talent.icon)}"
      alt=""
    >
  `;
}

// ==========================================================
// INDEX DES DISTRIBUTIONS
// ==========================================================

function createDistributionsMap(distributions) {
  return new Map(
    distributions.map((distribution) => [
      `${distribution.joueur_id}::${normalizeName(distribution.talent)}`,
      {
        derniere_distribution: distribution.derniere_distribution,
        dernier_item: distribution.dernier_item,
      },
    ]),
  );
}

// ==========================================================
// PRÉPARATION DES JOUEURS
// ==========================================================

function preparePlayers(members, talents) {
  const talentsByName = new Map(getTargetTalents(talents).map((talent) => [normalizeName(talent.nom), talent]));

  return members
    .filter((member) => String(member.id) !== "1")
    .map((member) => ({
      ...member,
      talents: (member.talents || []).map((name) => talentsByName.get(normalizeName(name))).filter(Boolean),
    }))
    .filter((member) => member.talents.length)
    .sort((a, b) => a.pseudo.localeCompare(b.pseudo, "fr"));
}

// ==========================================================
// RENDU DES JOUEURS
// ==========================================================

function renderTalentsJoueurs(members, talents, distributions) {
  if (!talentsJoueurs) return;

  const distributionsByKey = createDistributionsMap(distributions);
  const players = preparePlayers(members, talents);

  talentsJoueurs.innerHTML = players.map((player, index) => renderPlayer(player, index, distributionsByKey)).join("");

  initGenerateButtons();
  initDateButtons();
  initRewardButtons();

  updateDistributionDates();
}

// = Rendu d'un joueur.

function renderPlayer(player, index, distributions) {
  const detailsId = `talents-details-${index}`;

  return `
    <li
      class="talents__joueur border-grp"
      data-group="grp-${escapeHtml(player.groupe)}"
      data-joueur-id="${escapeHtml(player.id)}"
      data-joueur-name="${escapeHtml(player.pseudo)}"
    >

      ${renderPlayerIdentity(player, detailsId)}

      ${renderPlayerPreview(player)}

      ${renderPlayerDetails(player, detailsId, distributions)}

    </li>
  `;
}

// = Identité du joueur.

function renderPlayerIdentity(player, detailsId) {
  return `
    <img
      class="talents__joueur-avatar"
      src="${escapeHtml(player.avatar)}"
      alt=""
    >

    <div class="talents__joueur-identity">
      <h3 class="talents__joueur-name txt-grp">
        ${escapeHtml(player.pseudo)}
      </h3>

      <span class="talents__joueur-rank">
        rang ${escapeHtml(player.rank)}
      </span>

      <span class="talents__joueur-count">
        ${player.talents.length}
        talent${player.talents.length > 1 ? "s" : ""}
      </span>
    </div>

    <button
      class="talents__joueur-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="${detailsId}"
      aria-label="Afficher les talents de ${escapeHtml(player.pseudo)}"
    >
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>
  `;
}

// = Aperçu des talents.

function renderPlayerPreview(player) {
  return `
    <div class="talents__joueur-preview">
      ${player.talents
        .map(
          (talent) => `
            <span class="talents__joueur-badge">
              ${escapeHtml(talent.nom)}
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}

// = Détails du joueur.

function renderPlayerDetails(player, detailsId, distributions) {
  return `
    <div
      class="talents__joueur-details"
      id="${detailsId}"
      aria-hidden="true"
      inert
    >
      <div class="talents__joueur-details-inner">
        <ul class="talents__joueur-list">
          ${player.talents.map((talent) => renderPlayerTalent(player, talent, distributions)).join("")}
        </ul>
      </div>
    </div>
  `;
}

// = Rendu d'un talent du joueur.

function renderPlayerTalent(player, talent, distributions) {
  const talentName = talent.nom;
  const talentKey = normalizeName(talentName);

  const config = getTalentConfig(talentName);

  const category = TALENTS_OBJETS_BY_NAME.get(talentKey);

  const distribution = distributions.get(`${player.id}::${talentKey}`);

  const derniereDistribution = distribution?.derniere_distribution;

  const dernierItem = distribution?.dernier_item;

  const dernierObjet = category ? (objetsData[category] || []).find((objet) => normalizeName(objet.nom) === normalizeName(dernierItem || "")) : null;

  const prochaineDistribution = getNextDistribution(derniereDistribution, config?.delai);

  const statutRecompense = getRewardStatus(derniereDistribution, config?.delai);

  const hasInventoryReward = TALENTS_RECOMPENSES_INVENTAIRE_KEYS.has(talentKey);

  const initialInventory = getInitialInventory(talentName);

  return `
  <article
    class="talents__joueur-talent"
    data-talent="${escapeHtml(talentName)}"
    data-delai="${config?.delai || ""}"
    data-statut="${statutRecompense}"
    data-date-recompense="${derniereDistribution || ""}"
    ${hasInventoryReward ? `data-inventaire='${escapeHtml(JSON.stringify(initialInventory))}'` : ""}
  >

      ${renderPlayerTalentInfo(talent, config, prochaineDistribution)}

      ${renderPlayerTalentHistory(talentKey, dernierItem, dernierObjet, derniereDistribution)}

      ${renderTalentGeneration(player, talentKey, category)}

      ${renderTalentDistribution(TALENTS_RECOMPENSES_INVENTAIRE_KEYS.has(talentKey))}

    </article>
  `;
}

// = Informations du talent.
function renderPlayerTalentInfo(talent, config, prochaineDistribution) {
  return `
    <div class="talents__joueur-talent-info">
      ${renderTalentIcon(talent, "talents__joueur-talent-info-icon")}
      <div class="talents__joueur-talent-info-prochaine-date">
        ${formatDate(prochaineDistribution)}
      </div>

      <h4 class="talents__joueur-talent-info-title">
        ${escapeHtml(talent.nom)}
      </h4>

      <p class="talents__joueur-talent-info-description">
        ${escapeHtml(config?.effet || "")}
      </p>
    </div>
  `;
}

// = Historique du talent.

function renderPlayerTalentHistory(talentKey, dernierItem, dernierObjet, derniereDistribution) {
  const hideLastItem = TALENTS_SANS_DERNIER_ITEM_KEYS.has(talentKey);

  return `
    <div class="talents__joueur-talent-historique">

      <div class="talents__joueur-talent-historique-derniere-date">
          ${formatDistributionDate(derniereDistribution)}
      </div>

      ${hideLastItem ? "" : renderLastItem(dernierItem, dernierObjet, talentKey)}

    </div>
  `;
}

// = Dernier objet distribué.

function renderLastItem(dernierItem, dernierObjet, talentKey) {
  const isCapture = talentKey === normalizeName("Aimant à raretés");

  if (isCapture) {
    return `
      <div class="talents__joueur-talent-historique-dernier-item">
        <span class="talents__joueur-talent-historique-dernier-item-name">
        <i class="fa-solid fa-arrow-right"></i>
          ${
            dernierItem
              ? `
                <a
                  href="${escapeHtml(dernierItem)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >lien de la capture</a>
              `
              : "—"
          }
        </span>
      </div>
    `;
  }

  return `
    <div class="talents__joueur-talent-historique-dernier-item">
    <i class="fa-solid fa-arrow-right"></i>

      ${
        dernierObjet?.image
          ? `
            <img
              class="talents__joueur-talent-historique-dernier-item-icon"
              src="${escapeHtml(dernierObjet.image)}"
              alt=""
            >
          `
          : ""
      }

      <span class="talents__joueur-talent-historique-dernier-item-name">
        ${escapeHtml(dernierItem || "—")}
      </span>
    </div>
  `;
}

// ==========================================================
// GÉNÉRATION DES RÉCOMPENSES
// ==========================================================

// = Rendu des dropdowns et champs de récompense.

function renderTalentGeneration(player, talentKey, category) {
  const dropdownType = TALENTS_DROPDOWNS_BY_NAME.get(talentKey);

  return `
    <div class="talents__joueur-talent-generation">

      ${
        category
          ? `
            <span
              data-button="generate"
              data-category="${escapeHtml(category)}"
            ></span>
          `
          : ""
      }

      ${
        dropdownType
          ? `
            <div
              id="dropdown-${dropdownType}-${escapeHtml(player.id)}"
              data-dropdown="${dropdownType}"
            ></div>
          `
          : ""
      }

      ${renderTalentInput(talentKey)}

    </div>
  `;
}

// = Rendu des champs de saisie.

function renderTalentInput(talentKey) {
  if (talentKey === normalizeName("Aimant à raretés")) {
    return `
      <input
        class="talents__joueur-talent-input"
        type="url"
        placeholder="URL"
        aria-label="URL de la capture"
        required
      >
    `;
  }

  if ([normalizeName("CT Douteuse"), normalizeName("Donneur de capacités")].includes(talentKey)) {
    return `
      <input
        class="talents__joueur-talent-input"
        type="text"
        placeholder="Saisir une valeur"
        aria-label="Valeur de la récompense"
        required
      >
    `;
  }

  return "";
}

// = Rendu de la distribution.

function renderTalentDistribution(hasInventoryReward) {
  return `
    <div class="talents__joueur-talent-date">

      <input
        class="talents__joueur-talent-distribution-date-input"
        type="date"
        aria-label="Date de distribution"
      >

      <span data-button="date-submit"></span>

    </div>

    ${
      hasInventoryReward
        ? `
          <div class="talents__joueur-talent-distribution">
            <span data-button="reward"></span>
          </div>
        `
        : ""
    }
  `;
}

// ==========================================================
// BOUTONS
// ==========================================================

// = Créer un bouton.

function createButton(placeholder, config) {
  const button = Button.create(config);

  placeholder.replaceWith(button);

  return button;
}

// = Initialiser les boutons de génération.

function initGenerateButtons() {
  talentsJoueurs.querySelectorAll('[data-button="generate"]').forEach((placeholder) => {
    const category = placeholder.dataset.category;

    const button = createButton(placeholder, {
      text: "Générer aléatoirement",
      variant: "inset",
      size: "sm",
      icon: "fa-solid fa-dice",
      iconPosition: "right",
      feedback: "error",
      errorText: "Aucun objet disponible",
      className: "talents__generer",

      onClick: () => {
        const availableObjects = objetsData[category] || [];

        if (!availableObjects.length) {
          throw new Error("Aucun objet disponible");
        }

        const objet = availableObjects[Math.floor(Math.random() * availableObjects.length)];

        const talentElement = button.closest(".talents__joueur-talent");

        if (!talentElement) {
          throw new Error("Talent introuvable.");
        }

        talentElement.dataset.generatedItem = objet.nom;

        updateInventoryData(talentElement);

        console.log("[INVENTAIRE] Données à distribuer :", talentElement.dataset.inventaire);

        const result = createElement("div", "talents__objet-result");

        result.innerHTML = `
            ${objet.image ? `<img src="${escapeHtml(objet.image)}" alt="">` : ""}
            <span>${escapeHtml(objet.nom)}</span>
          `;

        button.replaceWith(result);
      },
    });
  });
}

// = Initialiser les boutons de dates.

function initDateButtons() {
  talentsJoueurs.querySelectorAll('[data-button="date-submit"]').forEach((placeholder) => {
    const button = createButton(placeholder, {
      text: "Valider la date",
      variant: "inset",
      size: "sm",
      feedback: "both",
      successText: "Date enregistrée !",
      errorText: "Date invalide !",

      onClick: () => {
        // = Récupérer les éléments

        const talentElement = button.closest(".talents__joueur-talent");

        const playerElement = button.closest(".talents__joueur");

        if (!talentElement || !playerElement) {
          console.error("[DATE] Éléments introuvables :", {
            talentElement,
            playerElement,
            button,
          });

          throw new Error("Impossible de retrouver le joueur ou le talent.");
        }

        // = Récupérer la date

        const input = talentElement.querySelector(".talents__joueur-talent-distribution-date-input");

        if (!input || !input.value) {
          input?.reportValidity();

          throw new Error("Date invalide !");
        }

        // = Récupérer les informations

        const joueurId = playerElement.dataset.joueurId;
        const talentName = talentElement.dataset.talent;
        const delai = talentElement.dataset.delai;

        // = Calculer la prochaine distribution

        const prochaineDistribution = getNextDistribution(input.value, delai);

        if (!prochaineDistribution) {
          throw new Error("Impossible de calculer la prochaine date.");
        }

        const nextDateElement = talentElement.querySelector(".talents__joueur-talent-prochaine-date");

        if (nextDateElement) {
          nextDateElement.textContent = formatDate(prochaineDistribution);
        }

        // = Enregistrer la modification

        marquerModification(`${joueurId}::${normalizeName(talentName)}`, {
          joueur_id: joueurId,
          talent: talentName,
          type: "date",
          derniere_distribution: input.value,
        });

        // = Actualiser le statut

        talentElement.dataset.statut = getRewardStatus(input.value, delai);

        talentElement.dataset.dateRecompense = input.value;

        appliquerFiltresJoueurs();
        updateDistributionDates();
      },
    });
  });
}

// = Initialiser les boutons de récompenses.

function initRewardButtons() {
  talentsJoueurs.querySelectorAll('[data-button="reward"]').forEach((placeholder) => {
    const button = createButton(placeholder, {
      text: "Valider la récompense",
      variant: "inset",
      size: "sm",
      feedback: "both",
      successText: "Récompense enregistrée !",
      errorText: "Impossible d'enregistrer la récompense.",
      errorDuration: 2000,

      onClick: async () => {
        // = Récupérer les éléments

        const talentElement = button.closest(".talents__joueur-talent");

        const playerElement = button.closest(".talents__joueur");

        if (!talentElement || !playerElement) {
          throw new Error("Impossible de retrouver le joueur ou le talent.");
        }

        // = Récupérer le joueur

        const joueurId = Number(playerElement.dataset.joueurId);

        const talentName = talentElement.dataset.talent;

        if (!Number.isSafeInteger(joueurId) || joueurId < 1) {
          throw new Error("Identifiant du joueur invalide.");
        }

        if (!talentName) {
          throw new Error("Nom du talent introuvable.");
        }

        // = Récupérer la récompense

        const initialInventory = getInitialInventory(talentName);

        const generatedItem = talentElement.dataset.generatedItem;

        const dropdownValue = talentElement.querySelector(".dropdown__trigger .dropdown__value")?.textContent.trim();

        const objetName = generatedItem || dropdownValue;

        // = Construire l'inventaire

        const inventaire = { ...initialInventory };

        if (objetName && !Object.keys(initialInventory).length) {
          inventaire[objetName] = 1;
        }

        // = Vérifier l'inventaire

        if (!Object.keys(inventaire).length) {
          throw new Error("Génère ou sélectionne un objet avant de valider.");
        }

        console.info("[THEMIS] Récompense à distribuer :", {
          joueurId,
          talentName,
          inventaire,
        });

        // = Se connecter au relais

        await ForumAPI.connect();

        // = Mettre à jour l'inventaire

        const response = await ForumAPI.prepareInventory(joueurId, inventaire);

        const result = response.data;

        if (!result?.submitted || !result?.verified) {
          throw new Error("L'enregistrement de l'inventaire n'a pas pu être vérifié.");
        }

        console.info("[THEMIS] Inventaire mis à jour et vérifié :", result);

        // = Enregistrer la modification Google Sheets

        marquerModification(`${joueurId}::${normalizeName(talentName)}`, {
          joueur_id: String(joueurId),
          talent: talentName,
          type: "item",
          dernier_item: objetName,
        });

        console.info("[THEMIS] Récompense enregistrée :", {
          joueurId,
          talentName,
          objetName,
        });
      },
    });
  });
}
// = Récupérer l'objet sélectionné.
function getSelectedObject(talentElement) {
  const dropdown = talentElement.querySelector(
    ['[data-dropdown="cristal-z"]', '[data-dropdown="mega-gemmes"]', '[data-dropdown="dynamax"]', '[data-dropdown="teracristal"]', '[data-dropdown="ct"]'].join(", "),
  );

  const dropdownValue = dropdown?.querySelector(".dropdown__trigger .dropdown__member span")?.textContent.trim();

  return talentElement.dataset.generatedItem || dropdownValue;
}

// = Actualiser les objets à distribuer.

function updateInventoryData(talentElement) {
  if (!talentElement) return;

  const talentName = talentElement.dataset.talent;

  // = Récupérer les récompenses fixes

  const inventory = getInitialInventory(talentName);

  // = Ne pas ajouter d'objet supplémentaire pour les récompenses fixes

  if (Object.keys(inventory).length) {
    talentElement.dataset.inventaire = JSON.stringify(inventory);
    return;
  }

  // = Récupérer l'objet sélectionné ou généré

  const selectedObject = getSelectedObject(talentElement);

  if (selectedObject) {
    inventory[selectedObject] = 1;
  }

  talentElement.dataset.inventaire = JSON.stringify(inventory);

  console.log("[INVENTAIRE] Récompense actualisée :", {
    talent: talentName,
    inventaire: inventory,
  });
}

// = Récupérer le joueur sélectionné.

function getSelectedPlayer(talentElement) {
  const dropdown = talentElement.querySelector(['[data-dropdown="passeur"]', '[data-dropdown="mentor"]', '[data-dropdown="transmission"]'].join(", "));

  return dropdown?.querySelector(".dropdown__trigger .dropdown__member span")?.textContent.trim();
}

// ==========================================================
// ACCORDÉON DES JOUEURS
// ==========================================================

function initAccordeon() {
  if (!talentsJoueurs) return;

  talentsJoueurs.addEventListener("click", (event) => {
    const button = event.target.closest(".talents__joueur-toggle");

    if (!button || !talentsJoueurs.contains(button)) return;

    const card = button.closest(".talents__joueur");

    const details = card?.querySelector(".talents__joueur-details");

    if (!card || !details) return;

    const isOpen = card.classList.toggle("is-open");

    button.setAttribute("aria-expanded", String(isOpen));

    details.setAttribute("aria-hidden", String(!isOpen));

    details.inert = !isOpen;
  });
}

// ==========================================================
// FILTRES
// ==========================================================

// = Appliquer tous les filtres.

function appliquerFiltresJoueurs() {
  if (!talentsJoueurs) return;

  const dateDebut = parseDate(datesSelectionnees.start);
  const dateFin = parseDate(datesSelectionnees.end);

  talentsJoueurs.querySelectorAll(".talents__joueur").forEach((joueur) => {
    const joueurId = String(joueur.dataset.joueurId);

    const correspondJoueur = !joueursSelectionnes.length || joueursSelectionnes.some((id) => String(id) === joueurId);

    let aUnTalentVisible = false;

    joueur.querySelectorAll(".talents__joueur-talent").forEach((talent) => {
      const correspondTalent = !talentsSelectionnes.length || talentsSelectionnes.includes(talent.dataset.talent);

      const dateRecompense = parseDate(talent.dataset.dateRecompense);

      const correspondDate = matchDateFilter(dateRecompense, dateDebut, dateFin);

      const visible = correspondTalent && correspondDate;

      talent.hidden = !visible;

      if (visible) {
        aUnTalentVisible = true;
      }
    });

    joueur.hidden = !correspondJoueur || !aUnTalentVisible;
  });
}

// = Vérifier la correspondance avec le filtre de dates.

function matchDateFilter(date, start, end) {
  if (!start) return true;

  if (!date) return false;

  switch (datesSelectionnees.mode) {
    case "avant":
      return date < start;

    case "apres":
      return date > start;

    case "entre":
      return !!end && date >= start && date <= end;

    default:
      return true;
  }
}

// = Initialiser le filtre de dates.

function initFiltreDates() {
  DateFilter.create({
    container: "#filtre-dates",

    onChange: (selection) => {
      datesSelectionnees = selection;
      appliquerFiltresJoueurs();
    },
  });
}

// = Initialiser le filtre des joueurs.

async function initDropdownJoueurs(members) {
  await Dropdown.create({
    container: "#dropdown-joueurs",
    options: members,

    type: "filter",
    mode: "multiple",

    valueKey: "id",
    labelKey: "pseudo",
    searchKeys: ["pseudo"],

    placeholder: "Filtrer les joueurs",
    searchPlaceholder: "Rechercher un joueur...",

    renderOption: (member) =>
      renderMemberOption(member, {
        imageKey: "avatar",
        labelKey: "pseudo",
      }),

    onChange: (selectedIds) => {
      joueursSelectionnes = selectedIds;
      appliquerFiltresJoueurs();
    },
  });
}

// = Initialiser le filtre des talents.

function initDropdownFiltreTalents() {
  const container = document.querySelector("#dropdown-talents");

  if (!container) return;

  const talents = [...new Set([...document.querySelectorAll(".talents__joueur-talent[data-talent]")].map((element) => element.dataset.talent).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );

  Dropdown.create({
    container,

    options: talents.map((nom) => ({ nom })),

    type: "filter",
    mode: "multiple",

    valueKey: "nom",
    labelKey: "nom",
    searchKeys: ["nom"],

    onChange: (selectedTalents) => {
      talentsSelectionnes = selectedTalents;
      appliquerFiltresJoueurs();
    },
  });
}

// ==========================================================
// DROPDOWNS DES OBJETS
// ==========================================================

// = Initialiser un dropdown d'objets.

async function initDropdownObjets(objetsData) {
  await Promise.all(
    DROPDOWNS_OBJETS.map(async ({ categorie, type, placeholder }) => {
      const options = Array.isArray(objetsData?.[categorie]) ? objetsData[categorie] : [];

      const dropdowns = document.querySelectorAll(`[data-dropdown="${type}"]`);

      await Promise.all(
        [...dropdowns].map((dropdown) =>
          Dropdown.create({
            container: `#${dropdown.id}`,
            options,

            type: "filter",
            mode: "single",

            valueKey: "nom",
            labelKey: "nom",
            searchKeys: ["nom"],

            placeholder,
            searchPlaceholder: `Rechercher ${placeholder.toLowerCase()}...`,

            renderOption: (objet) =>
              renderMemberOption(objet, {
                imageKey: "image",
                labelKey: "nom",
              }),

            renderValue: (objet) =>
              renderMemberOption(objet, {
                imageKey: "image",
                labelKey: "nom",
              }),

            onChange: () => {
              const talentElement = dropdown.closest(".talents__joueur-talent");

              updateInventoryData(talentElement);
            },
          }),
        ),
      );
    }),
  );
}

// ==========================================================
// DROPDOWNS DES JOUEURS
// ==========================================================

// = Initialiser les dropdowns de joueurs.

async function initDropdownTalents(members) {
  await Promise.all(
    Object.entries(DROPDOWNS_JOUEURS).map(async ([type, placeholder]) => {
      const dropdowns = document.querySelectorAll(`[data-dropdown="${normalizeName(type)}"]`);

      await Promise.all(
        [...dropdowns].map((dropdown) => {
          const joueurId = dropdown.closest(".talents__joueur")?.dataset.joueurId;

          const options = members.filter((member) => String(member.id) !== String(joueurId));

          return Dropdown.create({
            container: `#${dropdown.id}`,
            options,

            type: "filter",
            mode: "single",

            valueKey: "id",
            labelKey: "pseudo",
            searchKeys: ["pseudo"],

            placeholder,
            searchPlaceholder: "Rechercher un joueur...",

            renderOption: (member) =>
              renderMemberOption(member, {
                imageKey: "avatar",
                labelKey: "pseudo",
              }),

            renderValue: (member) =>
              renderMemberOption(member, {
                imageKey: "avatar",
                labelKey: "pseudo",
              }),
          });
        }),
      );
    }),
  );
}

// ==========================================================
// SYNCHRONISATION GOOGLE SHEETS
// ==========================================================

// = Initialiser le bouton de synchronisation.

function initSynchronisationButton() {
  const placeholder = document.querySelector("#synchroniser-sheets");

  if (!placeholder) return;

  synchroniserButton = createButton(placeholder, {
    text: "Synchroniser Google Sheets",
    variant: "content",
    size: "md",
    icon: "fa-solid fa-rotate",
    iconPosition: "right",
    feedback: "both",
    successText: "Synchronisation terminée !",
    errorText: "Synchronisation impossible.",
    className: "talents__synchroniser",

    onClick: () => {
      if (!modificationsEnAttente.size) {
        synchroniserMessage.textContent = "Aucune modification à synchroniser.";

        throw new Error("Aucune modification à synchroniser.");
      }

      synchroniserMessage.textContent = "Synchronisation en cours...";

      const payload = {
        requestId: String(Date.now()),
        modifications: [...modificationsEnAttente.values()],
      };

      synchronisationEnCours = payload.requestId;

      synchroniserPayload.value = JSON.stringify(payload);

      synchroniserForm.submit();
    },
  });
}

// = Créer le formulaire d'envoi.

function createSynchronisationForm() {
  const form = document.createElement("form");

  form.method = "POST";
  form.action = URLS.googleSheets;
  form.target = "synchroniser-frame";
  form.hidden = true;

  const payload = document.createElement("input");

  payload.type = "hidden";
  payload.name = "payload";

  form.appendChild(payload);
  document.body.appendChild(form);

  return {
    form,
    payload,
  };
}

const { form: synchroniserForm, payload: synchroniserPayload } = createSynchronisationForm();

// = Synchroniser les modifications.

function initSynchronisation() {
  if (!synchroniserButton) return;

  synchroniserButton.addEventListener("click", () => {
    if (!modificationsEnAttente.size) {
      synchroniserMessage.textContent = "Aucune modification à synchroniser.";

      return;
    }

    synchroniserButton.disabled = true;

    synchroniserMessage.textContent = "Synchronisation en cours...";

    const payload = {
      requestId: String(Date.now()),
      modifications: [...modificationsEnAttente.values()],
    };

    synchronisationEnCours = payload.requestId;

    synchroniserPayload.value = JSON.stringify(payload);

    synchroniserForm.submit();
  });
}

// = Recevoir la confirmation.

function initSynchronisationResponse() {
  window.addEventListener("message", (event) => {
    if (event.origin !== "https://sixtinerpg.github.io") {
      return;
    }

    const response = event.data;

    if (!response || typeof response !== "object" || !synchronisationEnCours) {
      return;
    }

    if (response.requestId && response.requestId !== synchronisationEnCours) {
      return;
    }

    synchronisationEnCours = null;

    if (response.success) {
      modificationsEnAttente.clear();

      actualiserCompteur();

      synchroniserMessage.textContent = "Synchronisation terminée !";

      synchroniserMessage.dataset.status = "success";
    } else {
      synchroniserMessage.textContent = `Erreur : ${response.message || "Synchronisation impossible."}`;

      synchroniserMessage.dataset.status = "error";
    }

    synchroniserButton.disabled = false;
  });
}

// ==========================================================
// INITIALISATION
// ==========================================================

async function initTalents() {
  try {
    const [talentsData, membersData, objets, distributionsData] = await Promise.all([fetchJson(URLS.talents), fetchJson(URLS.members), fetchJson(URLS.objets), fetchJson(URLS.distributions)]);

    const talents = Array.isArray(talentsData) ? talentsData : talentsData.talents;

    const members = Array.isArray(membersData) ? membersData : membersData.members;

    const distributions = Array.isArray(distributionsData) ? distributionsData : [];

    objetsData = objets;

    // Rendu.

    renderTalents(talents);

    renderTalentsJoueurs(members, talents, distributions);

    // Filtres.

    await initDropdownJoueurs(members);

    initDropdownFiltreTalents();
    initFiltreDates();

    // Dropdowns.

    await initDropdownObjets(objetsData);
    await initDropdownTalents(members);

    // Interactions.

    initAccordeon();

    initSynchronisationButton();
    initSynchronisationResponse();
  } catch (error) {
    console.error("[Talents]", error);
  }
}

initTalents();

// ==========================================================
// TEST — RELAIS FORUMACTIF
// ==========================================================

async function testRelay() {
  try {
    await ForumAPI.connect();

    // = Test de connexion

    const ping = await ForumAPI.ping();

    console.log("[TEST] Connexion au relais :", ping);

    // = Test d'authentification

    const auth = await ForumAPI.checkAuth();

    console.log("[TEST AUTH] Résultat :", auth);
    console.log("[TEST AUTH] Administrateur :", auth.data);
  } catch (error) {
    console.error("[TEST] Échec :", error);
  }
}

// ==========================================================
// TEST — PREVISUALISATION INVENTAIRE
// ==========================================================

async function testInventoryPreview() {
  try {
    await ForumAPI.connect();

    const result = await ForumAPI.previewInventory(6, {
      "Poké Ball": 4,
      "Pierre Soleil": 1,
    });

    console.log("[STRUCTURE BOUTONS]", JSON.stringify(result.data.formDiagnostic.buttons, null, 2));

    // = Diagnostic du formulaire

    const diagnostic = result.data.formDiagnostic;

    console.log("[DIAGNOSTIC FORMULAIRE]", {
      found: diagnostic.found,

      action: diagnostic.action ? new URL(diagnostic.action, "https://war-of-the-gods.forumactif.com").pathname : null,

      method: diagnostic.method,
      enctype: diagnostic.enctype,
      id: diagnostic.id,
      name: diagnostic.name,

      inventoryField: diagnostic.inventoryField,
      fields: diagnostic.fields,
      hiddenFields: diagnostic.hiddenFields,
      buttons: diagnostic.buttons,

      saveButton: diagnostic.saveButton
        ? {
            index: diagnostic.saveButton.index,
            name: diagnostic.saveButton.name,
            value: diagnostic.saveButton.value,
            className: diagnostic.saveButton.className,
            disabled: diagnostic.saveButton.disabled,
            formNoValidate: diagnostic.saveButton.formNoValidate,
          }
        : null,
    });

    console.log("[CLÉS DU DIAGNOSTIC]", Object.keys(result.data.formDiagnostic));

    console.log("[DIAGNOSTIC COMPLET]", JSON.stringify(result.data.formDiagnostic, null, 2));

    console.log("[LIGNE INVENTAIRE]", result.data.formDiagnostic.inventoryRowHTML);

    console.log("[ATTRIBUTS FORMULAIRE]", result.data.formDiagnostic.formAttributes);

    console.log("[DETAILS BOUTONS]", result.data.formDiagnostic.buttonDetails);

    // = Position des lignes

    console.log("[POSITION DES LIGNES]", result.data.formDiagnostic.rowDiagnostic);

    // = Résultat de la prévisualisation

    console.log("[TEST INVENTAIRE] Prévisualisation :", result);
    console.table(result.data.changes);
  } catch (error) {
    console.error("[TEST INVENTAIRE] Erreur :", error);
  }
}

// ==========================================================
// TEST — PREPARATION INVENTAIRE
// ==========================================================

async function testInventoryPreparation() {
  try {
    // = Connexion au relais

    await ForumAPI.connect();

    // = Préparation de la mise à jour

    const result = await ForumAPI.prepareInventory(6, {
      "Poké Ball": 4,
      "Pierre Soleil": 1,
    });

    console.log("[TEST INVENTAIRE] Préparation :", result);

    console.table(result.data.changes);

    console.log("[TEST INVENTAIRE] Préparé :", result.data.prepared);

    console.log("[TEST INVENTAIRE] Enregistré :", result.data.submitted);
  } catch (error) {
    console.error("[TEST INVENTAIRE] Erreur de préparation :", error);
  }
}

// ==========================================================
// TESTS — BOUTONS
// ==========================================================

const testRelayButton = document.createElement("button");

testRelayButton.type = "button";
testRelayButton.textContent = "Tester le relais Themis";
testRelayButton.addEventListener("click", testRelay);

document.body.appendChild(testRelayButton);

// = Inventaire

const testInventoryButton = document.createElement("button");

testInventoryButton.type = "button";
testInventoryButton.textContent = "Tester la prévisualisation inventaire";
testInventoryButton.addEventListener("click", testInventoryPreview);

document.body.appendChild(testInventoryButton);
// = Préparation inventaire

const testInventoryPreparationButton = document.createElement("button");

testInventoryPreparationButton.type = "button";

testInventoryPreparationButton.textContent = "Tester la préparation inventaire";

testInventoryPreparationButton.addEventListener("click", testInventoryPreparation);

document.body.appendChild(testInventoryPreparationButton);
