import { useState } from 'react';
import { Save } from 'lucide-react';
import type { ConsultingContent } from '../../types/cms';
import { adminService } from '../../services/adminService';

interface ConsultingEditorProps {
  content: ConsultingContent | null;
  onUpdate: () => void;
}

export function ConsultingEditor({ content, onUpdate }: ConsultingEditorProps) {
  const [localContent, setLocalContent] = useState<ConsultingContent | null>(content);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!localContent) return null;

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminService.updateConsultingContent(localContent);
      showMessage('Consulting section saved successfully');
      onUpdate();
    } catch (error) {
      console.error('Error saving consulting content:', error);
      showMessage('Error saving consulting content');
    } finally {
      setIsSaving(false);
    }
  };

  const addBulletPoint = (lang: 'en' | 'bg') => {
    const updated = { ...localContent };
    if (lang === 'en') {
      updated.bullet_points_en = [...updated.bullet_points_en, 'New point'];
      updated.bullet_points = updated.bullet_points_en;
    } else {
      updated.bullet_points_bg = [...updated.bullet_points_bg, 'Нова точка'];
    }
    setLocalContent(updated);
  };

  const removeBulletPoint = (lang: 'en' | 'bg', index: number) => {
    const updated = { ...localContent };
    if (lang === 'en') {
      updated.bullet_points_en = updated.bullet_points_en.filter((_, i) => i !== index);
      updated.bullet_points = updated.bullet_points_en;
    } else {
      updated.bullet_points_bg = updated.bullet_points_bg.filter((_, i) => i !== index);
    }
    setLocalContent(updated);
  };

  const updateBulletPoint = (lang: 'en' | 'bg', index: number, value: string) => {
    const updated = { ...localContent };
    if (lang === 'en') {
      updated.bullet_points_en[index] = value;
      updated.bullet_points = updated.bullet_points_en;
    } else {
      updated.bullet_points_bg[index] = value;
    }
    setLocalContent(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Consulting Section</h2>
        <p className="text-gray-600 mt-1">Edit the consulting services section content</p>
      </div>

      {saveMessage && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {saveMessage}
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-6 space-y-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title (English)
            </label>
            <input
              type="text"
              value={localContent.section_title_en}
              onChange={(e) => setLocalContent({
                ...localContent,
                section_title_en: e.target.value,
                section_title: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title (Bulgarian)
            </label>
            <input
              type="text"
              value={localContent.section_title_bg}
              onChange={(e) => setLocalContent({
                ...localContent,
                section_title_bg: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English)
            </label>
            <textarea
              value={localContent.description_en}
              onChange={(e) => setLocalContent({
                ...localContent,
                description_en: e.target.value,
                description: e.target.value
              })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Bulgarian)
            </label>
            <textarea
              value={localContent.description_bg}
              onChange={(e) => setLocalContent({
                ...localContent,
                description_bg: e.target.value
              })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Bullet Points (English)
              </label>
              <button
                onClick={() => addBulletPoint('en')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Point
              </button>
            </div>
            <div className="space-y-2">
              {localContent.bullet_points_en.map((point, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updateBulletPoint('en', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeBulletPoint('en', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Bullet Points (Bulgarian)
              </label>
              <button
                onClick={() => addBulletPoint('bg')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Point
              </button>
            </div>
            <div className="space-y-2">
              {localContent.bullet_points_bg.map((point, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updateBulletPoint('bg', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeBulletPoint('bg', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTA Button Text (English)
            </label>
            <input
              type="text"
              value={localContent.cta_text_en}
              onChange={(e) => setLocalContent({
                ...localContent,
                cta_text_en: e.target.value,
                cta_text: e.target.value
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTA Button Text (Bulgarian)
            </label>
            <input
              type="text"
              value={localContent.cta_text_bg}
              onChange={(e) => setLocalContent({
                ...localContent,
                cta_text_bg: e.target.value
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
          <span>{isSaving ? 'Saving...' : 'Save Consulting Section'}</span>
        </button>
      </div>
    </div>
  );
}
