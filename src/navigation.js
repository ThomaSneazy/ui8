// Import GSAP si nécessaire (si ce n'est pas déjà importé globalement)
// import { gsap } from 'gsap';

// Classe principale pour gérer la navigation
class Navigation {
    constructor() {
      this.navWrap = document.querySelector(".nav");
      if (!this.navWrap) return;
      
      this.state = this.navWrap.getAttribute("data-nav");
      this.overlay = this.navWrap.querySelector(".overlay");
      this.menu = this.navWrap.querySelector(".video-panel");
      this.bgPanels = this.navWrap.querySelectorAll(".bg-panel");
      this.menuToggles = document.querySelectorAll("[data-menu-toggle]");
      this.lenisBody = document.querySelector("html.lenis, .lenis body");
      this.tl = gsap.timeline();
      this.scrollPosition = 0;
      
      this.init();
    }
    
    init() {
      this.menuToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
          this.state = this.navWrap.getAttribute("data-nav");
          this.state === "open" ? this.closeNav() : this.openNav();
        });
      });
    }
    
    openNav() {
      this.navWrap.setAttribute("data-nav", "open");
      this.scrollPosition = window.scrollY;
      
      if (window.lenis) window.lenis.stop();
      
      this.tl.clear()
        .set(this.navWrap, {display: "block"})
        .set(this.menu, {yPercent: 0})
        .fromTo(this.overlay, {autoAlpha: 0}, {autoAlpha: 1})
        .fromTo(this.bgPanels, {yPercent: 101}, {yPercent: 0, stagger: 0.12, duration: 0.575}, "<")
        .call(() => this.lockScroll());
    }
    
    closeNav() {
      this.navWrap.setAttribute("data-nav", "closed");
      this.navWrap.style.pointerEvents = "none";
      
      this.unlockScroll();
      
      this.tl.clear()
        .to(this.overlay, {autoAlpha: 0})
        .to(this.menu, {yPercent: 120}, "<")
        .set(this.navWrap, {display: "none"});
    }
    
    lockScroll() {
      this.navWrap.style.pointerEvents = "auto";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = "100%";
      
      if (this.lenisBody) this.lenisBody.style.overflow = "hidden";
    }
    
    unlockScroll() {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      
      window.scrollTo(0, this.scrollPosition);
      
      if (this.lenisBody) this.lenisBody.style.overflow = "";
      if (window.lenis) window.lenis.start();
    }
  }
  
  // Classe pour gérer les ancres de navigation
  class NavigationAnchors {
    constructor() {
      this.menuShape = $(".menu_shape");
      if (!this.menuShape.length) return;
      
      this.menuShapeBG = $(".menu_shape-bg");
      this.menuLink = $(".menu_link");
      this.duration = 500;
      
      this.init();
    }
    
    init() {
      this.setupTransitions();
      this.setupObserver();
      this.snapToCurrent();
      
      window.addEventListener("resize", () => this.snapToCurrent());
      window.onpageshow = (event) => {
        if (event.persisted) window.location.reload();
      };
    }
    
    snapToCurrent() {
      $(".menu_link-bg").css("opacity", "0");
      this.menuShape.css("opacity", "1");
      if ($(".menu_link.w--current").length) {
        this.moveShape($(".menu_link.w--current"));
      } else {
        this.menuShape.css("opacity", "0");
      }
    }
    
    moveShape(target) {
      const linkWidth = target.innerWidth();
      const linkOffset = target.offset().left;
      const menuOffset = $(".menu").offset().left;
      const leftPosition = linkOffset - menuOffset;
      
      this.menuShape.css({
        "left": leftPosition,
        "width": linkWidth
      });
    }
    
    setupTransitions() {
      this.menuShapeBG.css("transition", `width ${this.duration / 2}ms`);
      this.menuShape.css("transition", `all ${this.duration}ms`);
    }
    
    setupObserver() {
      const config = { attributes: true, childList: true, subtree: true };
      const observer = new MutationObserver(() => this.snapToCurrent());
      
      $(".menu_link").each(function() {
        observer.observe($(this)[0], config);
      });
    }
  }
  
  // Classe pour gérer l'animation des caractères des boutons
  class ButtonCharacterStagger {
    constructor() {
      this.baseDelay = 1;
      this.offsetIncrement = 0.01;
      this.init();
    }
    
    init() {
      const buttons = document.querySelectorAll('[data-button-animate-chars]');
      
      buttons.forEach(button => {
        const text = button.textContent;
        button.innerHTML = '';
        
        [...text].forEach((char, index) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.transitionDelay = `${this.baseDelay + (index * this.offsetIncrement)}s`;
          
          if (char === ' ') {
            span.style.whiteSpace = 'pre';
          }
          
          button.appendChild(span);
        });
      });
    }
  }
  
  // Fonction d'initialisation globale
  function initNavigation() {
    new Navigation();
    new NavigationAnchors();
    new ButtonCharacterStagger();
  }
  
  // Export des classes et de la fonction d'initialisation
  export {
    Navigation,
    NavigationAnchors,
    ButtonCharacterStagger,
    initNavigation
  };