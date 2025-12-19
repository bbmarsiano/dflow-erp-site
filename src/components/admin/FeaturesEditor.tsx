import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { FeatureCard } from '../../types/cms';
import { adminService } from '../../services/adminService';

interface FeaturesEditorProps {
  features: FeatureCard[];
  onUpdate: () => void;
}

export function FeaturesEditor({ features, onUpdate }: FeaturesEditorProps) {
  const [localFeatures, setLocalFeatures] = useState<FeatureCard[]>(features);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSave = async (feature: FeatureCard) => {
    setIsSaving(true);
    try {
      await adminService.updateFeatureCard(feature.id, feature);
      showMessage('Feature saved successfully');
      onUpdate();
    } catch (error) {
      console.error('Error saving feature:', error);
      showMessage('Error saving feature');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    setIsSaving(true);
    try {
      await adminService.deleteFeatureCard(id);
      showMessage('Feature deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting feature:', error);
      showMessage('Error deleting feature');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async () => {
    const newFeature = {
      title: 'New Feature',
      title_en: 'New Feature',
      title_bg: 'Нова функция',
      description: 'Description',
      description_en: 'Description',
      description_bg: 'Описание',
      icon_name: 'Zap',
      order_index: features.length + 1,
    };

    setIsSaving(true);
    try {
      await adminService.createFeatureCard(newFeature);
      showMessage('Feature added successfully');
      onUpdate();
    } catch (error) {
      console.error('Error adding feature:', error);
      showMessage('Error adding feature');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Features Section</h2>
        <button
          onClick={handleAdd}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Feature</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {saveMessage}
        </div>
      )}

      {localFeatures.map((feature, index) => (
        <div key={feature.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">Feature #{index + 1}</h3>
            <button
              onClick={() => handleDelete(feature.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English)
              </label>
              <input
                type="text"
                value={feature.title_en}
                onChange={(e) => {
                  const updated = [...localFeatures];
                  updated[index].title_en = e.target.value;
                  updated[index].title = e.target.value;
                  setLocalFeatures(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Bulgarian)
              </label>
              <input
                type="text"
                value={feature.title_bg}
                onChange={(e) => {
                  const updated = [...localFeatures];
                  updated[index].title_bg = e.target.value;
                  setLocalFeatures(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English)
              </label>
              <textarea
                value={feature.description_en}
                onChange={(e) => {
                  const updated = [...localFeatures];
                  updated[index].description_en = e.target.value;
                  updated[index].description = e.target.value;
                  setLocalFeatures(updated);
                }}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Bulgarian)
              </label>
              <textarea
                value={feature.description_bg}
                onChange={(e) => {
                  const updated = [...localFeatures];
                  updated[index].description_bg = e.target.value;
                  setLocalFeatures(updated);
                }}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon Name (Lucide React)
              </label>
              <input
                type="text"
                value={feature.icon_name}
                onChange={(e) => {
                  const updated = [...localFeatures];
                  updated[index].icon_name = e.target.value;
                  setLocalFeatures(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Zap, Shield, Users"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={feature.order_index}
                onChange={(e) => {
                  const updated = [...localFeatures];
                  updated[index].order_index = parseInt(e.target.value);
                  setLocalFeatures(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={() => handleSave(feature)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Feature'}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
