// Re-export from config file for backward compatibility
import { VisualElement, visualElements as defaultVisualElements, uiConstants as defaultUiConstants } from "@/lib/config/appConfig";

// Use default exports - we can't use dynamic config here for SSR compatibility
export type { VisualElement };
export const visualElements = defaultVisualElements;
export const uiConstants = defaultUiConstants;