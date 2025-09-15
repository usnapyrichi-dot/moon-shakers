/**
 * npc-dialogue-trigger.js (Versión que reproduce el audio UNA SOLA VEZ)
 */
AFRAME.registerComponent("npc-dialogue-trigger", {
  schema: {},
  init: function () {
    this.soundComponent = null;
    this.onClick = this.onClick.bind(this);
    const el = this.el;
    this.hasPlayed = false;
    console.log(
      `[NPC] Initializing on #${el.id}... hasPlayed = ${this.hasPlayed}`
    );
    setTimeout(() => {
      console.log(`[NPC] Attempting find sound__dialogue on #${el.id}`);
      this.soundComponent = el.components["sound__dialogue"];
      if (!this.soundComponent) {
        console.error(`[NPC] 'sound__dialogue' NOT found on #${el.id}.`);
      } else {
        console.log(`[NPC] 'sound__dialogue' FOUND. Adding click listener.`);
        el.addEventListener("click", this.onClick);
      }
    }, 100);
    console.log("[NPC] Init function finished (sound check pending).");
  },
  onClick: function (evt) {
    console.log(`[NPC] Click detected on #${this.el.id}.`);
    if (this.hasPlayed) {
      console.log("[NPC] Already played. Ignoring.");
      return;
    }
    console.log(`[NPC] Attempting play first time.`);
    if (!this.soundComponent) {
      console.warn("[NPC] Sound component missing.");
      return;
    }
    try {
      this.soundComponent.stopSound();
    } catch (e) {}
    if (this.soundComponent.loaded) {
      setTimeout(() => {
        this.soundComponent.playSound();
        console.log("[NPC] playSound() called.");
        this.hasPlayed = true;
        console.log("[NPC] hasPlayed = true.");
      }, 20);
    } else {
      console.warn("[NPC] Sound not loaded. Waiting.");
      this.el.addEventListener(
        "sound-loaded",
        () => {
          console.log("[NPC] sound-loaded event.");
          if (this.soundComponent && !this.hasPlayed) {
            this.soundComponent.playSound();
            console.log("[NPC] playSound() after load.");
            this.hasPlayed = true;
            console.log("[NPC] hasPlayed = true.");
          }
        },
        { once: true }
      );
    }
  },
  remove: function () {
    this.el.removeEventListener("click", this.onClick);
    if (this.soundComponent && this.soundComponent.isPlaying) {
      this.soundComponent.stopSound();
    }
    console.log(`[NPC] Removed from #${this.el.id}.`);
  },
});
