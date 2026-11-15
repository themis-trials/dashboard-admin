export const Button = {
  // ==========================================================
  // CONFIGURATION PAR DÉFAUT
  // ==========================================================

  defaults: {
    text: "",
    variant: "primary",
    size: "md",
    icon: null,
    iconPosition: "left",
    animation: null,
    disabled: false,
    className: "",
    type: "button",
    ariaLabel: "Action",
    onClick: null,

    // = Action feedback.
    feedback: null,

    // = Feedback succès.
    successText: null,
    successIcon: "fa-solid fa-check",

    // = Feedback erreur.
    errorText: null,
    errorIcon: "fa-solid fa-xmark",
    errorDuration: 3000,
  },

  // ==========================================================
  // CRÉATION DU BOUTON
  // ==========================================================

  create(options = {}) {
    const settings = {
      ...this.defaults,
      ...options,
    };

    const button = document.createElement("button");

    button.type = settings.type;
    button.className = ["button", `button--${settings.variant}`, `button--${settings.size}`, settings.animation ? `button--${settings.animation}` : "", settings.className].filter(Boolean).join(" ");

    button.disabled = settings.disabled;

    // ========================================================
    // CONFIGURATION DES FEEDBACKS
    // ========================================================

    const feedbackTypes = {
      success: {
        text: settings.successText,
        icon: settings.successIcon,
      },

      error: {
        text: settings.errorText,
        icon: settings.errorIcon,
      },
    };

    const feedbacks = settings.feedback === "both" ? ["success", "error"] : settings.feedback && feedbackTypes[settings.feedback] ? [settings.feedback] : [];

    const hasFeedback = feedbacks.length > 0;

    if (hasFeedback) {
      button.classList.add(`button--feedback-${settings.feedback}`);
    }

    // ========================================================
    // TRACK
    // ========================================================

    const track = document.createElement("div");
    track.className = "button__track";

    // ========================================================
    // CONTENU PRINCIPAL
    // ========================================================

    const content = document.createElement("div");
    content.className = "button__content";

    const text = document.createElement("div");
    text.className = "button__text";
    text.textContent = settings.text;

    if (settings.icon && settings.iconPosition === "left") {
      content.append(this.createIcon(settings.icon));
    }

    content.append(text);

    if (settings.icon && settings.iconPosition === "right") {
      content.append(this.createIcon(settings.icon));
    }

    // ========================================================
    // CONTENU DES FEEDBACKS
    // ========================================================

    if (hasFeedback) {
      // = Création du rail.
      const track = document.createElement("div");
      track.className = "button__track";

      feedbacks.forEach((type) => {
        const feedback = feedbackTypes[type];

        const feedbackContent = document.createElement("div");

        feedbackContent.className = `button__feedback button__feedback--${type}`;
        feedbackContent.dataset.feedback = type;

        if (feedback.icon) {
          feedbackContent.append(this.createIcon(feedback.icon));
        }

        if (feedback.text) {
          const feedbackText = document.createElement("div");

          feedbackText.className = "button__feedback-text";
          feedbackText.textContent = feedback.text;

          feedbackContent.append(feedbackText);
        }

        track.append(feedbackContent);
      });

      // = Ajout du contenu principal au rail.
      track.append(content);

      button.append(track);
    } else {
      // = Bouton classique, sans rail.
      button.append(content);
    }

    // ========================================================
    // BOUTON ICON-ONLY
    // ========================================================

    if (!settings.text && settings.icon) {
      button.setAttribute("aria-label", settings.ariaLabel);
      button.classList.add("button--icon-only");
    }

    // ========================================================
    // GESTION AUTOMATIQUE DES ACTIONS
    // ========================================================

    if (typeof settings.onClick === "function") {
      button.addEventListener("click", async (event) => {
        if (button.disabled) return;

        button.disabled = true;

        // = Annule un éventuel reset d'erreur précédent.
        clearTimeout(button.errorTimeout);

        try {
          const result = await settings.onClick(event);

          // = Résultat invalide.
          if (result === false) {
            if (hasFeedback && feedbackTypes.error) {
              this.setError(button, settings.errorText, settings.errorDuration);
            } else {
              button.disabled = false;
            }

            return;
          }

          // = Feedback succès.
          if (settings.feedback === "success" || settings.feedback === "both") {
            this.setSuccess(button);
          } else {
            button.disabled = false;
          }
        } catch (error) {
          console.error("[Button]", error);

          // = Feedback erreur.
          if (settings.feedback === "both" || settings.feedback === "error") {
            this.setError(button, error.message || settings.errorText, settings.errorDuration);
          } else {
            button.disabled = false;
          }
        }
      });
    }

    return button;
  },

  // ==========================================================
  // GESTION DES FEEDBACKS
  // ==========================================================

  setSuccess(button) {
    this.setFeedback(button, "success");
  },

  setError(button, message = null, duration = 3000) {
    this.setFeedback(button, "error", message);

    // = Retour à l'état initial après le délai.
    if (duration > 0) {
      clearTimeout(button.errorTimeout);

      button.errorTimeout = setTimeout(() => {
        button.classList.remove("is-error");
        button.disabled = false;
      }, duration);
    }
  },

  setFeedback(button, type, message = null) {
    const feedback = button.querySelector(`[data-feedback="${type}"]`);

    if (!feedback) return;

    // = Mise à jour du message.
    if (message) {
      const feedbackText = feedback.querySelector(".button__feedback-text");

      if (feedbackText) {
        feedbackText.textContent = message;
      }
    }

    // = Mise à jour de l'état.
    button.classList.remove("is-success", "is-error");
    button.classList.add(`is-${type}`);

    button.disabled = true;
  },

  // ==========================================================
  // CRÉATION DES ICÔNES
  // ==========================================================

  createIcon(iconClass) {
    const icon = document.createElement("i");

    icon.className = `button__icon ${iconClass}`;
    icon.setAttribute("aria-hidden", "true");

    return icon;
  },
};
