import { useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Testimonial } from '../../types/cms';
import { adminService } from '../../services/adminService';

interface TestimonialsEditorProps {
  testimonials: Testimonial[];
  onUpdate: () => void;
}

export function TestimonialsEditor({ testimonials, onUpdate }: TestimonialsEditorProps) {
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>(testimonials);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSave = async (testimonial: Testimonial) => {
    setIsSaving(true);
    try {
      await adminService.updateTestimonial(testimonial.id, testimonial);
      showMessage('Testimonial saved successfully');
      onUpdate();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      showMessage('Error saving testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    setIsSaving(true);
    try {
      await adminService.deleteTestimonial(id);
      showMessage('Testimonial deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showMessage('Error deleting testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async () => {
    const newTestimonial = {
      client_name: 'Client Name',
      company: 'Company Name',
      sector: 'Sector',
      quote: 'Testimonial quote',
      quote_en: 'Testimonial quote',
      quote_bg: 'Отзив',
      order_index: testimonials.length + 1,
      is_visible: true,
    };

    setIsSaving(true);
    try {
      await adminService.createTestimonial(newTestimonial);
      showMessage('Testimonial added successfully');
      onUpdate();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      showMessage('Error adding testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = (index: number) => {
    const updated = [...localTestimonials];
    updated[index].is_visible = !updated[index].is_visible;
    setLocalTestimonials(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-gray-600 mt-1">Manage client testimonials and reviews</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {saveMessage}
        </div>
      )}

      {localTestimonials.map((testimonial, index) => (
        <div key={testimonial.id} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">Testimonial #{index + 1}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleVisibility(index)}
                className="text-gray-600 hover:text-gray-700"
                title={testimonial.is_visible ? 'Hide' : 'Show'}
              >
                {testimonial.is_visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={testimonial.client_name}
                onChange={(e) => {
                  const updated = [...localTestimonials];
                  updated[index].client_name = e.target.value;
                  setLocalTestimonials(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={testimonial.company}
                onChange={(e) => {
                  const updated = [...localTestimonials];
                  updated[index].company = e.target.value;
                  setLocalTestimonials(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sector
              </label>
              <input
                type="text"
                value={testimonial.sector}
                onChange={(e) => {
                  const updated = [...localTestimonials];
                  updated[index].sector = e.target.value;
                  setLocalTestimonials(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote (English)
              </label>
              <textarea
                value={testimonial.quote_en}
                onChange={(e) => {
                  const updated = [...localTestimonials];
                  updated[index].quote_en = e.target.value;
                  updated[index].quote = e.target.value;
                  setLocalTestimonials(updated);
                }}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote (Bulgarian)
              </label>
              <textarea
                value={testimonial.quote_bg}
                onChange={(e) => {
                  const updated = [...localTestimonials];
                  updated[index].quote_bg = e.target.value;
                  setLocalTestimonials(updated);
                }}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={testimonial.order_index}
                onChange={(e) => {
                  const updated = [...localTestimonials];
                  updated[index].order_index = parseInt(e.target.value);
                  setLocalTestimonials(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-7">
              <input
                type="checkbox"
                id={`visible-${testimonial.id}`}
                checked={testimonial.is_visible}
                onChange={() => toggleVisibility(index)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`visible-${testimonial.id}`} className="text-sm font-medium text-gray-700">
                Visible on site
              </label>
            </div>
          </div>

          <button
            onClick={() => handleSave(testimonial)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Testimonial'}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
