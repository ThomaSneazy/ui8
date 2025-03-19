class ImageTrail {
    constructor(config = {}) {
      // Configuration par défaut
      this.options = {
        minWidth: config.minWidth ?? 992,
        moveDistance: config.moveDistance ?? 12,
        stopDuration: config.stopDuration ?? 300,
        trailLength: config.trailLength ?? 4
      };
  
      this.wrapper = document.querySelector('[data-trail="wrapper"]');
      
      if (!this.wrapper || window.innerWidth < this.options.minWidth) {
        return;
      }
  
      // Gestion de l'état
      this.state = {
        trailInterval: null,
        globalIndex: 0,
        last: { x: 0, y: 0 },
        trailImageTimestamps: new Map(),
        trailImages: Array.from(document.querySelectorAll('[data-trail="item"]')),
        isActive: false
      };
  
      this.init();
    }
  
    init() {
      this.initScrollTrigger();
      this.initResizeHandler();
    }
  
    // Utilitaires mathématiques
    MathUtils = {
      lerp: (a, b, n) => (1 - n) * a + n * b,
      distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
    };
  
    getRelativeCoordinates(e, rect) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  
    activate(trailImage, x, y) {
      if (!trailImage) return;
  
      const rect = trailImage.getBoundingClientRect();
      const styles = {
        left: `${x - rect.width / 2}px`,
        top: `${y - rect.height / 2}px`,
        zIndex: this.state.globalIndex,
        display: 'block'
      };
  
      Object.assign(trailImage.style, styles);
      this.state.trailImageTimestamps.set(trailImage, Date.now());
  
      gsap.fromTo(
        trailImage,
        { autoAlpha: 0, scale: 0.6 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.2,
          overwrite: true
        }
      );
  
      this.state.last = { x, y };
    }
  
    fadeOutTrailImage(trailImage) {
      if (!trailImage) return;
      
      gsap.to(trailImage, {
        opacity: 0,
        scale: 0.2,
        duration: 0.5,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(trailImage, { autoAlpha: 0 });
        }
      });
    }
  
    handleOnMove = (e) => {
      if (!this.state.isActive) return;
  
      const rectWrapper = this.wrapper.getBoundingClientRect();
      const { x: relativeX, y: relativeY } = this.getRelativeCoordinates(e, rectWrapper);
      
      const distanceFromLast = this.MathUtils.distance(
        relativeX, 
        relativeY, 
        this.state.last.x, 
        this.state.last.y
      );
  
      if (distanceFromLast > window.innerWidth / this.options.moveDistance) {
        const lead = this.state.trailImages[this.state.globalIndex % this.state.trailImages.length];
        const tail = this.state.trailImages[(this.state.globalIndex - this.options.trailLength) % this.state.trailImages.length];
  
        this.activate(lead, relativeX, relativeY);
        this.fadeOutTrailImage(tail);
        this.state.globalIndex++;
      }
    }
  
    cleanupTrailImages = () => {
      const currentTime = Date.now();
      for (const [trailImage, timestamp] of this.state.trailImageTimestamps.entries()) {
        if (currentTime - timestamp > this.options.stopDuration) {
          this.fadeOutTrailImage(trailImage);
          this.state.trailImageTimestamps.delete(trailImage);
        }
      }
    }
  
    startTrail = () => {
      if (this.state.isActive) return;
      
      this.state.isActive = true;
      this.wrapper.addEventListener("mousemove", this.handleOnMove);
      this.state.trailInterval = setInterval(this.cleanupTrailImages, 100);
    }
  
    stopTrail = () => {
      if (!this.state.isActive) return;
      
      this.state.isActive = false;
      this.wrapper.removeEventListener("mousemove", this.handleOnMove);
      clearInterval(this.state.trailInterval);
      this.state.trailInterval = null;
      
      this.state.trailImages.forEach(img => this.fadeOutTrailImage(img));
      this.state.trailImageTimestamps.clear();
    }
  
    initScrollTrigger() {
      ScrollTrigger.create({
        trigger: this.wrapper,
        start: "top bottom",
        end: "bottom top",
        onEnter: this.startTrail,
        onEnterBack: this.startTrail,
        onLeave: this.stopTrail,
        onLeaveBack: this.stopTrail
      });
    }
  
    handleResize = () => {
      if (window.innerWidth < this.options.minWidth && this.state.isActive) {
        this.stopTrail();
      } else if (window.innerWidth >= this.options.minWidth && !this.state.isActive) {
        this.startTrail();
      }
    }
  
    initResizeHandler() {
      window.addEventListener('resize', this.handleResize);
    }
  
    destroy() {
      this.stopTrail();
      window.removeEventListener('resize', this.handleResize);
    }
  }
  
  // Fonction d'initialisation
  function initImageTrail(config = {}) {
    return new ImageTrail(config);
  }
  
  // Export de la classe et de la fonction d'initialisation
  export {
    ImageTrail,
    initImageTrail
  };