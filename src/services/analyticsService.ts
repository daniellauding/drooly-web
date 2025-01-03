declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface TrackingConfig {
  name: string;
  description: string;
  events: string[];
  params: string[];
}

const TRACKING_CONFIGS: TrackingConfig[] = [
  {
    name: 'Authentication',
    description: 'User authentication events',
    events: ['login', 'sign_up', 'error'],
    params: ['method', 'error_type', 'error_message']
  },
  {
    name: 'Page Views',
    description: 'User navigation tracking',
    events: ['page_view'],
    params: ['page_name', 'path']
  },
  {
    name: 'Recipe Interactions',
    description: 'Recipe-related user actions',
    events: ['recipe_view', 'recipe_action'],
    params: ['recipe_id', 'action', 'user_type']
  },
  {
    name: 'Search',
    description: 'Search functionality usage',
    events: ['search'],
    params: ['query', 'result_count']
  },
  {
    name: 'User Interactions',
    description: 'General user engagement tracking',
    events: ['user_interaction'],
    params: ['action', 'details']
  },
  {
    name: 'Feature Usage',
    description: 'Feature adoption tracking',
    events: ['feature_usage'],
    params: ['feature', 'action', 'details']
  }
];

// Add these interfaces
interface UserProperties {
  userId?: string;
  userRole: UserRole;
  language: Language;
  isNewUser: boolean;
  isPremium?: boolean;
}

interface RecipeProperties {
  recipeId: string;
  recipeType: RecipeType[];
  language: Language;
  difficulty: 'easy' | 'medium' | 'hard';
  cookingTime: number; // in minutes
  creatorType: UserRole;
}

export const initializeAnalytics = () => {
  // Try GA tracking ID first, fallback to Firebase measurement ID
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
  const environment = import.meta.env.VITE_APP_ENV;

  console.group('🔍 Analytics Initialization');
  console.log('Environment:', environment);
  console.log('GA Tracking ID:', trackingId);
  
  console.group('📊 Active Tracking Configurations');
  TRACKING_CONFIGS.forEach(config => {
    console.log(`\n${config.name}:`);
    console.log('Description:', config.description);
    console.log('Events:', config.events);
    console.log('Parameters:', config.params);
  });
  console.groupEnd();
  
  if (!trackingId) {
    console.warn('⚠️ Google Analytics tracking ID not found');
    console.groupEnd();
    return;
  }

  // Create script elements
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${trackingId}', {
      app_version: '${environment}',
      environment: '${environment}'
    });
  `;

  // Append scripts to document head
  document.head.appendChild(script1);
  document.head.appendChild(script2);

  console.log('✅ Google Analytics initialized successfully');
  console.log('Environment settings:', {
    app_version: environment,
    environment: environment
  });
  console.groupEnd();
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (window.gtag) {
    const eventParams = {
      ...params,
      environment: import.meta.env.VITE_APP_ENV
    };
    
    console.log('📊 Tracking Event:', {
      name: eventName,
      params: eventParams
    });
    
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn('⚠️ Google Analytics not initialized - Event not tracked:', eventName);
  }
};

export const trackLogin = (method: string) => {
  trackEvent('login', {
    method,
    timestamp: new Date().toISOString()
  });
};

export const trackSignup = (method: string) => {
  trackEvent('sign_up', {
    method,
    timestamp: new Date().toISOString()
  });
};

export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    timestamp: new Date().toISOString()
  });
};

export const trackPageView = (pageName: string, params?: Record<string, any>) => {
  trackEvent('page_view', {
    page_name: pageName,
    ...params,
    timestamp: new Date().toISOString()
  });
};

export const trackRecipeAction = (action: 'create' | 'edit' | 'delete' | 'save' | 'share', recipeId: string) => {
  trackEvent('recipe_action', {
    action,
    recipe_id: recipeId,
    timestamp: new Date().toISOString()
  });
};

export const trackSearch = (query: string, resultCount: number) => {
  trackEvent('search', {
    query,
    result_count: resultCount,
    timestamp: new Date().toISOString()
  });
};

export const trackUserInteraction = (action: string, details?: Record<string, any>) => {
  trackEvent('user_interaction', {
    action,
    ...details,
    timestamp: new Date().toISOString()
  });
};

export const trackFeatureUsage = (feature: string, action: string, details?: Record<string, any>) => {
  trackEvent('feature_usage', {
    feature,
    action,
    ...details,
    timestamp: new Date().toISOString()
  });
};

export const setUserProperties = (props: UserProperties) => {
  if (window.gtag) {
    window.gtag('set', 'user_properties', {
      user_role: props.userRole,
      language: props.language,
      is_new_user: props.isNewUser,
      is_premium: props.isPremium || false,
      environment: import.meta.env.VITE_APP_ENV
    });
  }
};

// Add this to track user sessions
export const trackUserSession = (userId: string | null, sessionData: {
  isNewUser: boolean;
  userRole: string;
  lastLoginAt?: string;
}) => {
  trackEvent('user_session', {
    user_id: userId,
    is_new_user: sessionData.isNewUser,
    user_role: sessionData.userRole,
    last_login: sessionData.lastLoginAt,
    session_start: new Date().toISOString()
  });
};

// Add recipe tracking
export const trackRecipeCreation = (recipe: RecipeProperties) => {
  trackEvent('recipe_create', {
    recipe_id: recipe.recipeId,
    recipe_type: recipe.recipeType,
    language: recipe.language,
    difficulty: recipe.difficulty,
    cooking_time: recipe.cookingTime,
    creator_type: recipe.creatorType,
    timestamp: new Date().toISOString()
  });
};

// Track user counts by type
export const trackUserMetrics = (metrics: {
  total_users: number;
  active_users: number;
  user_types: Record<UserRole, number>;
  languages: Record<Language, number>;
}) => {
  trackEvent('user_metrics', {
    ...metrics,
    timestamp: new Date().toISOString()
  });
}; 