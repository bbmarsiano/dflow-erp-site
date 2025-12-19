import { useState, useEffect } from 'react';
import { Save, Mail, Key, Lock } from 'lucide-react';
import type { SMTPSettings } from '../../types/cms';
import { adminService } from '../../services/adminService';

export function SMTPSettingsEditor() {
  const [settings, setSettings] = useState<SMTPSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await adminService.getSMTPSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading SMTP settings:', error);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    setSuccessMessage('');

    try {
      await adminService.updateSMTPSettings(settings);
      setSuccessMessage('SMTP settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving SMTP settings:', error);
      alert('Error saving SMTP settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SMTP & reCAPTCHA Settings</h2>
          <p className="text-sm text-gray-600 mt-1">Configure email delivery and spam protection</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-center space-x-2 text-gray-900 font-semibold">
          <Mail size={20} />
          <h3>SMTP Server Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtp_host}
              onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="smtp.gmail.com"
            />
            <p className="text-xs text-gray-500 mt-1">Gmail: smtp.gmail.com</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.smtp_port}
              onChange={(e) => setSettings({ ...settings, smtp_port: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="587"
            />
            <p className="text-xs text-gray-500 mt-1">TLS: 587, SSL: 465</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Username (Email)
            </label>
            <input
              type="email"
              value={settings.smtp_user}
              onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your-email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Password / App Password
            </label>
            <input
              type="password"
              value={settings.smtp_password}
              onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              For Gmail, use an <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">App Password</a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email
            </label>
            <input
              type="email"
              value={settings.from_email}
              onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="noreply@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Name
            </label>
            <input
              type="text"
              value={settings.from_name}
              onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="DFlow ERP"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="smtp_secure"
            checked={settings.smtp_secure}
            onChange={(e) => setSettings({ ...settings, smtp_secure: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="smtp_secure" className="text-sm font-medium text-gray-700">
            Use TLS/SSL (Recommended)
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-center space-x-2 text-gray-900 font-semibold">
          <Lock size={20} />
          <h3>Google reCAPTCHA v2 Settings</h3>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-2">How to get reCAPTCHA keys:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Visit <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer" className="underline">Google reCAPTCHA Admin</a></li>
            <li>Click "+" to register a new site</li>
            <li>Choose "reCAPTCHA v2" → "I'm not a robot" Checkbox</li>
            <li>Add your domain (e.g., localhost for testing)</li>
            <li>Copy the Site Key and Secret Key below</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Key size={16} />
                <span>reCAPTCHA Site Key (Public)</span>
              </div>
            </label>
            <input
              type="text"
              value={settings.recaptcha_site_key}
              onChange={(e) => setSettings({ ...settings, recaptcha_site_key: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="6Lc..."
            />
            <p className="text-xs text-gray-500 mt-1">Used on the frontend (visible to users)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Lock size={16} />
                <span>reCAPTCHA Secret Key (Private)</span>
              </div>
            </label>
            <input
              type="password"
              value={settings.recaptcha_secret_key}
              onChange={(e) => setSettings({ ...settings, recaptcha_secret_key: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="6Lc..."
            />
            <p className="text-xs text-gray-500 mt-1">Used on the backend (kept secure)</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Security Note:</strong> SMTP credentials are stored securely in the database. For production use with Gmail,
          create an <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="underline font-medium">App Password</a> instead
          of using your regular password. Enable 2-Step Verification first in your Google Account settings.
        </p>
      </div>
    </div>
  );
}
