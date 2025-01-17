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
    params: ['recipe_id', 'action', 'user_role']
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

// User Types
export type UserRole = 
  | 'anonymous'      // Not logged in
  | 'registered'     // Basic user
  | 'chef'          // Verified chef
  | 'admin'         // Administrator
  | 'moderator';    // Content moderator

// Languages
export type Language = 
  | 'sv_SE'  // Swedish
  | 'en_US'  // English (US)
  | 'no_NO'  // Norwegian
  | 'da_DK'  // Danish
  | 'fi_FI'; // Finnish

// Recipe Types
export type RecipeType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'snack'
  | 'drink'
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'lactose_free';

// Recipe Difficulty
export type RecipeDifficulty = 'easy' | 'medium' | 'hard';

// Recipe Categories (for filtering/searching)
export type RecipeCategory =
  | 'quick'         // Under 30 mins
  | 'budget'        // Budget-friendly
  | 'family'        // Family-friendly
  | 'party'         // Party food
  | 'healthy'       // Healthy options
  | 'seasonal';     // Seasonal recipes

// User Interaction Types
export type UserInteractionType =
  | 'view'          // Viewing content
  | 'create'        // Creating content
  | 'edit'          // Editing content
  | 'delete'        // Deleting content
  | 'save'          // Saving/bookmarking
  | 'share'         // Sharing content
  | 'rate'          // Rating content
  | 'comment';      // Commenting

// Feature Types (for tracking feature usage)
export type FeatureType =
  | 'search'        // Recipe search
  | 'filter'        // Recipe filtering
  | 'shopping_list' // Shopping list
  | 'meal_plan'     // Meal planning
  | 'favorites'     // Favorites/bookmarks
  | 'sharing'       // Social sharing
  | 'printing';     // Recipe printing

// Update interfaces with new types
export interface UserProperties {
  userId: string;
  userRole: string;
  isVerified?: boolean;
}

export interface SessionData {
  isNewUser: boolean;
  email?: string;
  userRole?: string;
  lastLoginAt?: string;
}

interface RecipeProperties {
  recipeId: string;
  recipeType: RecipeType[];
  category: RecipeCategory[];
  language: Language;
  difficulty: RecipeDifficulty;
  cookingTime: number; // in minutes
  creatorType: UserRole;
  ingredients: number; // number of ingredients
  steps: number;      // number of steps
  cuisine?: string;   // e.g., 'italian', 'thai'
}

// Analytics Event Types
export type AnalyticsEventType =
  | 'page_view'
  | 'recipe_view'
  | 'recipe_create'
  | 'recipe_edit'
  | 'recipe_delete'
  | 'user_login'
  | 'user_signup'
  | 'user_logout'
  | 'search'
  | 'filter_use'
  | 'error'
  | 'feature_use';

// Analytics Event Parameters
export interface AnalyticsEventParams {
  timestamp?: string;
  environment?: string;
  user_role?: UserRole;
  language?: Language;
  [key: string]: any;
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

export const trackEvent = (eventName: string, params?: AnalyticsEventParams) => {
  if (window.gtag) {
    const eventParams: AnalyticsEventParams = {
      environment: import.meta.env.VITE_APP_ENV,
      timestamp: new Date().toISOString(),
      ...params
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

// Update tracking functions to use the base event params
const createEventParams = (params: Record<string, any>): AnalyticsEventParams => ({
  environment: import.meta.env.VITE_APP_ENV,
  timestamp: new Date().toISOString(),
  ...params
});

export const trackLogin = (method: string) => {
  console.group('🔐 Login Event');
  console.log('Method:', method);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();

  trackEvent('login', createEventParams({ method }));
};

export const trackSignup = (method: string) => {
  trackEvent('sign_up', createEventParams({ method }));
};

export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('error', createEventParams({
    error_type: errorType,
    error_message: errorMessage
  }));
};

export const trackPageView = (pageName: string, params?: Record<string, any>) => {
  trackEvent('page_view', createEventParams({
    page_name: pageName,
    ...params
  }));
};

export const trackRecipeAction = (action: 'create' | 'edit' | 'delete' | 'save' | 'share', recipeId: string) => {
  trackEvent('recipe_action', createEventParams({
    action,
    recipe_id: recipeId
  }));
};

export const trackSearch = (query: string, resultCount: number) => {
  trackEvent('search', createEventParams({
    query,
    result_count: resultCount
  }));
};

export const trackUserInteraction = (action: string, details?: Record<string, any>) => {
  trackEvent('user_interaction', createEventParams({
    action,
    ...details
  }));
};

export const trackFeatureUsage = (feature: string, action: string, details?: Record<string, any>) => {
  trackEvent('feature_usage', createEventParams({
    feature,
    action,
    ...details
  }));
};

export const setUserProperties = (props: UserProperties) => {
  window.gtag('set', 'user_properties', props);
};

// Add this to track user sessions
export const trackUserSession = (userId: string | null, sessionData: SessionData) => {
  if (!userId) return;
  
  // Track session data
  window.gtag('event', 'user_session', {
    user_id: userId,
    ...sessionData,
    timestamp: new Date().toISOString()
  });
};

// Add recipe tracking
export const trackRecipeCreation = (recipe: RecipeProperties) => {
  trackEvent('recipe_create', createEventParams({
    recipe_id: recipe.recipeId,
    recipe_type: recipe.recipeType,
    language: recipe.language,
    difficulty: recipe.difficulty,
    cooking_time: recipe.cookingTime,
    creator_type: recipe.creatorType
  }));
};

// Track user counts by type
export const trackUserMetrics = (metrics: {
  total_users: number;
  active_users: number;
  user_types: Record<UserRole, number>;
  languages: Record<Language, number>;
}) => {
  trackEvent('user_metrics', createEventParams(metrics));
}; 