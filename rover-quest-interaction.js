AFRAME.registerComponent('rover-quest-interaction', {
  init: function () {
    this.requiredItems = {
      wheel: 4,
      panel: 2,
      tools: 1,
      cables: 1
    };
    this.collectedItems = {
      wheel: 0,
      panel: 0,
      tools: 0,
      cables: 0
    };

    this.clickedOnce = false;
    this.completed = false;
    this.roverEl = this.el;
    this.roverLight = this.roverEl.querySelector('#rover-repaired-light');
    this.messageDisplayEl = document.querySelector('#quest-message-display');
    this.messageTextEl = document.querySelector('#quest-message-text');
    this.hideTimeout = null;

    // Recolectar objetos (solo contabiliza, no muestra mensaje)
    const collectibles = document.querySelectorAll('.collectible');
    collectibles.forEach((item) => {
      item.addEventListener('click', () => {
        const type = item.dataset.itemType?.toLowerCase();
        if (type) {
          if (type.includes('rueda')) this.collectedItems.wheel++;
          else if (type.includes('panel')) this.collectedItems.panel++;
          else if (type.includes('herramienta')) this.collectedItems.tools++;
          else if (type.includes('cables')) this.collectedItems.cables++;
        }
      });
    });

    // Clic sobre el Rover
    this.onRoverClick = this.onRoverClick.bind(this);
    this.roverEl.addEventListener('click', this.onRoverClick);
  },

  onRoverClick: function () {
    if (this.completed) {
      console.log('[RoverQuest] Ya completado. Ignorando clic.');
      return;
    }

    if (!this.clickedOnce) {
      this.showMessage('Para la reparación busca:\n4 ruedas\n2 paneles solares\n1 set de herramientas\n1 cables.');
      this.clickedOnce = true;
    } else {
      if (this.checkCompletion()) {
        this.completed = true;
        this.showMessage('¡Rover reparado con exito!', 10000);

        if (this.roverLight) {
          this.roverLight.setAttribute('visible', true);
          this.roverLight.setAttribute('animation', {
            property: 'light.intensity',
            from: 0,
            to: 3,
            dur: 600,
            easing: 'easeInOutQuad'
          });
        }

        // Reproducir audio de éxito
        const roverAudio = this.roverEl.components['sound__success'];
        if (roverAudio && roverAudio.playSound) {
          roverAudio.playSound();
        } else {
          console.warn('[Rover Quest] No se encontró el componente de sonido del Rover.');
        }

        // Opcional: desactivar clic
        this.roverEl.removeEventListener('click', this.onRoverClick);
        this.roverEl.removeAttribute('clickable');
        this.roverEl.classList.remove('clickable');
      } else {
        this.showMessage('Aún faltan piezas para completar la reparación.');
      }
    }
  },

  checkCompletion: function () {
    for (let key in this.requiredItems) {
      if (this.collectedItems[key] < this.requiredItems[key]) {
        return false;
      }
    }
    return true;
  },

  showMessage: function (msg, duration = 6000) {
    if (!this.messageTextEl || !this.messageDisplayEl) return;
    this.messageTextEl.setAttribute('text', 'value', msg);
    this.messageDisplayEl.setAttribute('visible', true);

    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.messageDisplayEl.setAttribute('visible', false);
    }, duration);
  }
});

