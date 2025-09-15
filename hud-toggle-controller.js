/**
 * hud-toggle-controller.js
 * Se adjunta al Camera Rig. Gestiona ocultar/mostrar HUD de Controles con Tecla H.
 */
AFRAME.registerComponent('hud-toggle-controller', {
    init: function () {
        console.log("[HUD Toggle] Initializing...");
        this.hudControlsDisplay = document.querySelector('#hud-controls-display');
        this.onKeyDown = this.onKeyDown.bind(this);

        if (!this.hudControlsDisplay) {
            console.warn("[HUD Toggle] Controls HUD (#hud-controls-display) not found.");
        } else {
            console.log("[HUD Toggle] Controls HUD found. Adding keyboard listener.");
            window.addEventListener('keydown', this.onKeyDown);
        }
    },
    onKeyDown: function (e) {
        if (e.code === 'KeyH') {
            console.log("[HUD Toggle] H detected.");
            if (this.hudControlsDisplay) {
                try {
                    const isVisible = this.hudControlsDisplay.getAttribute('visible');
                    this.hudControlsDisplay.setAttribute('visible', !isVisible);
                    console.log(`[HUD Toggle] Controls HUD visibility set to: ${!isVisible}`);
                } catch(err) { console.error("Error toggling HUD:", err); }
            }
        }
    },
    remove: function () {
        window.removeEventListener('keydown', this.onKeyDown);
        console.log("[HUD Toggle] Removed.");
    }
});