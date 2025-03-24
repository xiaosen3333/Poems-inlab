/**
 * Configuration Service
 * 
 * This service provides functionality to load different configuration files based on URL parameters.
 */

import * as defaultConfig from '@/lib/config/appConfig';
import * as youcaihuaConfig from '@/lib/config/appConfig-youcaihua';
import * as chunxiaoConfig from '@/lib/config/appConfig-chunxiao';
import * as qingwaConfig from '@/lib/config/appConfig-qingwa';
import * as niaomingjianConfig from '@/lib/config/appConfig-niaomingjian';

export type ConfigName = 'default' | 'youcaihua' | 'chunxiao' | 'qingwa' | 'niaomingjian';

/**
 * Get configuration based on the provided name
 * @param configName The name of the configuration to load
 * @returns The requested configuration module
 */
export function getConfig(configName: ConfigName) {
  switch (configName) {
    case 'youcaihua':
      return youcaihuaConfig;
    case 'chunxiao':
      return chunxiaoConfig;
    case 'qingwa':
      return qingwaConfig;
    case 'niaomingjian':
      return niaomingjianConfig;
    default:
      return defaultConfig;
  }
}

/**
 * Get configuration name from URL query parameters
 * This should be used exclusively on the client side
 * @returns The config name from URL or 'default' if not specified
 */
export function getConfigNameFromUrl(): ConfigName {
  if (typeof window === 'undefined') {
    return 'default';
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const config = urlParams.get('config');
  
  console.log("URL config param:", config);
  
  if (config && ['youcaihua', 'chunxiao', 'qingwa', 'niaomingjian'].includes(config)) {
    return config as ConfigName;
  }
  
  return 'default';
}

/**
 * Load configuration based on URL query parameters with SSR safety
 * For proper SSR, use this with 'use client' components or in useEffect hooks
 * @returns The config module based on URL parameters
 */
export function loadConfigFromUrl() {
  // During SSR, always return the default config
  if (typeof window === 'undefined') {
    return defaultConfig;
  }
  
  const configName = getConfigNameFromUrl();
  console.log("Loading config:", configName);
  const config = getConfig(configName);
  return config;
}

/**
 * Load configuration with a specific config name (for server components)
 * @param configName The name of the configuration to load
 * @returns The requested configuration module
 */
export function loadConfig(configName: ConfigName = 'default') {
  return getConfig(configName);
}