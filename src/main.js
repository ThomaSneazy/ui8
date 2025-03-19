// Import des modules preloader
import { initPreloaderLock, removePreloaderLock } from './preloader.js';
import { initPreloaderAnimation } from './preloader-animation.js';
import { initNavigation } from './navigation.js';
import { initThemeSwitcher } from './theme-switcher.js';
import { initImageTrail } from './cursor-trail.js';
import { initAnimations } from './animations.js';
import { initMarquees } from './marquee.js';



// Variables globales Lenis
let lenis;
let lenisScrollListener;
let lenisTicker;

// Exécution immédiate du preloader
(function() {
  initPreloaderLock();
  initPreloaderAnimation();
})();

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Initialize Lenis with GSAP integration
function initLenis() {
  if (window.Lenis && !lenis) {
    // Create new Lenis instance with optimized settings
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });
    
    // Connect to ScrollTrigger with debounced handler
    lenisScrollListener = debounce((e) => {
      ScrollTrigger.update();
    }, 100); // 100ms debounce for better performance
    lenis.on('scroll', lenisScrollListener);
    
    // Connect to GSAP ticker with optimized animation frame
    lenisTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisTicker);
    
    // Disable lag smoothing as in your original code
    gsap.ticker.lagSmoothing(0);
    
    // Add lenis class to html element for CSS
    document.documentElement.classList.add('lenis', 'lenis-smooth');
  }
}

// Stop Lenis smoothing but keep the instance
function pauseLenis() {
  if (lenis) {
    lenis.stop();
    document.documentElement.classList.add('lenis-stopped');
    document.documentElement.classList.remove('lenis-smooth');
  }
}

// Resume Lenis smoothing
function resumeLenis() {
  if (lenis) {
    lenis.start();
    document.documentElement.classList.remove('lenis-stopped');
    document.documentElement.classList.add('lenis-smooth');
  }
}

// Completely destroy Lenis instance with proper cleanup
function destroyLenis() {
  if (lenis) {
    // Remove event listeners
    lenis.off('scroll', lenisScrollListener);
    
    // Remove from GSAP ticker
    gsap.ticker.remove(lenisTicker);
    
    // Destroy the instance
    lenis.destroy();
    
    // Remove classes
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    
    // Reset variables
    lenis = null;
    lenisScrollListener = null;
    lenisTicker = null;
  }
}

// Reset Webflow with optimized parser
function resetWebflow(data) {
  try {
    // Use DOMParser only once
    const parser = new DOMParser();
    const dom = parser.parseFromString(data.next.html, "text/html");
    const webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
    
    if (webflowPageId) {
      document.documentElement.setAttribute("data-wf-page", webflowPageId);
      
      // Reset Webflow in sequence for better reliability
      if (window.Webflow) {
        window.Webflow.destroy();
        window.Webflow.ready();
        
        // Initialize Webflow interactions
        if (window.Webflow.require) {
          window.Webflow.require("ix2").init();
        }
      }
    }
  } catch (error) {
    // Silent error handling
  }
}

// Find and mark the active item for transitions with performance optimizations
function makeItemActive() {
  try {
    const cmsPage = document.querySelector(".cms-page");
    if (!cmsPage) return;
    
    const itemName = cmsPage.querySelector(".item-name");
    if (!itemName) return;
    
    const cmsPageName = itemName.textContent;
    if (!cmsPageName) return;
    
    // More efficient selector using document.querySelectorAll
    const dynamicItems = document.querySelectorAll(".w-dyn-item");
    
    // Use a more efficient loop
    for (let i = 0; i < dynamicItems.length; i++) {
      const item = dynamicItems[i];
      const nameElement = item.querySelector(".item-name");
      
      if (nameElement && nameElement.textContent === cmsPageName) {
        item.classList.add("active-flip-item");
        break; // Exit loop once found for performance
      }
    }
  } catch (error) {
    // Silent error handling
  }
}

// Handle flip animation with fixed opacity glitch
function flip(outgoing, incoming) {
  try {
    // Check that elements exist before proceeding
    if (outgoing.length === 0 || incoming.length === 0) {
      return;
    }
    
    const imageVisual = outgoing.find(".image-visual");
    if (imageVisual.length === 0) {
      return;
    }
    
    // Fix for opacity glitch: save current opacity and visibility 
    const originalOpacity = imageVisual.css('opacity') || '1';
    const originalVisibility = imageVisual.css('visibility') || 'visible';
    
    // Force visibility during transition
    imageVisual.css({
      'opacity': originalOpacity,
      'visibility': originalVisibility
    });
    
    // Create a FLIP state that includes opacity
    let state = Flip.getState(imageVisual, {
      props: "opacity,visibility"
    });
    
    // Remove existing image in target container
    incoming.find(".image-visual").remove();
    
    // Move the element without changing its appearance
    imageVisual.appendTo(incoming);
    
    // Run the FLIP animation with fixed settings
    Flip.from(state, { 
      duration: 0.5, 
      ease: "power1.inOut",
      immediateRender: true,  // Render first frame immediately
      onStart: () => {
        // Ensure opacity is maintained
        imageVisual.css({
          'opacity': originalOpacity,
          'visibility': originalVisibility
        });
      }
    });
  } catch (error) {
    // Silent error handling
  }
}

// Initialize Scrollify with improved error handling and layout detection
function initScrollify() {
  try {
    // Detect which layout is currently visible
    let targetClass = null;
    
    // Check each layout and determine which one is visible
    const layout1 = document.querySelector('.layout-1');
    const layout2 = document.querySelector('.layout-2');
    const layout3 = document.querySelector('.layout-3');
    
    if (layout1 && isElementVisible(layout1)) {
      targetClass = '.s1';
    } else if (layout2 && isElementVisible(layout2)) {
      targetClass = '.s2';
    } else if (layout3 && isElementVisible(layout3)) {
      targetClass = '.s3';
    } else {
      // Fallback to default if no layout is detected
      targetClass = '.s1';
    }
    
    // Only proceed if we have sections to scrollify
    const sections = document.querySelectorAll(targetClass);
    if (sections.length === 0) return;
    
    // Stop any existing scrollify instance
    if (typeof $.scrollify !== 'undefined' && $.scrollify.destroy) {
      $.scrollify.destroy();
    }
    
    // Check if Scrollify is already available
    if (typeof $.scrollify !== 'undefined') {
      $.scrollify({
        section: targetClass,
        scrollSpeed: 900,
        easing: "easeOutExpo"
      });
      return;
    }
    
    // Load Scrollify if not available
    ensureLibraryLoaded('Scrollify', '$.scrollify', 
      'https://cdnjs.cloudflare.com/ajax/libs/scrollify/1.0.21/jquery.scrollify.min.js')
      .then(() => {
        $.scrollify({
          section: targetClass,
          scrollSpeed: 900,
          easing: "easeOutExpo"
        });
      })
      .catch(() => {
        // Silent failure
      });
  } catch (error) {
    // Silent error handling
  }
}

// Helper function to check if an element is visible
function isElementVisible(element) {
  if (!element) return false;
  
  // Check if the element has display:none
  const style = window.getComputedStyle(element);
  if (style.display === 'none') return false;
  
  // Check if the element has visibility:hidden
  if (style.visibility === 'hidden') return false;
  
  // Check if the element has opacity:0
  if (parseInt(style.opacity, 10) === 0) return false;
  
  // Check if the element has zero dimensions
  if (element.offsetWidth === 0 && element.offsetHeight === 0) return false;
  
  // Element is likely visible
  return true;
}

// Initialize button character stagger with performance optimizations
function initButtonCharacterStagger() {
  try {
    const buttons = document.querySelectorAll('[data-button-animate-chars]');
    if (buttons.length === 0) return;
    
    const baseDelay = 0.05; // Base hover delay in seconds (100ms)
    const offsetIncrement = 0.01; // Transition offset increment in seconds
    
    // Process buttons in chunks for better performance
    const processButtonChunk = (startIndex, chunkSize) => {
      const endIndex = Math.min(startIndex + chunkSize, buttons.length);
      
      for (let i = startIndex; i < endIndex; i++) {
        const button = buttons[i];
        
        // Skip if already processed
        if (button.getAttribute('data-stagger-initialized') === 'true') {
          continue;
        }
        
        const text = button.textContent; // Get the button's text content
        
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Process each character
        for (let j = 0; j < text.length; j++) {
          const char = text[j];
          const span = document.createElement('span');
          span.textContent = char;
          span.style.transitionDelay = `${baseDelay + (j * offsetIncrement)}s`; // Added baseDelay
          
          // Handle spaces explicitly
          if (char === ' ') {
            span.style.whiteSpace = 'pre'; // Preserve space width
          }
          
          fragment.appendChild(span);
        }
        
        // Clear and update content in one operation
        button.innerHTML = '';
        button.appendChild(fragment);
        
        // Mark as initialized to prevent duplicate processing
        button.setAttribute('data-stagger-initialized', 'true');
      }
      
      // Process next chunk if available
      if (endIndex < buttons.length) {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          processButtonChunk(endIndex, chunkSize);
        });
      }
    };
    
    // Start processing in chunks of 5 buttons
    processButtonChunk(0, 5);
  } catch (error) {
    // Silent error handling
  }
}

// Ensure libraries are loaded with better caching
const scriptCache = {};
function ensureLibraryLoaded(libraryName, globalObject, cdnUrl) {
  // Check cache first
  if (scriptCache[libraryName]) {
    return scriptCache[libraryName];
  }
  
  const promise = new Promise((resolve, reject) => {
    // Parse the global object path
    const parts = globalObject.split('.');
    let current = window;
    let exists = true;
    
    // Check if the object already exists
    for (const part of parts) {
      if (current[part] === undefined) {
        exists = false;
        break;
      }
      current = current[part];
    }
    
    if (exists) {
      resolve(current);
      return;
    }
    
    // Load the script
    const script = document.createElement('script');
    script.src = cdnUrl;
    
    // Add loading attributes for performance
    script.async = true;
    
    script.onload = () => {
      // Re-check the global object
      current = window;
      exists = true;
      for (const part of parts) {
        if (current[part] === undefined) {
          exists = false;
          break;
        }
        current = current[part];
      }
      
      if (exists) {
        resolve(current);
      } else {
        reject(new Error(`${libraryName} loaded but global object not found`));
      }
    };
    script.onerror = () => {
      reject(new Error(`Failed to load ${libraryName}`));
    };
    document.body.appendChild(script);
  });
  
  // Cache the promise
  scriptCache[libraryName] = promise;
  return promise;
}

// Barba hooks with optimizations
barba.hooks.beforeLeave((data) => {
  // Check if we're leaving grid page and going to cms page
  if (data.current.namespace === 'grid-page' && data.next.namespace === 'cms-page') {
    pauseLenis();
  }
});

barba.hooks.beforeEnter((data) => {
  // Reset Webflow
  resetWebflow(data);
  
  // Check which page we're entering
  if (data.next.namespace === 'grid-page') {
    if (lenis) {
      // Resume if it exists but was stopped
      resumeLenis();
    } else {
      // Initialize if it doesn't exist
      initLenis();
    }
  } else if (data.next.namespace === 'cms-page') {
    pauseLenis();
    
    // Scroll CMS page to top
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }
});

barba.hooks.after((data) => {
  // Use direct classList manipulation instead of jQuery for better performance
  const nextContainer = data.next.container;
  if (nextContainer) {
    nextContainer.classList.remove("fixed");
  }
  
  // Remove active classes
  document.querySelectorAll(".active-flip-item").forEach(el => {
    el.classList.remove("active-flip-item");
  });
});

// Fix for browser back button - create a history state handler
let wasOnCmsPage = false;

function updatePageState() {
  // Check if we're on a CMS page
  const container = document.querySelector('[data-barba="container"]');
  if (container && container.getAttribute('data-barba-namespace') === 'cms-page') {
    wasOnCmsPage = true;
  } else {
    wasOnCmsPage = false;
  }
}

// Handle popstate event (browser back/forward)
window.addEventListener('popstate', (event) => {
  // If we're going back from a CMS page, reload the page completely
  if (wasOnCmsPage) {
    // Prevent Barba from handling this
    window.location.reload();
  }
});

// Simple configuration to disable Barba for transitions to grid page
barba.init({
  // Define rules to prevent Barba from handling certain transitions
  prevent: ({ el }) => {
    // Skip heavy DOM operations if element doesn't exist
    if (!el) return false;
    
    // Get the container of the current page
    const container = el.closest('[data-barba="container"]');
    
    // If we're on a CMS page, prevent Barba from handling the transition
    if (container && container.getAttribute('data-barba-namespace') === 'cms-page') {
      return true; // Force normal page load
    }
    
    return false; // Allow Barba to handle transitions
  },
  transitions: [
    // Only define the grid-to-cms transition
    {
      sync: true,
      from: { namespace: ["grid-page"] },
      to: { namespace: ["cms-page"] },
      enter(data) {
        makeItemActive();
        // Use direct DOM manipulation for better performance
        if (data.next.container) {
          data.next.container.classList.add("fixed");
        }
        
        // Execute FLIP animation
        flip($(".active-flip-item"), $(".cms-page_img-wrap"));
        
        // Return animation for completion tracking
        return gsap.to(data.current.container, { 
          opacity: 0, 
          duration: 0.5,
          clearProps: "all" // Clean up GSAP properties after animation
        });
      }
    }
  ],
  views: [
    {
      namespace: 'grid-page',
      afterEnter() {
        // Ensure Lenis is running on grid page
        if (lenis) {
          resumeLenis();
        } else {
          initLenis();
        }
        
        // Update page state for back button handling
        updatePageState();
        
        // Initialize buttons with staggered animation
        requestAnimationFrame(() => {
          initButtonCharacterStagger();
        });
      }
    },
    {
      namespace: 'cms-page',
      afterEnter() {
        // Ensure Lenis is stopped on CMS page
        pauseLenis();
        
        // Update page state for back button handling
        updatePageState();
        
        // Initialize CMS page scripts in sequence for better performance
        requestAnimationFrame(() => {
          initButtonCharacterStagger();
          
          // Delay Scrollify initialization slightly for better performance
          setTimeout(() => {
            initScrollify();
          }, 100);
        });
      }
    }
  ]
});

// Initialize on first page load with optimized DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNavigation();
  // Get the current page namespace
  const container = document.querySelector('[data-barba="container"]');
  if (!container) return;
  
  const namespace = container.getAttribute('data-barba-namespace');
  if (!namespace) return;
  
  // Initialize page state for back button
  updatePageState();
  
  // Use requestAnimationFrame to defer initialization until after first paint
  requestAnimationFrame(() => {
    // Initialize appropriate scripts based on page type
    if (namespace === 'grid-page') {
      // Grid page - initialize Lenis and buttons
      initLenis();
      initButtonCharacterStagger();
    } else if (namespace === 'cms-page') {
      // CMS page scripts
      initButtonCharacterStagger();
      
      // Delay Scrollify initialization for better initial page load
      setTimeout(() => {
        initScrollify();
      }, 100);
    }
  });

  const imageTrail = initImageTrail({
    minWidth: 992,
    moveDistance: 12,
    stopDuration: 300,
    trailLength: 4
  });

  initAnimations();

  requestAnimationFrame(() => {
    initMarquees();
  });
});

// Cleanup on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
  if (lenis) {
    destroyLenis();
  }
});

// Track if animation has already run
let bottomFlexAnimated = false;

// Simple standalone function to animate bottom-flex elements
function animateBottomFlex() {
  // Check if already animated
  if (bottomFlexAnimated) return;
  
  // Find all bottom-flex elements
  const bottomFlexElements = document.querySelectorAll('.bottom-flex');
  
  if (!bottomFlexElements || bottomFlexElements.length === 0) return;
  
  // Mark as animated
  bottomFlexAnimated = true;
  
  // Set initial state
  gsap.set(bottomFlexElements, { 
    y: 200, 
    opacity: 0 
  });
  
  // Create the animation with a delay
  gsap.to(bottomFlexElements, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "expo.inOut",
    delay: 0.1,
    clearProps: "all", // This cleans up GSAP properties after animation completes
    onComplete: () => {
      // Reset flag after some time to allow re-animation if page changes
      setTimeout(() => {
        bottomFlexAnimated = false;
      }, 1000);
    }
  });
}

// Determine if we should run the animation based on page type
function checkAndAnimateForCMSPage() {
  // Check if we're on a CMS page
  const container = document.querySelector('[data-barba="container"]');
  if (container && container.getAttribute('data-barba-namespace') === 'cms-page') {
    // Wait for page to be fully loaded and then animate
    setTimeout(animateBottomFlex, 200);
  }
}

// Add this code at the end of your existing script
document.addEventListener('DOMContentLoaded', function() {
  // Direct page load - only animate if Barba is not active
  if (!window.barba || !window.barba.history || window.barba.history.size === 0) {
    checkAndAnimateForCMSPage();
  }
});

// Add listener for Barba transitions if Barba exists
if (window.barba) {
  // Use Barba's existing hooks without modifying your configuration
  barba.hooks.after((data) => {
    // Reset the animation flag when changing pages
    bottomFlexAnimated = false;
    
    // Only run on CMS pages
    if (data.next.namespace === 'cms-page') {
      // Wait for transition to complete and then animate
      setTimeout(animateBottomFlex, 50);
    }
  });
}
