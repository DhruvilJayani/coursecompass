/**
 * Environment configuration with validation
 */

interface EnvConfig {
  apiBaseUrl: string;
}

/**
 * Validates and exports environment variables
 * @throws Error if required environment variables are missing
 */
function validateEnv(): EnvConfig {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "VITE_API_BASE_URL is not defined. Please create a .env file with VITE_API_BASE_URL=http://localhost:3000/api"
    );
  }

  return {
    apiBaseUrl,
  };
}

export const env = validateEnv();
