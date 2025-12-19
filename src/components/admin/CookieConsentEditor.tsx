import { useState } from 'react';
import { Save } from 'lucide-react';
import type { CookieConsentSettings } from '../../types/cms';
import { adminService } from '../../services/adminService';

interface CookieConsentEditorProps {
  settings: CookieConsentSettings | null;
  onUpdate: () => void;
}

export function CookieConsentEditor({ settings, onUpdate }: CookieConsentEditorProps) {
  const [localSettings, setLocalSettings] = useState<CookieConsentSettings | null>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!localSettings) return null;

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminService.updateCookieConsentSettings(localSettings);
      showMessage('Cookie consent settings saved successfully');
      onUpdate();
    } catch (error) {
      console.error('Error saving cookie settings:', error);
      showMessage('Error saving cookie settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cookie Consent Banner</h2>
        <p className="text-gray-600 mt-1">Configure the cookie consent popup displayed to visitors</p>
      </div>

      {saveMessage && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {saveMessage}
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-6 space-y-6 bg-white">
        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
          <input
            type="checkbox"
            id="is-enabled"
            checked={localSettings.is_enabled}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              is_enabled: e.target.checked
            })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is-enabled" className="text-base font-medium text-gray-900">
            Enable Cookie Consent Banner
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (English)
            </label>
            <input
              type="text"
              value={localSettings.title_en}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                title_en: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Bulgarian)
            </label>
            <input
              type="text"
              value={localSettings.title_bg}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                title_bg: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (English)
            </label>
            <textarea
              value={localSettings.message_en}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                message_en: e.target.value
              })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Bulgarian)
            </label>
            <textarea
              value={localSettings.message_bg}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                message_bg: e.target.value
              })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accept Button Text (English)
            </label>
            <input
              type="text"
              value={localSettings.accept_button_en}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                accept_button_en: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accept Button Text (Bulgarian)
            </label>
            <input
              type="text"
              value={localSettings.accept_button_bg}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                accept_button_bg: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decline Button Text (English)
            </label>
            <input
              type="text"
              value={localSettings.decline_button_en}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                decline_button_en: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decline Button Text (Bulgarian)
            </label>
            <input
              type="text"
              value={localSettings.decline_button_bg}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                decline_button_bg: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learn More Link Text (English)
            </label>
            <input
              type="text"
              value={localSettings.learn_more_text_en}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                learn_more_text_en: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learn More Link Text (Bulgarian)
            </label>
            <input
              type="text"
              value={localSettings.learn_more_text_bg}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                learn_more_text_bg: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Cookie Settings'}</span>
        </button>
      </div>
    </div>
  );
}
