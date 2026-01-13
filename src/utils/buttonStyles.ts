import type { SiteSettings } from '../types/cms';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonStyleResult {
  background: string;
  backgroundColor?: string;
}

/**
 * Get button style based on settings
 * @param settings - Site settings
 * @param variant - Button variant (primary or secondary)
 * @returns Style object with background
 */
export function getButtonStyle(
  settings: SiteSettings | null,
  variant: ButtonVariant = 'primary'
): ButtonStyleResult {
  if (!settings) {
    // Default fallback
    if (variant === 'primary') {
      return {
        background: 'linear-gradient(to right, #2563eb, #14b8a6)',
      };
    }
    return {
      backgroundColor: '#64748b',
    };
  }

  // Handle text boolean values ('true'/'false') from database
  const gradientEnabledStr = variant === 'primary'
    ? settings.button_primary_gradient_enabled
    : settings.button_secondary_gradient_enabled;
  
  // Convert text boolean to actual boolean
  const gradientEnabled = typeof gradientEnabledStr === 'string'
    ? gradientEnabledStr === 'true'
    : gradientEnabledStr === true;

  if (gradientEnabled) {
    const from = variant === 'primary'
      ? settings.button_primary_gradient_from || '#2563eb'
      : settings.button_secondary_gradient_from || '#64748b';
    const to = variant === 'primary'
      ? settings.button_primary_gradient_to || '#14b8a6'
      : settings.button_secondary_gradient_to || '#475569';

    return {
      background: `linear-gradient(to right, ${from}, ${to})`,
    };
  } else {
    const color = variant === 'primary'
      ? settings.button_primary_color || '#2563eb'
      : settings.button_secondary_color || '#64748b';

    return {
      backgroundColor: color,
    };
  }
}

