/**
 * Cheap Studio - Main Application JavaScript
 * A comprehensive web application with modern JavaScript practices
 */

'use strict';

// ==========================================================================
// Application State Management
// ==========================================================================

class AppState {
  constructor() {
    this.currentPage = 'dashboard';
    this.apiKey = '';
    this.selectedModel = 'gemini-2.5-flash-image-preview';
    this.prompt = '';
    this.images = {
      image1: null,
      image2: null
    };
    this.requestDetail = false;
    this.isGenerating = false;
    this.costEstimator = {
      width: 1024,
      height: 1024,
      duration: 5
    };
    this.dashboard = {
      plan: 'Starter · $10/mo',
      imagesUsed: 12,
      imagesLimit: 100,
      videoUsed: 9,
      videoLimit: 40
    };
  }

  // State persistence
  saveToStorage() {
    try {
      const stateToSave = {
        apiKey: this.apiKey,
        selectedModel: this.selectedModel,
        costEstimator: this.costEstimator
      };
      localStorage.setItem('cheapStudioState', JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }

  loadFromStorage() {
    try {
      const savedState = localStorage.getItem('cheapStudioState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        this.apiKey = parsed.apiKey || '';
        this.selectedModel = parsed.selectedModel || 'gemini-2.5-flash-image-preview';
        this.costEstimator = { ...this.costEstimator, ...parsed.costEstimator };
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
    }
  }
}

// ==========================================================================
// Utility Functions
// ==========================================================================

const Utils = {
  // Debounce function for performance optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for performance optimization
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Safe DOM query selector
  $(selector, context = document) {
    try {
      return context.querySelector(selector);
    } catch (error) {
      console.error('Invalid selector:', selector, error);
      return null;
    }
  },

  // Safe DOM query selector all
  $$(selector, context = document) {
    try {
      return Array.from(context.querySelectorAll(selector));
    } catch (error) {
      console.error('Invalid selector:', selector, error);
      return [];
    }
  },

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Validate file type
  isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  },

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Sanitize HTML
  sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }
};

// ==========================================================================
// Pricing Calculator
// ==========================================================================

class PricingCalculator {
  constructor() {
    this.IMAGE_PER_MP_USD = 0.003; // FLUX.1 schnell (per MP)
    this.VIDEO_PER_SEC_USD = 0.0333; // Framepack (per sec)
  }

  mpFromWH(width, height) {
    const raw = (width * height) / 1_000_000;
    return Math.ceil(raw); // Round up to nearest MP
  }

  estimateImageUSD(width, height) {
    return this.mpFromWH(width, height) * this.IMAGE_PER_MP_USD;
  }

  estimateVideoUSD(seconds) {
    return Math.max(0, seconds) * this.VIDEO_PER_SEC_USD;
  }

  formatUSD(value) {
    return `$${value.toFixed(value < 1 ? 4 : 2)}`;
  }
}

// ==========================================================================
// Navigation Manager
// ==========================================================================

class NavigationManager {
  constructor(appState) {
    this.appState = appState;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveNavigation();
  }

  bindEvents() {
    // Navigation links
    Utils.$$('.nav__link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) {
          this.navigateToPage(page);
        }
      });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      const page = e.state?.page || 'dashboard';
      this.navigateToPage(page, false);
    });

    // Handle hash changes for deep linking
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash && hash !== this.appState.currentPage) {
        this.navigateToPage(hash, false);
      }
    });
  }

  navigateToPage(page, pushState = true) {
    try {
      // Validate page exists
      const pageElement = Utils.$(`#${page}`);
      if (!pageElement) {
        console.warn(`Page "${page}" not found`);
        return;
      }

      // Update state
      this.appState.currentPage = page;

      // Hide all pages
      Utils.$$('.page').forEach(p => {
        p.classList.remove('page--active');
      });

      // Show target page
      pageElement.classList.add('page--active');

      // Update navigation
      this.updateActiveNavigation();

      // Update URL
      if (pushState) {
        const url = page === 'dashboard' ? '/' : `#${page}`;
        history.pushState({ page }, '', url);
      }

      // Update page title
      this.updatePageTitle(page);

      // Trigger page-specific initialization
      this.initializePage(page);

    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  updateActiveNavigation() {
    Utils.$$('.nav__link').forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.dataset.page === this.appState.currentPage) {
        link.classList.add('nav__link--active');
      }
    });
  }

  updatePageTitle(page) {
    const titles = {
      'dashboard': 'Dashboard - Cheap Studio',
      'generate-image': 'Image Generation - Cheap Studio',
      'generate-video': 'Video Generation - Cheap Studio',
      'usage': 'Usage Statistics - Cheap Studio'
    };
    document.title = titles[page] || 'Cheap Studio';
  }

  initializePage(page) {
    // Page-specific initialization logic
    switch (page) {
      case 'generate-image':
        if (window.imageGenerator) {
          window.imageGenerator.refreshUI();
        }
        break;
      case 'dashboard':
        if (window.dashboardManager) {
          window.dashboardManager.updateStats();
        }
        break;
    }
  }
}

// ==========================================================================
// Dashboard Manager
// ==========================================================================

class DashboardManager {
  constructor(appState) {
    this.appState = appState;
    this.init();
  }

  init() {
    this.updateStats();
  }

  updateStats() {
    try {
      const { dashboard } = this.appState;

      // Update plan info
      const planElement = Utils.$('#current-plan');
      if (planElement) {
        planElement.textContent = dashboard.plan;
      }

      // Update images stats
      this.updateProgressBar('images', dashboard.imagesUsed, dashboard.imagesLimit);

      // Update video stats
      this.updateProgressBar('video', dashboard.videoUsed, dashboard.videoLimit);

    } catch (error) {
      console.error('Dashboard update error:', error);
    }
  }

  updateProgressBar(type, used, limit) {
    const percentage = Math.min(100, Math.round((used / limit) * 100));

    // Update text values
    const usedElement = Utils.$(`#${type}-used`);
    const limitElement = Utils.$(`#${type}-limit`);
    const percentageElement = Utils.$(`#${type}-percentage`);
    const progressElement = Utils.$(`#${type}-progress`);

    if (usedElement) usedElement.textContent = used;
    if (limitElement) limitElement.textContent = limit;
    if (percentageElement) percentageElement.textContent = `${percentage}%`;
    if (progressElement) {
      progressElement.style.width = `${percentage}%`;
    }
  }
}

// ==========================================================================
// File Upload Manager
// ==========================================================================

class FileUploadManager {
  constructor() {
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Image upload slots
    this.setupUploadSlot('image-slot-1', 'image-1-input', 'image-1-filename', 'image1');
    this.setupUploadSlot('image-slot-2', 'image-2-input', 'image-2-filename', 'image2');

    // Swap button
    const swapButton = Utils.$('#swap-images');
    if (swapButton) {
      swapButton.addEventListener('click', () => this.swapImages());
    }
  }

  setupUploadSlot(slotId, inputId, filenameId, stateKey) {
    const slot = Utils.$(`#${slotId}`);
    const input = Utils.$(`#${inputId}`);
    const filenameDisplay = Utils.$(`#${filenameId}`);

    if (!slot || !input) return;

    // Click to upload
    slot.addEventListener('click', () => input.click());

    // Drag and drop
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.classList.add('upload-slot--dragover');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('upload-slot--dragover');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('upload-slot--dragover');
      this.handleFiles(e.dataTransfer.files, stateKey, filenameDisplay);
    });

    // File input change
    input.addEventListener('change', (e) => {
      this.handleFiles(e.target.files, stateKey, filenameDisplay);
    });
  }

  handleFiles(files, stateKey, filenameDisplay) {
    try {
      if (!files || files.length === 0) {
        this.clearFile(stateKey, filenameDisplay);
        return;
      }

      const file = files[0];

      // Validate file
      if (!Utils.isValidImageFile(file)) {
        this.showError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      if (file.size > this.maxFileSize) {
        this.showError(`File size must be less than ${Utils.formatFileSize(this.maxFileSize)}`);
        return;
      }

      // Update state and UI
      window.appState.images[stateKey] = file;
      if (filenameDisplay) {
        filenameDisplay.textContent = `${file.name} (${Utils.formatFileSize(file.size)})`;
        filenameDisplay.style.display = 'block';
      }

    } catch (error) {
      console.error('File handling error:', error);
      this.showError('Failed to process file');
    }
  }

  clearFile(stateKey, filenameDisplay) {
    window.appState.images[stateKey] = null;
    if (filenameDisplay) {
      filenameDisplay.textContent = '';
      filenameDisplay.style.display = 'none';
    }
  }

  swapImages() {
    const { images } = window.appState;
    const temp = images.image1;
    images.image1 = images.image2;
    images.image2 = temp;

    // Update UI
    const filename1 = Utils.$('#image-1-filename');
    const filename2 = Utils.$('#image-2-filename');

    if (filename1 && filename2) {
      const temp = filename1.textContent;
      filename1.textContent = filename2.textContent;
      filename2.textContent = temp;

      filename1.style.display = images.image1 ? 'block' : 'none';
      filename2.style.display = images.image2 ? 'block' : 'none';
    }
  }

  showError(message) {
    // Simple error display - could be enhanced with a proper notification system
    alert(message);
  }
}

// ==========================================================================
// Image Generator
// ==========================================================================

class ImageGenerator {
  constructor(appState, pricingCalculator) {
    this.appState = appState;
    this.pricingCalculator = pricingCalculator;
    this.init();
  }

  init() {
    this.bindEvents();
    this.refreshUI();
  }

  bindEvents() {
    // API Key input
    const apiKeyInput = Utils.$('#api-key');
    if (apiKeyInput) {
      apiKeyInput.addEventListener('input', Utils.debounce((e) => {
        this.appState.apiKey = e.target.value;
        this.appState.saveToStorage();
      }, 300));
    }

    // Model selection
    const modelSelect = Utils.$('#model-select');
    if (modelSelect) {
      modelSelect.addEventListener('change', (e) => {
        this.appState.selectedModel = e.target.value;
        this.appState.saveToStorage();
      });
    }

    // Prompt input
    const promptInput = Utils.$('#prompt-input');
    if (promptInput) {
      promptInput.addEventListener('input', (e) => {
        this.appState.prompt = e.target.value;
        this.updateGenerateButton();
      });
    }

    // Request detail checkbox
    const detailCheckbox = Utils.$('#request-detail');
    if (detailCheckbox) {
      detailCheckbox.addEventListener('change', (e) => {
        this.appState.requestDetail = e.target.checked;
      });
    }

    // Preset buttons
    Utils.$$('.preset-button').forEach(button => {
      button.addEventListener('click', () => {
        const preset = button.dataset.preset;
        if (preset) {
          this.applyPreset(preset);
        }
      });
    });

    // Control buttons
    const generateButton = Utils.$('#generate-image-btn');
    const clearButton = Utils.$('#clear-form');

    if (generateButton) {
      generateButton.addEventListener('click', () => this.generateImage());
    }

    if (clearButton) {
      clearButton.addEventListener('click', () => this.clearForm());
    }
  }

  refreshUI() {
    // Restore form values from state
    const apiKeyInput = Utils.$('#api-key');
    const modelSelect = Utils.$('#model-select');
    const promptInput = Utils.$('#prompt-input');
    const detailCheckbox = Utils.$('#request-detail');

    if (apiKeyInput) apiKeyInput.value = this.appState.apiKey;
    if (modelSelect) modelSelect.value = this.appState.selectedModel;
    if (promptInput) promptInput.value = this.appState.prompt;
    if (detailCheckbox) detailCheckbox.checked = this.appState.requestDetail;

    this.updateGenerateButton();
  }

  applyPreset(preset) {
    const promptInput = Utils.$('#prompt-input');
    if (promptInput) {
      const currentPrompt = promptInput.value.trim();
      const newPrompt = currentPrompt ? `${currentPrompt}\n${preset}` : preset;
      promptInput.value = newPrompt;
      this.appState.prompt = newPrompt;
      this.updateGenerateButton();
    }
  }

  updateGenerateButton() {
    const generateButton = Utils.$('#generate-image-btn');
    if (generateButton) {
      const hasPrompt = this.appState.prompt.trim().length > 0;
      generateButton.disabled = this.appState.isGenerating || !hasPrompt;
    }
  }

  async generateImage() {
    if (this.appState.isGenerating) return;

    try {
      this.setGeneratingState(true);

      // Simulate API call with delay
      await this.simulateGeneration();

      // Update output
      this.displayResult(`Generated preview for "${this.appState.prompt || 'your prompt'}" using ${this.appState.selectedModel}.`);

    } catch (error) {
      console.error('Generation error:', error);
      this.displayError('Failed to generate image. Please try again.');
    } finally {
      this.setGeneratingState(false);
    }
  }

  async simulateGeneration() {
    // Simulate network delay
    return new Promise(resolve => setTimeout(resolve, 900));
  }

  setGeneratingState(isGenerating) {
    this.appState.isGenerating = isGenerating;
    
    const generateButton = Utils.$('#generate-image-btn');
    const outputArea = Utils.$('#output-area');

    if (generateButton) {
      generateButton.disabled = isGenerating;
      generateButton.classList.toggle('button--loading', isGenerating);
    }

    if (outputArea && isGenerating) {
      outputArea.innerHTML = '<span class="output-area__placeholder">Generating preview...</span>';
    }

    this.updateGenerateButton();
  }

  displayResult(message) {
    const outputArea = Utils.$('#output-area');
    const outputControls = Utils.$('#output-controls');

    if (outputArea) {
      outputArea.innerHTML = `<span>${Utils.sanitizeHTML(message)}</span>`;
    }

    if (outputControls) {
      outputControls.style.display = 'flex';
    }
  }

  displayError(message) {
    const outputArea = Utils.$('#output-area');
    const outputControls = Utils.$('#output-controls');

    if (outputArea) {
      outputArea.innerHTML = `<span class="output-area__placeholder" style="color: var(--color-error);">${Utils.sanitizeHTML(message)}</span>`;
    }

    if (outputControls) {
      outputControls.style.display = 'none';
    }
  }

  clearForm() {
    // Clear form inputs
    const promptInput = Utils.$('#prompt-input');
    const detailCheckbox = Utils.$('#request-detail');
    const outputArea = Utils.$('#output-area');
    const outputControls = Utils.$('#output-controls');

    if (promptInput) promptInput.value = '';
    if (detailCheckbox) detailCheckbox.checked = false;

    // Clear state
    this.appState.prompt = '';
    this.appState.requestDetail = false;
    this.appState.images.image1 = null;
    this.appState.images.image2 = null;

    // Clear file displays
    const filename1 = Utils.$('#image-1-filename');
    const filename2 = Utils.$('#image-2-filename');

    if (filename1) {
      filename1.textContent = '';
      filename1.style.display = 'none';
    }
    if (filename2) {
      filename2.textContent = '';
      filename2.style.display = 'none';
    }

    // Clear output
    if (outputArea) {
      outputArea.innerHTML = '<span class="output-area__placeholder">Your results will display after you generate.</span>';
    }
    if (outputControls) {
      outputControls.style.display = 'none';
    }

    this.updateGenerateButton();
  }
}

// ==========================================================================
// Cost Estimator
// ==========================================================================

class CostEstimatorManager {
  constructor(appState, pricingCalculator) {
    this.appState = appState;
    this.pricingCalculator = pricingCalculator;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateCostDisplay();
  }

  bindEvents() {
    const widthInput = Utils.$('#width-input');
    const heightInput = Utils.$('#height-input');

    if (widthInput) {
      widthInput.addEventListener('input', Utils.debounce(() => {
        const value = parseInt(widthInput.value) || 1024;
        this.appState.costEstimator.width = Math.max(256, Math.min(2048, value));
        widthInput.value = this.appState.costEstimator.width;
        this.updateCostDisplay();
        this.appState.saveToStorage();
      }, 300));
    }

    if (heightInput) {
      heightInput.addEventListener('input', Utils.debounce(() => {
        const value = parseInt(heightInput.value) || 1024;
        this.appState.costEstimator.height = Math.max(256, Math.min(2048, value));
        heightInput.value = this.appState.costEstimator.height;
        this.updateCostDisplay();
        this.appState.saveToStorage();
      }, 300));
    }
  }

  updateCostDisplay() {
    const { width, height } = this.appState.costEstimator;
    const mp = this.pricingCalculator.mpFromWH(width, height);
    const cost = this.pricingCalculator.estimateImageUSD(width, height);

    const megapixelsElement = Utils.$('#megapixels');
    const costElement = Utils.$('#estimated-cost');

    if (megapixelsElement) {
      megapixelsElement.textContent = `${mp} MP`;
    }

    if (costElement) {
      costElement.textContent = this.pricingCalculator.formatUSD(cost);
    }
  }

  refreshUI() {
    const widthInput = Utils.$('#width-input');
    const heightInput = Utils.$('#height-input');

    if (widthInput) widthInput.value = this.appState.costEstimator.width;
    if (heightInput) heightInput.value = this.appState.costEstimator.height;

    this.updateCostDisplay();
  }
}

// ==========================================================================
// Performance Monitor
// ==========================================================================

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      domContentLoadedTime: 0,
      resourceLoadTime: 0
    };
    this.init();
  }

  init() {
    // Measure page load performance
    window.addEventListener('load', () => {
      this.measurePerformance();
    });

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        this.checkMemoryUsage();
      }, 30000); // Check every 30 seconds
    }
  }

  measurePerformance() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        this.metrics.resourceLoadTime = navigation.loadEventEnd - navigation.domContentLoadedEventEnd;

        console.log('Performance Metrics:', this.metrics);
      }
    } catch (error) {
      console.warn('Performance measurement failed:', error);
    }
  }

  checkMemoryUsage() {
    try {
      if (performance.memory) {
        const memoryInfo = {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
        };

        // Warn if memory usage is high
        if (memoryInfo.used > memoryInfo.limit * 0.8) {
          console.warn('High memory usage detected:', memoryInfo);
        }
      }
    } catch (error) {
      console.warn('Memory monitoring failed:', error);
    }
  }
}

// ==========================================================================
// Error Handler
// ==========================================================================

class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    // Global error handling
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'JavaScript Error');
    });

    // Promise rejection handling
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
    });
  }

  handleError(error, type = 'Error') {
    console.error(`${type}:`, error);

    // In production, you might want to send errors to a logging service
    if (process?.env?.NODE_ENV === 'production') {
      // Send to error tracking service
      // this.sendToErrorService(error, type);
    }

    // Show user-friendly error message for critical errors
    if (this.isCriticalError(error)) {
      this.showUserError('Something went wrong. Please refresh the page and try again.');
    }
  }

  isCriticalError(error) {
    // Define what constitutes a critical error
    const criticalPatterns = [
      /network/i,
      /fetch/i,
      /cors/i,
      /unauthorized/i
    ];

    return criticalPatterns.some(pattern => 
      pattern.test(error?.message || error?.toString() || '')
    );
  }

  showUserError(message) {
    // Simple error display - could be enhanced with a proper notification system
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-error);
      color: white;
      padding: 1rem;
      border-radius: var(--radius-md);
      z-index: var(--z-modal);
      max-width: 300px;
    `;

    document.body.appendChild(errorDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }
}

// ==========================================================================
// Application Initialization
// ==========================================================================

class App {
  constructor() {
    this.state = new AppState();
    this.pricingCalculator = new PricingCalculator();
    this.performanceMonitor = new PerformanceMonitor();
    this.errorHandler = new ErrorHandler();
    
    this.navigationManager = null;
    this.dashboardManager = null;
    this.fileUploadManager = null;
    this.imageGenerator = null;
    this.costEstimatorManager = null;
  }

  async init() {
    try {
      // Load saved state
      this.state.loadFromStorage();

      // Initialize managers
      this.navigationManager = new NavigationManager(this.state);
      this.dashboardManager = new DashboardManager(this.state);
      this.fileUploadManager = new FileUploadManager();
      this.imageGenerator = new ImageGenerator(this.state, this.pricingCalculator);
      this.costEstimatorManager = new CostEstimatorManager(this.state, this.pricingCalculator);

      // Make instances globally available for cross-component communication
      window.appState = this.state;
      window.navigationManager = this.navigationManager;
      window.dashboardManager = this.dashboardManager;
      window.imageGenerator = this.imageGenerator;
      window.costEstimatorManager = this.costEstimatorManager;

      // Handle initial navigation
      this.handleInitialNavigation();

      // Set up periodic state saving
      setInterval(() => {
        this.state.saveToStorage();
      }, 30000); // Save every 30 seconds

      console.log('Cheap Studio application initialized successfully');

    } catch (error) {
      console.error('Application initialization failed:', error);
      this.errorHandler.handleError(error, 'Initialization Error');
    }
  }

  handleInitialNavigation() {
    const hash = window.location.hash.slice(1);
    const initialPage = hash || 'dashboard';
    this.navigationManager.navigateToPage(initialPage, false);
  }
}

// ==========================================================================
// Application Startup
// ==========================================================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

async function initializeApp() {
  try {
    const app = new App();
    await app.init();
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
}

// ==========================================================================
// Service Worker Registration (for caching)
// ==========================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}