import { Platform } from 'react-native';
import Color from 'color';

/**
 * Calculates the contrast ratio between two colors
 * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 * 
 * @param foreground - Foreground color (text)
 * @param background - Background color
 * @returns Contrast ratio (1:1 to 21:1)
 */
export const calculateContrastRatio = (foreground: string, background: string): number => {
  const fgColor = Color(foreground);
  const bgColor = Color(background);
  
  // Calculate luminance values
  const fgLuminance = fgColor.luminosity();
  const bgLuminance = bgColor.luminosity();
  
  // Calculate contrast ratio
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Checks if a contrast ratio meets WCAG 2.1 standards
 * 
 * @param ratio - Contrast ratio
 * @param level - Accessibility level ('AA' or 'AAA')
 * @param isLargeText - Whether the text is large (>=18pt or >=14pt bold)
 * @returns Whether the contrast meets the specified level
 */
export const meetsContrastStandard = (
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean => {
  if (level === 'AA') {
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  } else {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
};

/**
 * Checks if a color combination meets WCAG 2.1 standards
 * 
 * @param foreground - Foreground color (text)
 * @param background - Background color
 * @param level - Accessibility level ('AA' or 'AAA')
 * @param isLargeText - Whether the text is large (>=18pt or >=14pt bold)
 * @returns Whether the contrast meets the specified level
 */
export const checkColorContrast = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): { passes: boolean; ratio: number; recommendation?: string } => {
  const ratio = calculateContrastRatio(foreground, background);
  const passes = meetsContrastStandard(ratio, level, isLargeText);
  
  let recommendation;
  if (!passes) {
    // If contrast fails, try to suggest a darker/lighter version
    const fgColor = Color(foreground);
    const bgColor = Color(background);
    
    if (fgColor.luminosity() > bgColor.luminosity()) {
      // Foreground is lighter than background, make it lighter
      recommendation = `Try using ${fgColor.lighten(0.3).hex()} for foreground or ${bgColor.darken(0.3).hex()} for background`;
    } else {
      // Foreground is darker than background, make it darker
      recommendation = `Try using ${fgColor.darken(0.3).hex()} for foreground or ${bgColor.lighten(0.3).hex()} for background`;
    }
  }
  
  return { passes, ratio, recommendation };
};

/**
 * Common color combinations used in the app
 */
export const appColorCombinations = [
  { name: 'Primary Button', foreground: '#FFFFFF', background: '#007AFF' },
  { name: 'Secondary Button', foreground: '#007AFF', background: '#F2F2F7' },
  { name: 'Warning', foreground: '#FFFFFF', background: '#FF9500' },
  { name: 'Error', foreground: '#FFFFFF', background: '#FF3B30' },
  { name: 'Success', foreground: '#FFFFFF', background: '#34C759' },
  { name: 'Body Text', foreground: '#000000', background: '#FFFFFF' },
  { name: 'Secondary Text', foreground: '#8E8E93', background: '#FFFFFF' },
  { name: 'Dark Mode Body Text', foreground: '#FFFFFF', background: '#1C1C1E' },
  { name: 'Dark Mode Secondary Text', foreground: '#8E8E93', background: '#1C1C1E' },
];

/**
 * Verifies all app color combinations against WCAG standards
 * 
 * @param level - Accessibility level ('AA' or 'AAA')
 * @returns Audit results for each color combination
 */
export const verifyAppColorContrast = (level: 'AA' | 'AAA' = 'AA') => {
  return appColorCombinations.map(combo => {
    const normalTextResult = checkColorContrast(
      combo.foreground,
      combo.background,
      level,
      false
    );
    
    const largeTextResult = checkColorContrast(
      combo.foreground,
      combo.background,
      level,
      true
    );
    
    return {
      name: combo.name,
      foreground: combo.foreground,
      background: combo.background,
      normalText: {
        passes: normalTextResult.passes,
        ratio: normalTextResult.ratio.toFixed(2),
        recommendation: normalTextResult.recommendation,
      },
      largeText: {
        passes: largeTextResult.passes,
        ratio: largeTextResult.ratio.toFixed(2),
        recommendation: largeTextResult.recommendation,
      },
    };
  });
};
