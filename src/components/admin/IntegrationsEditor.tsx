import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { Integration } from '../../types/cms';
import { adminService } from '../../services/adminService';

interface IntegrationsEditorProps {
  integrations: Integration[];
  onUpdate: () => void;
}

export function IntegrationsEditor({ integrations, onUpdate }: IntegrationsEditorProps) {
  const [localIntegrations, setLocalIntegrations] = useState<Integration[]>(integrations);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSave = async (integration: Integration) => {
    setIsSaving(true);
    try {
      await adminService.updateIntegration(integration.id, integration);
      showMessage('Integration saved successfully');
      onUpdate();
    } catch (error) {
      console.error('Error saving integration:', error);
      showMessage('Error saving integration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return;

    setIsSaving(true);
    try {
      await adminService.deleteIntegration(id);
      showMessage('Integration deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting integration:', error);
      showMessage('Error deleting integration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async () => {
    const newIntegration = {
      title: 'New Integration',
      title_en: 'New Integration',
      title_bg: 'Нова интеграция',
      icon_name: 'Puzzle',
      order_index: integrations.length + 1,
    };

    setIsSaving(true);
    try {
      await adminService.createIntegration(newIntegration);
      showMessage('Integration added successfully');
      onUpdate();
    } catch (error) {
      console.error('Error adding integration:', error);
      showMessage('Error adding integration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
          <p className="text-gray-600 mt-1">Manage integration options displayed on the site</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Integration</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {saveMessage}
        </div>
      )}

      {localIntegrations.map((integration, index) => (
        <div key={integration.id} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">Integration #{index + 1}</h3>
            <button
              onClick={() => handleDelete(integration.id)}
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
                value={integration.title_en}
                onChange={(e) => {
                  const updated = [...localIntegrations];
                  updated[index].title_en = e.target.value;
                  updated[index].title = e.target.value;
                  setLocalIntegrations(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Bulgarian)
              </label>
              <input
                type="text"
                value={integration.title_bg}
                onChange={(e) => {
                  const updated = [...localIntegrations];
                  updated[index].title_bg = e.target.value;
                  setLocalIntegrations(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                value={integration.icon_name}
                onChange={(e) => {
                  const updated = [...localIntegrations];
                  updated[index].icon_name = e.target.value;
                  setLocalIntegrations(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Puzzle, Link, Database"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={integration.order_index}
                onChange={(e) => {
                  const updated = [...localIntegrations];
                  updated[index].order_index = parseInt(e.target.value);
                  setLocalIntegrations(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={() => handleSave(integration)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Integration'}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
