// Gestionnaire global pour Spline
class SplineManager {
    constructor() {
      // Promesse de chargement du runtime Spline
      this.initRuntimePromise();
      
      // Configuration des thèmes
      this.initThemes();
      
      // Tableau pour suivre toutes les scènes
      this.scenes = [];
      
      // Ratio d'affichage désiré pour les performances
      this.DESIRED_RATIO = this.calculateDesiredRatio();
      
      // Override devicePixelRatio pour de meilleures performances
      this.overrideDevicePixelRatio();
    }
  
    initRuntimePromise() {
      if (!window.splineRuntimePromise) {
        window.splineRuntimePromise = import('https://cdn.jsdelivr.net/npm/@splinetool/runtime@1.9.79/build/runtime.min.js')
          .then(module => {
            window.splineRuntime = module;
            return module;
          })
          .catch(err => console.error("Failed to load Spline runtime:", err));
      }
    }
  
    initThemes() {
      window.splineThemes = {
        light: {
          TextLightness: 100,
          GlassOpacity: 97,
          BlobFresnel: 80,
          LightTheme: 90,
          DarkTheme: 0,
          backgroundColor: '#C2C2C2',
          webflowGreyish: '#292929',
          webflowGreymain: '#dddddd',
          webflowGreymainalpha: '#dddddd00',
          textprimary: '#1B1B1B',
          textdisabled: '#727272',
          surface1: '#F1F1F1',
          surface2: '#FDFDFD',
          textonlight: '#FDFDFD',
          greysecondary: '#282828'
        },
        dark: {
          TextLightness: 0,
          GlassOpacity: 60,
          BlobFresnel: 35,
          LightTheme: 0,
          DarkTheme: 100,
          backgroundColor: '#181818',
          webflowGreyish: '#dfdfdf',
          webflowGreymain: '#232323',
          webflowGreymainalpha: '#23232300',
          textprimary: '#f1f1f1',
          textdisabled: '#a8a8a8',
          surface1: '#1b1b1b',
          surface2: '#282828',
          textonlight: '#141414',
          greysecondary: '#e2e2e2'
        },
        current: 'dark'
      };
  
      // Fonction globale pour changer de thème
      window.switchSplineTheme = this.switchTheme.bind(this);
    }
  
    calculateDesiredRatio() {
      const userAgent = navigator.userAgent;
      const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isLowRAM = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
      const isLowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  
      if (isSafari) {
        return isMobile || isIOS ? 1.2 : 0.85;
      }
      
      if (isMobile && (isLowRAM || isLowCPU || isIOS)) return 1;
      if (isMobile) return 1.2;
      if (isLowRAM || isLowCPU) return 0.9;
      return 1.15;
    }
  
    overrideDevicePixelRatio() {
      Object.defineProperty(window, 'devicePixelRatio', {
        get: () => this.DESIRED_RATIO,
        configurable: false
      });
    }
  
    switchTheme(themeName) {
      if (!window.splineThemes[themeName]) {
        console.error(`Theme '${themeName}' not found.`);
        return;
      }
  
      window.splineThemes.current = themeName;
      const themeVars = window.splineThemes[themeName];
  
      this.scenes.forEach(scene => {
        if (scene.splineApp) {
          scene.applyTheme(themeName);
        }
      });
  
      this.updateWebflowVariables(themeVars);
    }
  
    updateWebflowVariables(themeVars) {
      const variables = {
        '--grey-ish': themeVars.webflowGreyish,
        '--greymain': themeVars.webflowGreymain,
        '--greymainalpha': themeVars.webflowGreymainalpha,
        '--textprimary': themeVars.textprimary,
        '--textdisabled': themeVars.textdisabled,
        '--surface1': themeVars.surface1,
        '--surface2': themeVars.surface2,
        '--textonlight': themeVars.textonlight,
        '--greysecondary': themeVars.greysecondary
      };
  
      Object.entries(variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  
    createScene(canvasId, splineUrl) {
      const scene = new SplineScene(canvasId, splineUrl, this);
      this.scenes.push(scene);
      return scene;
    }
  }
  
  // Classe pour gérer une scène Spline individuelle
  class SplineScene {
    constructor(canvasId, splineUrl, manager) {
      this.canvasId = canvasId;
      this.splineUrl = splineUrl;
      this.manager = manager;
      this.canvas = document.getElementById(canvasId);
      this.splineApp = null;
      this.animationPaused = true;
      this.scrollCheckTimeout = null;
      this.isFooterScene = this.checkIfFooterScene();
      
      this.init();
    }
  
    // ... (Le reste du code de la classe SplineScene reste identique)
    // Vous pouvez copier toutes les méthodes de la classe SplineScene 
    // du code original ici
  }
  
  // Créer et exporter l'instance du gestionnaire
  const splineManager = new SplineManager();
  
  export {
    splineManager,
    SplineScene
  };