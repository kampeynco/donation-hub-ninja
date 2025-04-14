
// Define all application routes as constants
export const ROUTES = {
  // Main routes
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Prospects routes
  PROSPECTS: {
    ROOT: '/prospects',
    PROSPECTS: '/prospects/prospects',
    DONORS: '/prospects/donors',
    MERGE: '/prospects/merge'
  },
  
  // Settings routes
  SETTINGS: {
    ROOT: '/settings',
    PROFILE: '/settings/profile',
    NOTIFICATIONS: '/settings/notifications',
    BILLING: '/settings/billing'
  },
  
  // Logs routes
  LOGS: {
    ROOT: '/logs',
    ALL: '/logs/all',
    DONORS: '/logs/donors',
    ACCOUNT: '/logs/account',
    SYSTEM: '/logs/system'
  },
  
  // Authentication routes
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup'
  }
};

export default ROUTES;
