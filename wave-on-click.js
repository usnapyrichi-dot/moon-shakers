AFRAME.registerComponent('wave-on-click', {
  init: function () {
    this.el.addEventListener('click', () => {
      console.log('[Wave] Activando animación wave...');
      this.el.setAttribute('animation-mixer', 'clip: wave; loop: once');
    });
  }
});
