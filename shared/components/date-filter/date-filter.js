export const DateFilter = {
  create({ container, onChange = () => {} }) {
    const root = typeof container === "string" ? document.querySelector(container) : container;

    if (!root) return;

    let mode = "avant";
    let dateDebut = null;
    let dateFin = null;

    const today = new Date();
    let moisAffiche = new Date(today.getFullYear(), today.getMonth(), 1);

    const moisNoms = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    const joursNoms = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

    function toISO(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    function fromISO(value) {
      if (!value) return null;

      const [year, month, day] = value.split("-").map(Number);

      return new Date(year, month - 1, day);
    }

    function formatDate(value) {
      const date = fromISO(value);

      return date
        ? date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "Choisir une date";
    }

    function notify() {
      onChange({
        mode,
        start: dateDebut,
        end: dateFin,
      });
    }

    function getDateClass(value) {
      const classes = [];

      if (mode !== "entre") {
        if (value === dateDebut) classes.push("is-selected");
        return classes.join(" ");
      }

      if (value === dateDebut) classes.push("is-start");
      if (value === dateFin) classes.push("is-end");

      if (dateDebut && dateFin && value > dateDebut && value < dateFin) {
        classes.push("is-in-range");
      }

      return classes.join(" ");
    }

    function renderMonth(offset = 0) {
      const date = new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() + offset, 1);

      const year = date.getFullYear();
      const month = date.getMonth();

      const firstDay = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Le calendrier commence le lundi.
      const offsetDays = (firstDay.getDay() + 6) % 7;

      let days = "";

      for (let i = 0; i < offsetDays; i++) {
        days += `<span class="date-filter__empty"></span>`;
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const value = toISO(new Date(year, month, day));
        const classes = getDateClass(value);
        const isToday = value === toISO(today);

        days += `
          <button
            class="date-filter__day ${classes} ${isToday ? "is-today" : ""}"
            type="button"
            data-date="${value}"
            aria-label="${day} ${moisNoms[month]} ${year}"
          >
            ${day}
          </button>
        `;
      }

      return `
        <div class="date-filter__month">
          <h4 class="date-filter__month-title">
            ${moisNoms[month]} ${year}
          </h4>

          <div class="date-filter__weekdays">
            ${joursNoms.map((day) => `<span>${day}</span>`).join("")}
          </div>

          <div class="date-filter__days">
            ${days}
          </div>
        </div>
      `;
    }

    function render() {
      const isRange = mode === "entre";

      root.innerHTML = `
        <div class="date-filter">

          <div class="date-filter__toggle" role="group" aria-label="Type de filtre">

            <span class="date-filter__toggle-indicator" data-mode="${mode}"></span>

            <button
              class="date-filter__mode ${mode === "avant" ? "is-active" : ""}"
              type="button"
              data-mode="avant"
              aria-pressed="${mode === "avant"}"
            >
              Avant le
            </button>

            <button
              class="date-filter__mode ${mode === "apres" ? "is-active" : ""}"
              type="button"
              data-mode="apres"
              aria-pressed="${mode === "apres"}"
            >
              Après le
            </button>

            <button
              class="date-filter__mode ${isRange ? "is-active" : ""}"
              type="button"
              data-mode="entre"
              aria-pressed="${isRange}"
            >
              Entre deux dates
            </button>

          </div>

          <div class="date-filter__selection">

            <div class="date-filter__selection-item">
              <span>${isRange ? "Du" : mode === "avant" ? "Avant le" : "Après le"}</span>
              <strong>${formatDate(dateDebut)}</strong>
            </div>

            ${
              isRange
                ? `
                  <div class="date-filter__selection-item">
                    <span>Au</span>
                    <strong>${formatDate(dateFin)}</strong>
                  </div>
                `
                : ""
            }

          </div>

          <div class="date-filter__calendar">

            <div class="date-filter__navigation">
              <button type="button" data-nav="-1" aria-label="Mois précédent">
                <i class="fa-solid fa-chevron-left"></i>
              </button>

              <button type="button" data-nav="1" aria-label="Mois suivant">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div class="date-filter__months ${isRange ? "is-range" : ""}">
              ${renderMonth(0)}
              ${isRange ? renderMonth(1) : ""}
            </div>

          </div>

          <button class="date-filter__reset" type="button">
            Réinitialiser les dates
          </button>

        </div>
      `;
    }

    root.addEventListener("click", (event) => {
      const modeButton = event.target.closest("[data-mode]");
      const dateButton = event.target.closest("[data-date]");
      const navButton = event.target.closest("[data-nav]");
      const resetButton = event.target.closest(".date-filter__reset");

      if (modeButton) {
        mode = modeButton.dataset.mode;
        dateDebut = null;
        dateFin = null;

        render();
        notify();
        return;
      }

      if (navButton) {
        moisAffiche.setMonth(moisAffiche.getMonth() + Number(navButton.dataset.nav));

        render();
        return;
      }

      if (dateButton) {
        const selectedDate = dateButton.dataset.date;

        if (mode !== "entre") {
          dateDebut = selectedDate;
          dateFin = null;
        } else if (!dateDebut || dateFin) {
          dateDebut = selectedDate;
          dateFin = null;
        } else {
          dateFin = selectedDate;

          // Si la deuxième date est antérieure, on inverse les bornes.
          if (dateFin < dateDebut) {
            [dateDebut, dateFin] = [dateFin, dateDebut];
          }
        }

        render();
        notify();
        return;
      }

      if (resetButton) {
        dateDebut = null;
        dateFin = null;

        render();
        notify();
      }
    });

    render();
    notify();

    return {
      reset() {
        dateDebut = null;
        dateFin = null;
        render();
        notify();
      },
    };
  },
};
