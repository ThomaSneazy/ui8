class MarqueeAnimation {
    constructor() {
      this.marquees = document.querySelectorAll('[data-marquee-scroll-direction-target]');
      if (!this.marquees.length) return;
      
      this.init();
    }
    
    init() {
      this.marquees.forEach(marquee => this.setupMarquee(marquee));
    }
    
    setupMarquee(marquee) {
      const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
      const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
      if (!marqueeContent || !marqueeScroll) return;
      
      const config = this.getMarqueeConfig(marquee, marqueeContent);
      
      this.setupMarqueeStyles(marqueeScroll, config);
      this.duplicateContent(marqueeContent, marqueeScroll, config.duplicateAmount);
      this.createMarqueeAnimation(marquee, config);
    }
    
    getMarqueeConfig(marquee, marqueeContent) {
      const { 
        marqueeSpeed: speed,
        marqueeDirection: direction,
        marqueeDuplicate: duplicate,
        marqueeScrollSpeed: scrollSpeed
      } = marquee.dataset;
      
      const speedMultiplier = this.getSpeedMultiplier();
      
      return {
        speedAttr: parseFloat(speed),
        directionAttr: direction === 'right' ? 1 : -1,
        duplicateAmount: parseInt(duplicate || 0),
        scrollSpeedAttr: parseFloat(scrollSpeed),
        speedMultiplier,
        marqueeSpeed: parseFloat(speed) * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier
      };
    }
    
    getSpeedMultiplier() {
      if (window.innerWidth < 479) return 0.25;
      if (window.innerWidth < 991) return 0.5;
      return 1;
    }
    
    setupMarqueeStyles(marqueeScroll, config) {
      marqueeScroll.style.marginLeft = `${config.scrollSpeedAttr * -1}%`;
      marqueeScroll.style.width = `${(config.scrollSpeedAttr * 2) + 100}%`;
    }
    
    duplicateContent(marqueeContent, marqueeScroll, duplicateAmount) {
      if (duplicateAmount > 0) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < duplicateAmount; i++) {
          fragment.appendChild(marqueeContent.cloneNode(true));
        }
        marqueeScroll.appendChild(fragment);
      }
    }
    
    createMarqueeAnimation(marquee, config) {
      const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
      
      // Animation principale
      const animation = gsap.to(marqueeItems, {
        xPercent: -100,
        repeat: -1,
        duration: config.marqueeSpeed,
        ease: 'linear'
      }).totalProgress(0.5);
      
      // Configuration initiale
      gsap.set(marqueeItems, { 
        xPercent: config.directionAttr === 1 ? 100 : -100 
      });
      
      animation.timeScale(config.directionAttr);
      animation.play();
      
      marquee.setAttribute('data-marquee-status', 'normal');
      
      this.createScrollTriggers(marquee, animation, config);
    }
    
    createScrollTriggers(marquee, animation, config) {
      // ScrollTrigger pour l'inversion de direction
      ScrollTrigger.create({
        trigger: marquee,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const isInverted = self.direction === 1;
          const currentDirection = isInverted ? -config.directionAttr : config.directionAttr;
          
          animation.timeScale(currentDirection);
          marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
        }
      });
      
      // Timeline pour le défilement parallaxe
      const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
      const scrollStart = config.directionAttr === -1 ? config.scrollSpeedAttr : -config.scrollSpeedAttr;
      const scrollEnd = -scrollStart;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: marquee,
          start: '0% 100%',
          end: '100% 0%',
          scrub: 0
        }
      });
      
      tl.fromTo(marqueeScroll, 
        { x: `${scrollStart}vw` }, 
        { x: `${scrollEnd}vw`, ease: 'none' }
      );
    }
  }
  
  // Fonction d'initialisation
  function initMarquees() {
    return new MarqueeAnimation();
  }
  
  export {
    MarqueeAnimation,
    initMarquees
  };