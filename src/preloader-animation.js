import { removePreloaderLock } from './preloader.js';

// Fonction principale pour l'animation du preloader
function initPreloaderAnimation() {
  const loaderRive = document.querySelector('.loader-rive');
  const loaderDiv = document.querySelector('.loader-div');
  const toHideElements = document.querySelectorAll('.to-hide');
  
  if (!loaderRive || !loaderDiv) return;
  
  const isMobile = window.innerWidth < 768;
  const marginValue = isMobile ? "20px" : "40px";
  
  function startLoaderAnimation() {
    const tl = gsap.timeline({
      delay: 8.35,
      onComplete: function() {
        // Masquer les éléments du loader
        gsap.set([loaderRive, loaderDiv], { display: "none" });
        gsap.killTweensOf([loaderRive, loaderDiv]);
        if (toHideElements.length > 0) {
          gsap.killTweensOf(toHideElements);
        }
        
        // Supprimer le verrouillage du défilement
        removePreloaderLock();
        
        // Démarrer Lenis si disponible
        if (window.lenis && typeof window.lenis.start === 'function') {
          window.lenis.start();
        }
      }
    });
    
    // Animation du loader Rive
    tl.to(loaderRive, {
      duration: 1,
      position: "absolute",
      top: marginValue,
      left: marginValue,
      width: "42px",
      height: "42px",
      ease: "expo.inOut"
    }, 0)
    .to(loaderRive, {
      duration: 0.2,
      opacity: 0,
      ease: "expo.inOut"
    }, 0.8)
    .to(loaderDiv, {
      duration: 1.1,
      y: "-100vh",
      ease: "expo.inOut"
    }, 0);
    
    // Animation des éléments à masquer
    if (toHideElements.length > 0) {
      tl.to(toHideElements, {
        duration: 0.2,
        opacity: 0,
        ease: "power1.in"
      }, 0.2);
    }
  }
  
  // Gestion de l'initialisation avec Webflow Rive
  function initWithRive() {
    if (window.Webflow && window.Webflow.require) {
      try {
        const RiveModule = window.Webflow.require('rive');
        if (RiveModule) {
          RiveModule.ready
            .then(() => {
              const riveInstance = RiveModule.getInstances().find(instance => 
                instance.el && instance.el.closest('.loader-rive')
              );
              
              if (riveInstance) {
                riveInstance.on('load', () => startLoaderAnimation());
                if (riveInstance.isLoaded) startLoaderAnimation();
              } else {
                startLoaderAnimation();
              }
            })
            .catch(() => startLoaderAnimation());
        } else {
          startLoaderAnimation();
        }
      } catch (e) {
        startLoaderAnimation();
      }
    } else {
      startLoaderAnimation();
    }
  }
  
  // Démarrer l'initialisation
  initWithRive();
}

// Exécuter l'initialisation immédiatement
(function() {
  initPreloaderAnimation();
})();

export { initPreloaderAnimation };