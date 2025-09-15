AFRAME.registerComponent('simple-rover-interaction', {
  init: function () {
    this.roverEl = this.el;
    this.clickedOnce = false;
    this.finalMessageShown = false;
    this.messageDisplayEl = null;
    this.messageTextEl = null;
    this.roverLight = null;
    this.feedbackTimeout = null;

    this.requiredItems = [
      'Rueda delantera derecha',
      'Rueda delantera izquierda',
      'Rueda trasera derecha',
      'Rueda trasera izquierda',
      'Panel solar',
      'Panel solar 2',
      'Set de herramientas',
      'Cables'
    ];

    this.onClick = this.onClick.bind(this);
    this.showFeedback = this.showFeedback.bind(this);
    this.finishInitialization = this.finishInitialization.bind(this);

    if (this.el.sceneEl && this.el.sceneEl.hasLoaded) {
      this.finishInitialization();
    } else if (this.el.sceneEl) {
      this.el.sceneEl.addEventListener('loaded', this.finishInitialization, { once: true });
    } else {
      console.error("[Simple Rover] SceneEl not found on init.");
    }
  },

  finishInitialization: function () {
    this.messageDisplayEl = document.querySelector('#quest-message-display');
    this.messageTextEl = document.querySelector('#quest-message-text');
    this.roverLight = document.querySelector('#rover-repaired-light');

    if (!this.messageDisplayEl || !this.messageTextEl) {
      console.error("[Simple Rover] Quest Message HUD missing!");
    }
    if (!this.roverLight) {
      console.warn("[Simple Rover] Rover light element (#rover-repaired-light) missing!");
    }

    if (!this.roverEl.classList.contains('clickable')) {
      this.roverEl.classList.add('clickable');
    }
    if (!this.roverEl.hasAttribute('clickable')) {
      this.roverEl.setAttribute('clickable', '');
    }
    this.roverEl.addEventListener('click', this.onClick);
  },

  onClick: function () {
    if (this.finalMessageShown) return;

    if (!this.clickedOnce) {
      this.showFeedback("Para reparar el Rover necesitas:\n4 ruedas, 2 paneles solares, 1 set de herramientas y 1 cable.", 12000);
      this.clickedOnce = true;
    } else {
      const allCollected = this.requiredItems.every(id => {
        const item = document.getElementById(id);
        return item && item.getAttribute('visible') === false;
      });

      if (!allCollected) {
        this.showFeedback("Te queda alguna pieza por recoger...", 5000);
        return;
      }

      // Activar luz y mostrar mensaje final
      if (this.roverLight) {
        this.roverLight.setAttribute('visible', 'true');
        this.roverLight.setAttribute('animation', {
          property: 'light.intensity',
          from: 0,
          to: 20,
          dur: 20000,
          easing: 'linear'
        });
      }

      this.showFeedback("¡Rover reparado!\n¡Has completado la mision!\n\n\nLA DEMO DE MOONSHAKES FINALIZA AQUI (aunque aun puedes seguir explorando la Luna)", 80000);
      this.finalMessageShown = true;
      this.roverEl.removeEventListener('click', this.onClick);
      this.roverEl.removeAttribute('clickable');
      this.roverEl.removeAttribute('rover-quest-interaction'); // 👈 Añade esta línea

    }
  },

  showFeedback: function (message, duration = 50000) {
    this.messageDisplayEl = document.querySelector('#quest-message-display');
    this.messageTextEl = document.querySelector('#quest-message-text');

    if (this.messageTextEl && this.messageDisplayEl) {
      this.messageTextEl.setAttribute('text', 'value', message);
      this.messageDisplayEl.setAttribute('visible', 'true');
      if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = setTimeout(() => {
        this.messageDisplayEl.setAttribute('visible', 'false');
      }, duration);
    } else {
      console.warn(`[Simple Rover] No HUD found to display: ${message}`);
    }
  },

  remove: function () {
    if (this.roverEl) this.roverEl.removeEventListener('click', this.onClick);
    if (this.el.sceneEl) this.el.sceneEl.removeEventListener('loaded', this.finishInitialization);
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
  }
});

