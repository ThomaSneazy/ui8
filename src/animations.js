// Import GSAP si nécessaire
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

class CustomCursor {
    constructor() {
      this.cursorItem = document.querySelector(".custom-cursor");
      if (!this.cursorItem) return;
      
      this.init();
    }
    
    init() {
      this.cursorText = this.cursorItem.querySelector(".cursor-text");
      this.targetSections = document.querySelectorAll(".cursor-trigger-section");
      this.cursorHideElements = document.querySelectorAll(".cursor-hide");
      
      this.xOffset = 6;
      this.yOffset = 10;
      this.isOverTargetSection = false;
      this.currentSection = null;
      this.scrollTimeout = null;
      
      this.setupCursor();
      this.bindEvents();
    }
    
    setupCursor() {
      gsap.set(this.cursorItem, { 
        xPercent: this.xOffset, 
        yPercent: this.yOffset, 
        opacity: 0 
      });
      
      this.xTo = gsap.quickTo(this.cursorItem, "x", { ease: "power3" });
      this.yTo = gsap.quickTo(this.cursorItem, "y", { ease: "power3" });
    }
    
    handleMouseMove = (e) => {
      const { clientX: cursorX, clientY: cursorY } = e;
      
      this.xTo(cursorX);
      this.yTo(cursorY);
      
      this.checkIntersection(cursorX, cursorY);
    }
    
    checkIntersection(cursorX, cursorY) {
      this.isOverTargetSection = false;
      
      for (const section of this.targetSections) {
        const rect = section.getBoundingClientRect();
        
        if (this.isPointInRect(cursorX, cursorY, rect)) {
          this.isOverTargetSection = true;
          this.currentSection = section;
          break;
        }
      }
      
      if (this.isOverTargetSection) {
        this.checkHideElements(cursorX, cursorY);
      }
      
      this.updateCursorVisibility();
      this.updateCursorText();
    }
    
    isPointInRect(x, y, rect) {
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }
    
    checkHideElements(cursorX, cursorY) {
      for (const element of this.cursorHideElements) {
        const rect = element.getBoundingClientRect();
        if (this.isPointInRect(cursorX, cursorY, rect)) {
          this.isOverTargetSection = false;
          break;
        }
      }
    }
    
    updateCursorVisibility() {
      gsap.to(this.cursorItem, {
        opacity: this.isOverTargetSection ? 1 : 0,
        duration: 0.3
      });
    }
    
    updateCursorText() {
      if (this.isOverTargetSection && this.currentSection) {
        const customTextElement = this.currentSection.querySelector('.cursor-custom-text');
        if (customTextElement) {
          this.cursorText.textContent = customTextElement.textContent;
        }
      }
    }
    
    handleScroll = () => {
      if (this.isOverTargetSection) {
        gsap.to(this.cursorItem, { opacity: 0, duration: 0.2 });
      }
      
      clearTimeout(this.scrollTimeout);
      
      this.scrollTimeout = setTimeout(() => {
        if (this.isOverTargetSection) {
          gsap.to(this.cursorItem, { opacity: 1, duration: 0.3 });
        }
      }, 100);
    }
    
    bindEvents() {
      window.addEventListener("mousemove", this.handleMouseMove, { passive: true });
      window.addEventListener("scroll", this.handleScroll, { passive: true });
    }
    
    destroy() {
      window.removeEventListener("mousemove", this.handleMouseMove);
      window.removeEventListener("scroll", this.handleScroll);
      clearTimeout(this.scrollTimeout);
    }
  }
  
  class ScrollAnimations {
    constructor() {
      this.init();
    }
    
    init() {
      this.initTextScrubbing();
      this.initLetterAnimation();
      this.initWorkSlides();
    }
    
    initTextScrubbing() {
      $(".scroll_wrap").each(function() {
        const headings = $(this).find(".scroll_heading_item");
        const indexLength = headings.length - 1;
        
        if (indexLength < 0) return;
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: $(this),
            start: "top top",
            end: "bottom bottom",
            scrub: true
          }
        });
        
        tl.to(headings, { yPercent: -100 * indexLength, ease: "none" });
      });
    }
    
    initLetterAnimation() {
      const letterElements = document.querySelectorAll('.our-work-heading .letter');
      if (letterElements.length > 0) {
        gsap.to(letterElements, {
          yPercent: 100,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '.our-work-heading ul',
            start: '50% bottom',
            end: '100% 80%',
            scrub: 1
          },
          stagger: {
            each: 0.07,
            from: 'random'
          }
        });
      }
    }
    
    initWorkSlides() {
      const slides = document.querySelectorAll('.work-list-wrapper .work-slide');
      slides.forEach(slide => {
        const contentWrapper = slide.querySelector('.grid_link');
        const content = slide.querySelector('.visual_wrap');
        
        if (!contentWrapper || !content) return;
        
        this.createSlideAnimation(content, contentWrapper, slide);
      });
    }
    
    createSlideAnimation(content, contentWrapper, slide) {
      gsap.to(content, {
        rotationZ: (Math.random() - 0.5) * 10,
        scale: 0.7,
        rotationX: 40,
        ease: 'power1.in',
        scrollTrigger: {
          pin: contentWrapper,
          trigger: slide,
          start: 'top 10%',
          end: '+=' + window.innerHeight,
          scrub: true
        }
      });
      
      gsap.to(content, {
        autoAlpha: 0,
        ease: 'power1.in',
        scrollTrigger: {
          trigger: content,
          start: 'top -70%',
          end: '+=' + 0.2 * window.innerHeight,
          scrub: true
        }
      });
    }
  }
  
  // Fonction d'initialisation globale
  function initAnimations() {
    requestAnimationFrame(() => {
      const cursor = new CustomCursor();
      const scrollAnimations = new ScrollAnimations();
    });
  }
  
  export {
    CustomCursor,
    ScrollAnimations,
    initAnimations
  };