import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import type { SiteSettings } from '../../types/cms';

interface DesignSettingsProps {
  settings: SiteSettings | null;
  onUpdate: () => void;
}

export function DesignSettings({ settings, onUpdate }: DesignSettingsProps) {
  const [logoScale, setLogoScale] = useState<string>('100');
  const [accentColor, setAccentColor] = useState<string>('#de3c3c');
  
  // Button primary
  const [buttonPrimaryColor, setButtonPrimaryColor] = useState<string>('#2563eb');
  const [buttonPrimaryGradientFrom, setButtonPrimaryGradientFrom] = useState<string>('#2563eb');
  const [buttonPrimaryGradientTo, setButtonPrimaryGradientTo] = useState<string>('#14b8a6');
  const [buttonPrimaryGradientEnabled, setButtonPrimaryGradientEnabled] = useState<boolean>(true);
  
  // Button secondary
  const [buttonSecondaryColor, setButtonSecondaryColor] = useState<string>('#64748b');
  const [buttonSecondaryGradientFrom, setButtonSecondaryGradientFrom] = useState<string>('#64748b');
  const [buttonSecondaryGradientTo, setButtonSecondaryGradientTo] = useState<string>('#475569');
  const [buttonSecondaryGradientEnabled, setButtonSecondaryGradientEnabled] = useState<boolean>(false);
  
  // Hero design
  const [heroTitleColor, setHeroTitleColor] = useState<string>('#ffffff');
  const [heroSubtitleColor, setHeroSubtitleColor] = useState<string>('#dbeafe');
  const [heroSloganColor, setHeroSloganColor] = useState<string>('#ffffff');
  const [heroTitleFontWeight, setHeroTitleFontWeight] = useState<string>('bold');
  
  // Site slogan design (under logo)
  const [sloganColor, setSloganColor] = useState<string>('#ffffff');
  const [sloganFontFamily, setSloganFontFamily] = useState<string>('system');
  const [sloganFontBold, setSloganFontBold] = useState<boolean>(true);
  const [sloganFontItalic, setSloganFontItalic] = useState<boolean>(false);
  const [sloganFontUnderline, setSloganFontUnderline] = useState<boolean>(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setLogoScale(settings.logo_scale || '100');
      setAccentColor(settings.accent_color || '#de3c3c');
      
      // Button primary
      setButtonPrimaryColor(settings.button_primary_color || '#2563eb');
      setButtonPrimaryGradientFrom(settings.button_primary_gradient_from || '#2563eb');
      setButtonPrimaryGradientTo(settings.button_primary_gradient_to || '#14b8a6');
      setButtonPrimaryGradientEnabled(settings.button_primary_gradient_enabled ?? true);
      
      // Button secondary
      setButtonSecondaryColor(settings.button_secondary_color || '#64748b');
      setButtonSecondaryGradientFrom(settings.button_secondary_gradient_from || '#64748b');
      setButtonSecondaryGradientTo(settings.button_secondary_gradient_to || '#475569');
      setButtonSecondaryGradientEnabled(settings.button_secondary_gradient_enabled ?? false);
      
      // Hero design
      setHeroTitleColor(settings.hero_title_color || '#ffffff');
      setHeroSubtitleColor(settings.hero_subtitle_color || '#dbeafe');
      setHeroSloganColor(settings.hero_slogan_color || '#ffffff');
      setHeroTitleFontWeight(settings.hero_title_font_weight || 'bold');
      
      // Site slogan design
      setSloganColor(settings.slogan_color || '#ffffff');
      setSloganFontFamily(settings.slogan_font_family || 'system');
      setSloganFontBold(settings.slogan_font_bold ?? true);
      setSloganFontItalic(settings.slogan_font_italic ?? false);
      setSloganFontUnderline(settings.slogan_font_underline ?? false);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      await adminService.updateSiteSettings({
        id: settings.id,
        logo_scale: logoScale,
        accent_color: accentColor,
        button_primary_color: buttonPrimaryColor,
        button_primary_gradient_from: buttonPrimaryGradientFrom,
        button_primary_gradient_to: buttonPrimaryGradientTo,
        button_primary_gradient_enabled: buttonPrimaryGradientEnabled,
        button_secondary_color: buttonSecondaryColor,
        button_secondary_gradient_from: buttonSecondaryGradientFrom,
        button_secondary_gradient_to: buttonSecondaryGradientTo,
        button_secondary_gradient_enabled: buttonSecondaryGradientEnabled,
        hero_title_color: heroTitleColor,
        hero_subtitle_color: heroSubtitleColor,
        hero_slogan_color: heroSloganColor,
        hero_title_font_weight: heroTitleFontWeight,
        slogan_color: sloganColor,
        slogan_font_family: sloganFontFamily,
        slogan_font_bold: sloganFontBold,
        slogan_font_italic: sloganFontItalic,
        slogan_font_underline: sloganFontUnderline,
      });

      setSaveMessage('Design settings saved successfully!');
      onUpdate();
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving design settings:', error);
      setSaveMessage('Error saving design settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLogoScale('100');
    setAccentColor('#de3c3c');
    setButtonPrimaryColor('#2563eb');
    setButtonPrimaryGradientFrom('#2563eb');
    setButtonPrimaryGradientTo('#14b8a6');
    setButtonPrimaryGradientEnabled(true);
    setButtonSecondaryColor('#64748b');
    setButtonSecondaryGradientFrom('#64748b');
    setButtonSecondaryGradientTo('#475569');
    setButtonSecondaryGradientEnabled(false);
    setHeroTitleColor('#ffffff');
    setHeroSubtitleColor('#dbeafe');
    setHeroSloganColor('#ffffff');
    setHeroTitleFontWeight('bold');
    setSloganColor('#ffffff');
    setSloganFontFamily('system');
    setSloganFontBold(true);
    setSloganFontItalic(false);
    setSloganFontUnderline(false);
    setSaveMessage('');
  };
  
  const handleResetButtonPrimary = () => {
    setButtonPrimaryColor('#2563eb');
    setButtonPrimaryGradientFrom('#2563eb');
    setButtonPrimaryGradientTo('#14b8a6');
    setButtonPrimaryGradientEnabled(true);
  };
  
  const handleResetButtonSecondary = () => {
    setButtonSecondaryColor('#64748b');
    setButtonSecondaryGradientFrom('#64748b');
    setButtonSecondaryGradientTo('#475569');
    setButtonSecondaryGradientEnabled(false);
  };
  
  const handleResetHero = () => {
    setHeroTitleColor('#ffffff');
    setHeroSubtitleColor('#dbeafe');
    setHeroSloganColor('#ffffff');
    setHeroTitleFontWeight('bold');
  };
  
  const handleResetSlogan = () => {
    setSloganColor('#ffffff');
    setSloganFontFamily('system');
    setSloganFontBold(true);
    setSloganFontItalic(false);
    setSloganFontUnderline(false);
  };
  
  const validateHexColor = (value: string): boolean => {
    return value === '' || /^#[0-9A-Fa-f]{6}$/.test(value);
  };

  const handleLogoScaleChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 50 && num <= 150) {
      setLogoScale(value);
    } else if (value === '') {
      setLogoScale('');
    }
  };

  const handleAccentColorChange = (value: string) => {
    // Basic hex color validation
    if (value.match(/^#[0-9A-Fa-f]{6}$/) || value === '') {
      setAccentColor(value);
    }
  };

  if (!settings) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Design & Appearance</h2>
        <p className="text-gray-600 mt-1">Customize the visual appearance of your site</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Logo Scale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo Scale (%)
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Adjust the size of the logo. Range: 50% - 150%. Default: 100%
          </p>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="50"
              max="150"
              value={logoScale || '100'}
              onChange={(e) => handleLogoScaleChange(e.target.value)}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              min="50"
              max="150"
              value={logoScale || '100'}
              onChange={(e) => handleLogoScaleChange(e.target.value)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
            />
            <span className="text-sm text-gray-600">%</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Preview: {logoScale || '100'}% ({logoScale ? (parseInt(logoScale, 10) / 100).toFixed(2) : '1.00'}x scale)
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accent Color
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Primary brand color used for buttons, links, and accents. Default: #de3c3c
          </p>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              value={accentColor || '#de3c3c'}
              onChange={(e) => handleAccentColorChange(e.target.value)}
              className="w-16 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={accentColor || '#de3c3c'}
              onChange={(e) => handleAccentColorChange(e.target.value)}
              placeholder="#de3c3c"
              pattern="^#[0-9A-Fa-f]{6}$"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>
          {accentColor && !validateHexColor(accentColor) && (
            <div className="mt-2 text-xs text-red-600">
              Please enter a valid hex color (e.g., #de3c3c)
            </div>
          )}
        </div>

        {/* Button Primary Styles */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Button Styles</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={buttonPrimaryGradientEnabled}
                  onChange={(e) => setButtonPrimaryGradientEnabled(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Enable Gradient</span>
              </label>
              <button
                onClick={handleResetButtonPrimary}
                className="text-xs text-gray-600 hover:text-gray-900 underline"
              >
                Reset to Default
              </button>
            </div>
            
            {buttonPrimaryGradientEnabled ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gradient From</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={buttonPrimaryGradientFrom}
                      onChange={(e) => setButtonPrimaryGradientFrom(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={buttonPrimaryGradientFrom}
                      onChange={(e) => validateHexColor(e.target.value) && setButtonPrimaryGradientFrom(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gradient To</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={buttonPrimaryGradientTo}
                      onChange={(e) => setButtonPrimaryGradientTo(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={buttonPrimaryGradientTo}
                      onChange={(e) => validateHexColor(e.target.value) && setButtonPrimaryGradientTo(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solid Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={buttonPrimaryColor}
                    onChange={(e) => setButtonPrimaryColor(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttonPrimaryColor}
                    onChange={(e) => validateHexColor(e.target.value) && setButtonPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Button Secondary Styles */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Secondary Button Styles</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={buttonSecondaryGradientEnabled}
                  onChange={(e) => setButtonSecondaryGradientEnabled(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Enable Gradient</span>
              </label>
              <button
                onClick={handleResetButtonSecondary}
                className="text-xs text-gray-600 hover:text-gray-900 underline"
              >
                Reset to Default
              </button>
            </div>
            
            {buttonSecondaryGradientEnabled ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gradient From</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={buttonSecondaryGradientFrom}
                      onChange={(e) => setButtonSecondaryGradientFrom(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={buttonSecondaryGradientFrom}
                      onChange={(e) => validateHexColor(e.target.value) && setButtonSecondaryGradientFrom(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gradient To</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={buttonSecondaryGradientTo}
                      onChange={(e) => setButtonSecondaryGradientTo(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={buttonSecondaryGradientTo}
                      onChange={(e) => validateHexColor(e.target.value) && setButtonSecondaryGradientTo(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solid Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={buttonSecondaryColor}
                    onChange={(e) => setButtonSecondaryColor(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttonSecondaryColor}
                    onChange={(e) => validateHexColor(e.target.value) && setButtonSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hero Design Styles */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section Design</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={heroTitleColor}
                  onChange={(e) => setHeroTitleColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={heroTitleColor}
                  onChange={(e) => validateHexColor(e.target.value) && setHeroTitleColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={heroSubtitleColor}
                  onChange={(e) => setHeroSubtitleColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={heroSubtitleColor}
                  onChange={(e) => validateHexColor(e.target.value) && setHeroSubtitleColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slogan Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={heroSloganColor}
                  onChange={(e) => setHeroSloganColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={heroSloganColor}
                  onChange={(e) => validateHexColor(e.target.value) && setHeroSloganColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title Font Weight</label>
              <select
                value={heroTitleFontWeight}
                onChange={(e) => setHeroTitleFontWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
                <option value="extrabold">Extra Bold</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleResetHero}
              className="text-xs text-gray-600 hover:text-gray-900 underline"
            >
              Reset Hero to Defaults
            </button>
          </div>
        </div>

        {/* Site Slogan Design (under logo) */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Slogan Design (Under Logo)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Control the appearance of the site slogan text displayed under the logo in the header.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={sloganColor}
                  onChange={(e) => setSloganColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={sloganColor}
                  onChange={(e) => validateHexColor(e.target.value) && setSloganColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={sloganFontFamily}
                onChange={(e) => setSloganFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="system">System Default</option>
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </div>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sloganFontBold}
                  onChange={(e) => setSloganFontBold(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Bold</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sloganFontItalic}
                  onChange={(e) => setSloganFontItalic(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Italic</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sloganFontUnderline}
                  onChange={(e) => setSloganFontUnderline(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Underline</span>
              </label>
            </div>
            <div>
              <button
                onClick={handleResetSlogan}
                className="text-xs text-gray-600 hover:text-gray-900 underline"
              >
                Reset Slogan to Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={isSaving || !logoScale || !accentColor || !accentColor.match(/^#[0-9A-Fa-f]{6}$/)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Design Settings'}
          </button>
          
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Reset to Defaults
          </button>

          {saveMessage && (
            <span className={`text-sm font-medium ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      {/* Preview Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Changes will be visible immediately after saving. Logo scale affects the header logo, and accent color is applied to primary buttons and key accent elements throughout the site.
        </p>
      </div>
    </div>
  );
}

