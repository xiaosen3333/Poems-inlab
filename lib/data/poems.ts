// Re-export from config file for backward compatibility
import { PoemData, PoemKeyword, keywordsMap as defaultKeywordsMap, quietNightPoem as defaultQuietNightPoem } from "@/lib/config/appConfig";

// Use default exports - we can't use dynamic config here for SSR compatibility
export type { PoemData, PoemKeyword };
export const keywordsMap = defaultKeywordsMap;
export const quietNightPoem = defaultQuietNightPoem;