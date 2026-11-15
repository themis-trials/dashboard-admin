// ==========================================================
// ANIMATIONS DES BOUTONS
// ==========================================================

window.Buttons = (() => {
  // = Configuration.
  const ANIMATION_DURATION = 500;

  // = Stockage des contenus initiaux.
  const originalContents = new WeakMap();

  // ==========================================================
  // STRUCTURE
  // ==========================================================

  function createStructure(button) {
    if (originalContents.has(button)) return;

    const originalHTML = button.innerHTML;

    originalContents.set(button, originalHTML);

    button.innerHTML = `
      <span class="button__content">${originalHTML}</span>
      <span class="button__message" aria-hidden="true"></span>
    `;
  }

  // ==========================================================
  // TRANSITION
  // ==========================================================

  function transition(button, type, message) {
    if (!button) return;

    createStructure(button);

    const content = button.querySelector(".button__content");
    const messageLabel = button.querySelector(".button__message");

    messageLabel.textContent = message;

    content.setAttribute("aria-hidden", "true");
    messageLabel.setAttribute("aria-hidden", "false");

    button.classList.remove("is-success", "is-error");

    requestAnimationFrame(() => {
      button.classList.add(`is-${type}`);
    });
  }

  // ==========================================================
  // SUCCESS
  // ==========================================================

  function success(button, message = "Succès !") {
    transition(button, "success", message);
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  function error(button, message = "Erreur !") {
    transition(button, "error", message);
  }

  // ==========================================================
  // RESET
  // ==========================================================

  function reset(button) {
    if (!button || !originalContents.has(button)) return;

    button.classList.remove("is-success", "is-error");

    const content = button.querySelector(".button__content");
    const message = button.querySelector(".button__message");

    content?.setAttribute("aria-hidden", "false");
    message?.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      if (button.classList.contains("is-success") || button.classList.contains("is-error")) return;

      button.innerHTML = originalContents.get(button);
      originalContents.delete(button);
    }, ANIMATION_DURATION);
  }

  // ==========================================================
  // PUBLIC API
  // ==========================================================

  return {
    success,
    error,
    reset,
  };
})();

// ==========================================================
// INITIALISATION AUTOMATIQUE
// ==========================================================

document.querySelectorAll("[data-button-state]").forEach((button) => {
  button.addEventListener("click", () => {
    const state = button.dataset.buttonState;
    const message = button.dataset.buttonMessage;

    if (state === "success") {
      Buttons.success(button, message);
    }

    if (state === "error") {
      Buttons.error(button, message);
    }
  });
});
