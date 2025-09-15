/**
 * first-person-controller.js (v. Final Limpia)
 */
AFRAME.registerComponent("first-person-controller", {
  schema: {
    enabled: { type: "boolean", default: true },
    speed: { type: "number", default: 4 },
    jumpHeight: { type: "number", default: 6 },
    jumpDuration: { type: "number", default: 1800 },
  },
  init: function () {
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.keys = {};
    this.jumping = false;
    this.jumpTime = 0;
    this.jumpStartY = 0;
    this.jumpPeakY = 0;
    this.camera = this.el.querySelector("[camera]");
    if (!this.camera) {
      console.error("FPC: No camera found.");
    }
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    console.log("First person controller initialized.");
  },
  remove: function () {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    console.log("First person controller removed.");
  },
  onKeyDown: function (e) {
    if (typeof this.keys !== "object" || this.keys === null) {
      this.keys = {};
    }
    this.keys[e.code] = true;
  },
  onKeyUp: function (e) {
    if (typeof this.keys !== "object" || this.keys === null) {
      this.keys = {};
    }
    this.keys[e.code] = false;
  },
  tick: function (time, delta) {
    if (!this.data.enabled) {
      return;
    }
    const el = this.el;
    const data = this.data;
    const deltaSeconds = delta / 1000;
    if (typeof this.keys !== "object" || this.keys === null) {
      this.keys = {};
    }
    if (this.keys["Space"] && !this.jumping) {
      this.jumping = true;
      this.jumpTime = 0;
      this.jumpStartY = el.object3D.position.y;
      this.jumpPeakY = this.jumpStartY + data.jumpHeight;
      const jumpSound = this.camera?.querySelector("#jumpSound");
      if (jumpSound?.components.sound) {
        jumpSound.components.sound.playSound();
      }
    }
    if (this.jumping) {
      this.jumpTime += delta;
      const halfDuration = data.jumpDuration / 2;
      let newY;
      if (this.jumpTime < halfDuration) {
        const progress = this.jumpTime / halfDuration;
        newY = this.jumpStartY + data.jumpHeight * progress;
      } else {
        const fallTime = this.jumpTime - halfDuration;
        const fallProgress = Math.min(fallTime / halfDuration, 1);
        newY = this.jumpPeakY - data.jumpHeight * Math.pow(fallProgress, 1.5);
      }
      el.object3D.position.y = newY;
      if (this.jumpTime >= data.jumpDuration) {
        el.object3D.position.y = this.jumpStartY;
        this.jumping = false;
      }
    }
    if (!this.jumping) {
      this.direction.set(0, 0, 0);
      if (this.keys["KeyW"]) {
        this.direction.z -= 1;
      }
      if (this.keys["KeyS"]) {
        this.direction.z += 1;
      }
      if (this.keys["KeyA"]) {
        this.direction.x -= 1;
      }
      if (this.keys["KeyD"]) {
        this.direction.x += 1;
      }
      if (this.direction.lengthSq() > 0) {
        this.direction.normalize();
        if (!this.camera) return;
        const cameraRotationY = this.camera.object3D.rotation.y;
        const moveDirectionWorld = this.direction.clone();
        moveDirectionWorld.applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          cameraRotationY
        );
        const displacement = moveDirectionWorld.multiplyScalar(
          data.speed * deltaSeconds
        );
        el.object3D.position.add(displacement);
      }
    }
  },
});
