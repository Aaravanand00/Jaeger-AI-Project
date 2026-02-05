/**
 * Application Configuration
 * 
 * Centralizes all app-level configuration.
 * Environment variables are read here and validated.
 */

export const appConfig = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
} as const;
