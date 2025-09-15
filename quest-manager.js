
/**
 * quest-manager.js (v. Simplificada - Clic en Item -> Mensaje + Toggle H)
 */
AFRAME.registerComponent('quest-manager', {
  init: function () {
    console.log("[Quest Manager] Initializing (Simple Feedback Version)...");
    // Referencias HUD
    this.questMessageDisplayEl = document.querySelector('#quest-message-display');
    this.questMessageTextEl = document.querySelector('#quest-message-text');
    this.hudControlsDisplay = document.querySelector('#hud-controls-display');
    this.feedbackTimeout = null; // Para ocultar mensaje

    // Verificar HUDs
    if (!this.questMessageDisplayEl || !this.questMessageTextEl) { console.error("[QM Init] Quest Message HUD missing."); }
    if (!this.hudControlsDisplay) { console.warn("[QM Init] Controls HUD missing."); } else { console.log("[QM Init] Controls HUD found."); }

    // Bindear funciones
    this.onItemClicked = this.onItemClicked.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.attachItemListeners = this.attachItemListeners.bind(this);

    // Listener de teclado para 'H'
    window.addEventListener('keydown', this.onKeyDown);
    console.log("[Quest Manager] Keyboard listener for 'H' added.");

    // Esperar a que la escena cargue para añadir listeners a items
    if (this.el.sceneEl.hasLoaded) { this.attachItemListeners(); }
    else { this.el.sceneEl.addEventListener('loaded', this.attachItemListeners, { once: true }); }
    console.log("[Quest Manager] Initialized.");
  },

  // Adjuntar listeners directamente a los items después de cargar
  attachItemListeners: function() {
    const collectibles = document.querySelectorAll('.collectible');
    console.log(`[Quest Manager] attachItemListeners called. Found ${collectibles.length} collectibles.`);
    if (collectibles.length === 0) { console.warn("[Quest Manager] No collectible items found!"); return; }
    collectibles.forEach(item => {
      const itemId = item.id || item.dataset.itemType || 'unknown_item';
      item.removeEventListener('click', this.onItemClicked); // Limpiar por si acaso
      item.addEventListener('click', this.onItemClicked);   // Añadir listener
      console.log(`[Quest Manager] Added click listener to collectible: ${itemId}`);
    });
    console.log("[Quest Manager] Finished attaching item listeners.");
  },

  // Manejar tecla H
  onKeyDown: function (e) {
      if (e.code === 'KeyH') {
        console.log("[QM onKeyDown] H detected.");
        if (this.hudControlsDisplay) { const isVisible = this.hudControlsDisplay.getAttribute('visible'); this.hudControlsDisplay.setAttribute('visible', !isVisible); console.log(`[QM] Controls HUD visibility set to: ${!isVisible}`); }
      }
  },

  // Manejar clic en un item coleccionable
  onItemClicked: function (evt) {
    const itemEl = evt.target.closest('.collectible'); // Asegurarse de obtener el elemento correcto
    if (!itemEl) return; // Salir si no es un coleccionable

    const itemType = itemEl.dataset.itemType;
    console.log(`!!!!!! [Quest Manager] Item Clicked! Element: ${itemEl.id || itemType}`);

    if (!itemType) { console.warn("[QM] Clicked collectible has no data-item-type."); return; }

    // Mostrar mensaje de feedback
    this.showFeedback(`Elemento localizado: ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`);

    // Ocultar el objeto (o hacerlo no clickable)
    itemEl.setAttribute('visible', 'false');
    itemEl.removeAttribute('clickable'); // Prevenir más clics
    itemEl.classList.remove('collectible'); // Opcional
    itemEl.removeEventListener('click', this.onItemClicked); // Quitar listener por si acaso

    // Nota: Ya no hay contador ni lógica de quest completa en esta versión.
  },

  // Mostrar mensajes temporales en el HUD de mensajes
  showFeedback: function (message) {
       if (this.questMessageTextEl && this.questMessageDisplayEl) {
           console.log(`[QM Feedback] ${message}`);
           this.questMessageTextEl.setAttribute('text', 'value', message);
           this.questMessageDisplayEl.setAttribute('visible', 'true');
           if(this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
           // Mostrar mensaje por 3 segundos
           this.feedbackTimeout = setTimeout(() => { if (this.questMessageDisplayEl) this.questMessageDisplayEl.setAttribute('visible', 'false'); }, 3000);
       } else {
           console.error("[QM] Cannot show feedback - message HUD elements missing!");
           console.log(`[QM Feedback - Console] ${message}`); // Fallback a consola
       }
   },

  // Limpieza
  remove: function () {
      window.removeEventListener('keydown', this.onKeyDown);
      this.el.sceneEl.removeEventListener('loaded', this.attachItemListeners);
      // Quitar listeners de items (más complejo, omitir por ahora si no es crítico)
      console.log("[Quest Manager] Removed.");
   }
});