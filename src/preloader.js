// Fonction pour gérer le verrouillage du défilement pendant le preloader
function initPreloaderLock() {
    // Désactiver le défilement pendant le preloader
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    
    // Ajouter le verrouillage Lenis si nécessaire
    const hasLenisClass = document.documentElement.classList.contains('lenis') || 
                         document.documentElement.classList.contains('lenis-smooth');
    
    if (hasLenisClass) {
      document.documentElement.classList.add('scroll-locked');
      addScrollLockStyles();
    }
  }
  
  // Fonction pour ajouter les styles CSS du verrouillage
  function addScrollLockStyles() {
    const styleTag = document.createElement('style');
    styleTag.id = 'loader-scroll-lock';
    styleTag.textContent = `
      html.scroll-locked, 
      html.scroll-locked body {
        overflow: hidden !important;
        height: 100% !important;
        position: fixed !important;
        width: 100% !important;
      }
    `;
    document.head.appendChild(styleTag);
  }
  
  // Fonction pour supprimer le verrouillage
  function removePreloaderLock() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
    
    document.documentElement.classList.remove('scroll-locked');
    
    const styleTag = document.getElementById('loader-scroll-lock');
    if (styleTag) {
      styleTag.remove();
    }
  }
  
  // Exécution immédiate du verrouillage
  (function() {
    initPreloaderLock();
  })();
  
  // Exporter les fonctions pour une utilisation externe
  export {
    initPreloaderLock,
    removePreloaderLock
  };