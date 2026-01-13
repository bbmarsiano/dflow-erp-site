/**
 * Utility function to get logo scale factor from settings
 * @param logoScale - Logo scale percentage string (e.g., "100", "85")
 * @returns Scale factor (e.g., 1.0 for 100%, 0.85 for 85%)
 */
export function getLogoScaleFactor(logoScale?: string | null): number {
  if (!logoScale) return 1.0;
  const scaleValue = parseFloat(logoScale);
  if (isNaN(scaleValue) || scaleValue < 50 || scaleValue > 150) return 1.0;
  return scaleValue / 100;
}

/**
 * Get logo scale style object for inline styles
 * @param logoScale - Logo scale percentage string
 * @returns Style object with transform
 */
export function getLogoScaleStyle(logoScale?: string | null): React.CSSProperties {
  const scaleFactor = getLogoScaleFactor(logoScale);
  return {
    transform: `scale(${scaleFactor})`,
    transformOrigin: 'left center',
  };
}

