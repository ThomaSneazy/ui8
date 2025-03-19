class ThemeSwitcher {
    constructor() {
      this.lightBtn = document.querySelector('.light-theme-btn');
      this.darkBtn = document.querySelector('.dark-theme-btn');
      
      // Vérifier si les boutons existent
      if (!this.lightBtn || !this.darkBtn) return;
      
      this.init();
    }
    
    init() {
      this.extendSplineTheme();
      this.setupEventListeners();
      this.initializeTheme();
    }
    
    updateButtonStyles(themeName) {
      // Supprimer la classe sélectionnée des deux boutons
      this.lightBtn.classList.remove('theme-btn-selected');
      this.darkBtn.classList.remove('theme-btn-selected');
      
      // Ajouter la classe au bouton actif
      if (themeName === 'light') {
        this.lightBtn.classList.add('theme-btn-selected');
      } else if (themeName === 'dark') {
        this.darkBtn.classList.add('theme-btn-selected');
      }
    }
    
    extendSplineTheme() {
      // Étendre la fonction switchSplineTheme si elle existe
      if (window.switchSplineTheme) {
        const originalSwitchTheme = window.switchSplineTheme;
        const self = this;
        
        window.switchSplineTheme = function(themeName) {
          // Appeler la fonction originale
          originalSwitchTheme(themeName);
          
          // Mettre à jour les styles des boutons
          self.updateButtonStyles(themeName);
        };
      }
    }
    
    setupEventListeners() {
      // Ajouter les écouteurs d'événements pour les boutons
      this.lightBtn.addEventListener('click', () => {
        window.switchSplineTheme('light');
      });
      
      this.darkBtn.addEventListener('click', () => {
        window.switchSplineTheme('dark');
      });
    }
    
    initializeTheme() {
      // Initialiser les styles des boutons en fonction du thème actuel
      if (window.splineThemes) {
        this.updateButtonStyles(window.splineThemes.current);
      }
    }
    
    // Méthode pour changer le thème manuellement
    switchTheme(themeName) {
      if (window.switchSplineTheme) {
        window.switchSplineTheme(themeName);
      }
    }
  }
  
  // Fonction d'initialisation
  function initThemeSwitcher() {
    return new ThemeSwitcher();
  }
  
  // Export de la classe et de la fonction d'initialisation
  export {
    ThemeSwitcher,
    initThemeSwitcher
  };