import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { ProcessStep } from '../../types/cms';
import { adminService } from '../../services/adminService';

interface ProcessEditorProps {
  steps: ProcessStep[];
  onUpdate: () => void;
}

export function ProcessEditor({ steps, onUpdate }: ProcessEditorProps) {
  const [localSteps, setLocalSteps] = useState<ProcessStep[]>(steps);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSave = async (step: ProcessStep) => {
    setIsSaving(true);
    try {
      await adminService.updateProcessStep(step.id, step);
      showMessage('Process step saved successfully');
      onUpdate();
    } catch (error) {
      console.error('Error saving step:', error);
      showMessage('Error saving step');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this process step?')) return;

    setIsSaving(true);
    try {
      await adminService.deleteProcessStep(id);
      showMessage('Process step deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting step:', error);
      showMessage('Error deleting step');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async () => {
    const newStep = {
      title: 'New Step',
      title_en: 'New Step',
      title_bg: 'Нова стъпка',
      description: 'Description',
      description_en: 'Description',
      description_bg: 'Описание',
      order_index: steps.length + 1,
    };

    setIsSaving(true);
    try {
      await adminService.createProcessStep(newStep);
      showMessage('Process step added successfully');
      onUpdate();
    } catch (error) {
      console.error('Error adding step:', error);
      showMessage('Error adding step');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Process Steps</h2>
          <p className="text-gray-600 mt-1">Manage the implementation process steps</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Step</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {saveMessage}
        </div>
      )}

      {localSteps.map((step, index) => (
        <div key={step.id} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">Step #{index + 1}</h3>
            <button
              onClick={() => handleDelete(step.id)}
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
                value={step.title_en}
                onChange={(e) => {
                  const updated = [...localSteps];
                  updated[index].title_en = e.target.value;
                  updated[index].title = e.target.value;
                  setLocalSteps(updated);
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
                value={step.title_bg}
                onChange={(e) => {
                  const updated = [...localSteps];
                  updated[index].title_bg = e.target.value;
                  setLocalSteps(updated);
                }}
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
                value={step.description_en}
                onChange={(e) => {
                  const updated = [...localSteps];
                  updated[index].description_en = e.target.value;
                  updated[index].description = e.target.value;
                  setLocalSteps(updated);
                }}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Bulgarian)
              </label>
              <textarea
                value={step.description_bg}
                onChange={(e) => {
                  const updated = [...localSteps];
                  updated[index].description_bg = e.target.value;
                  setLocalSteps(updated);
                }}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Index
            </label>
            <input
              type="number"
              value={step.order_index}
              onChange={(e) => {
                const updated = [...localSteps];
                updated[index].order_index = parseInt(e.target.value);
                setLocalSteps(updated);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => handleSave(step)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Step'}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
