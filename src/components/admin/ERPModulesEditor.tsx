import { useState } from 'react';
import { Plus, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import type { ERPModule } from '../../types/cms';

interface ERPModulesEditorProps {
  modules: ERPModule[];
  onUpdate: (modules: ERPModule[]) => Promise<void>;
}

export function ERPModulesEditor({ modules, onUpdate }: ERPModulesEditorProps) {
  const [editingModule, setEditingModule] = useState<ERPModule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = () => {
    const newModule: ERPModule = {
      id: crypto.randomUUID(),
      title_en: '',
      title_bg: '',
      description_en: '',
      description_bg: '',
      screenshot_url: '',
      platform: '',
      display_order: modules.length,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingModule(newModule);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingModule) return;

    setIsSaving(true);
    try {
      let updatedModules: ERPModule[];
      if (isCreating) {
        updatedModules = [...modules, editingModule];
      } else {
        updatedModules = modules.map((m) =>
          m.id === editingModule.id ? editingModule : m
        );
      }
      await onUpdate(updatedModules);
      setEditingModule(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving module:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    setIsSaving(true);
    try {
      const updatedModules = modules.filter((m) => m.id !== id);
      await onUpdate(updatedModules);
    } catch (error) {
      console.error('Error deleting module:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (module: ERPModule) => {
    setIsSaving(true);
    try {
      const updatedModules = modules.map((m) =>
        m.id === module.id ? { ...m, is_visible: !m.is_visible } : m
      );
      await onUpdate(updatedModules);
    } catch (error) {
      console.error('Error toggling visibility:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (editingModule) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {isCreating ? 'Create ERP Module' : 'Edit ERP Module'}
          </h3>
          <button
            onClick={() => {
              setEditingModule(null);
              setIsCreating(false);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English)
              </label>
              <input
                type="text"
                value={editingModule.title_en}
                onChange={(e) =>
                  setEditingModule({ ...editingModule, title_en: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., CRM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Bulgarian)
              </label>
              <input
                type="text"
                value={editingModule.title_bg}
                onChange={(e) =>
                  setEditingModule({ ...editingModule, title_bg: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="напр., CRM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English)
              </label>
              <textarea
                value={editingModule.description_en}
                onChange={(e) =>
                  setEditingModule({ ...editingModule, description_en: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Describe the module..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Bulgarian)
              </label>
              <textarea
                value={editingModule.description_bg}
                onChange={(e) =>
                  setEditingModule({ ...editingModule, description_bg: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Опишете модула..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshot URL
            </label>
            <input
              type="text"
              value={editingModule.screenshot_url || ''}
              onChange={(e) =>
                setEditingModule({ ...editingModule, screenshot_url: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://example.com/screenshot.png"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={editingModule.platform || ''}
                onChange={(e) =>
                  setEditingModule({ ...editingModule, platform: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Not specified</option>
                <option value="Odoo">Odoo</option>
                <option value="Dolibarr">Dolibarr</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={editingModule.display_order}
                onChange={(e) =>
                  setEditingModule({
                    ...editingModule,
                    display_order: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visible
              </label>
              <label className="flex items-center space-x-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editingModule.is_visible}
                  onChange={(e) =>
                    setEditingModule({ ...editingModule, is_visible: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700">Show on site</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setEditingModule(null);
                setIsCreating(false);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Saving...' : 'Save Module'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">ERP Modules</h3>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Module</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visible
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modules.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No modules yet. Click "Add Module" to create one.
                </td>
              </tr>
            ) : (
              modules
                .sort((a, b) => a.display_order - b.display_order)
                .map((module) => (
                  <tr key={module.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {module.title_en}
                      </div>
                      <div className="text-sm text-gray-500">{module.title_bg}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {module.platform || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {module.display_order}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleVisibility(module)}
                        disabled={isSaving}
                        className={`p-1 rounded ${
                          module.is_visible
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-400 hover:text-gray-500'
                        }`}
                      >
                        {module.is_visible ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditingModule(module)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(module.id)}
                        disabled={isSaving}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
