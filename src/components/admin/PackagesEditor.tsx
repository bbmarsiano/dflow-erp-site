import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import type { Package } from '../../types/cms';
import { adminService } from '../../services/adminService';

interface PackagesEditorProps {
  packages: Package[];
  onUpdate: () => void;
}

export function PackagesEditor({ packages, onUpdate }: PackagesEditorProps) {
  const [localPackages, setLocalPackages] = useState<Package[]>(packages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setLocalPackages(packages);
  }, [packages]);

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSave = async (pkg: Package) => {
    setIsSaving(true);
    try {
      await adminService.updatePackage(pkg.id, pkg);
      showMessage('Package saved successfully');
      onUpdate();
    } catch (error) {
      console.error('Error saving package:', error);
      showMessage('Error saving package');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePackage = (id: string, field: keyof Package, value: any) => {
    if (field === 'is_featured' && value === true) {
      setLocalPackages(prev =>
        prev.map(pkg => ({
          ...pkg,
          is_featured: pkg.id === id ? true : false
        }))
      );
    } else {
      setLocalPackages(prev =>
        prev.map(pkg => (pkg.id === id ? { ...pkg, [field]: value } : pkg))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Packages</h2>
      </div>

      {saveMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {saveMessage}
        </div>
      )}

      <div className="space-y-4">
        {localPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {pkg.name_en || pkg.name || 'Unnamed Package'}
                </h3>
                <p className="text-sm text-gray-600">{pkg.description_en || pkg.description}</p>
              </div>
              <button
                onClick={() => setExpandedId(expandedId === pkg.id ? null : pkg.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {expandedId === pkg.id ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {expandedId === pkg.id && (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Name (English)
                    </label>
                    <input
                      type="text"
                      value={pkg.name_en || pkg.name || ''}
                      onChange={(e) => updatePackage(pkg.id, 'name_en', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Enterprise"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Name (Bulgarian)
                    </label>
                    <input
                      type="text"
                      value={pkg.name_bg || pkg.name || ''}
                      onChange={(e) => updatePackage(pkg.id, 'name_bg', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="напр., Enterprise"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <input
                    type="checkbox"
                    id={`is_featured_${pkg.id}`}
                    checked={pkg.is_featured || false}
                    onChange={(e) => updatePackage(pkg.id, 'is_featured', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`is_featured_${pkg.id}`} className="text-sm font-medium text-gray-900">
                    ⭐ Mark as Featured Package (only one can be featured at a time)
                  </label>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Package Content</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (English)
                      </label>
                      <textarea
                        value={pkg.description_en || pkg.description || ''}
                        onChange={(e) => updatePackage(pkg.id, 'description_en', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Package description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Bulgarian)
                      </label>
                      <textarea
                        value={pkg.description_bg || pkg.description || ''}
                        onChange={(e) => updatePackage(pkg.id, 'description_bg', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Описание на пакета..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ERP Platform (English)
                      </label>
                      <input
                        type="text"
                        value={pkg.erp_platform_en || pkg.erp_platform || ''}
                        onChange={(e) => updatePackage(pkg.id, 'erp_platform_en', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Odoo / Dolibarr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ERP Platform (Bulgarian)
                      </label>
                      <input
                        type="text"
                        value={pkg.erp_platform_bg || pkg.erp_platform || ''}
                        onChange={(e) => updatePackage(pkg.id, 'erp_platform_bg', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="напр., Odoo / Dolibarr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Features (English) - One per line
                      </label>
                      <textarea
                        value={Array.isArray(pkg.features_en) ? pkg.features_en.join('\n') : (Array.isArray(pkg.features) ? pkg.features.join('\n') : '')}
                        onChange={(e) => updatePackage(pkg.id, 'features_en', e.target.value.split('\n').filter(f => f.trim()))}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Features (Bulgarian) - One per line
                      </label>
                      <textarea
                        value={Array.isArray(pkg.features_bg) ? pkg.features_bg.join('\n') : (Array.isArray(pkg.features) ? pkg.features.join('\n') : '')}
                        onChange={(e) => updatePackage(pkg.id, 'features_bg', e.target.value.split('\n').filter(f => f.trim()))}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Функция 1&#10;Функция 2&#10;Функция 3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Text (English)
                      </label>
                      <input
                        type="text"
                        value={pkg.price_text_en || pkg.price_text || ''}
                        onChange={(e) => updatePackage(pkg.id, 'price_text_en', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., $99/month"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Text (Bulgarian)
                      </label>
                      <input
                        type="text"
                        value={pkg.price_text_bg || pkg.price_text || ''}
                        onChange={(e) => updatePackage(pkg.id, 'price_text_bg', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="напр., 99 лв./месец"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Button Text (English)
                      </label>
                      <input
                        type="text"
                        value={pkg.cta_text_en || pkg.cta_text || ''}
                        onChange={(e) => updatePackage(pkg.id, 'cta_text_en', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Get Started"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Button Text (Bulgarian)
                      </label>
                      <input
                        type="text"
                        value={pkg.cta_text_bg || pkg.cta_text || ''}
                        onChange={(e) => updatePackage(pkg.id, 'cta_text_bg', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="напр., Започнете"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deployment Options (English) - Optional
                      </label>
                      <textarea
                        value={pkg.deployment_options_en || ''}
                        onChange={(e) => updatePackage(pkg.id, 'deployment_options_en', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="☁️ Cloud-based..."
                      />
                      <p className="text-xs text-gray-500 mt-1">For On-Premise packages - deployment options section</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deployment Options (Bulgarian) - Optional
                      </label>
                      <textarea
                        value={pkg.deployment_options_bg || ''}
                        onChange={(e) => updatePackage(pkg.id, 'deployment_options_bg', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="☁️ Облачна..."
                      />
                      <p className="text-xs text-gray-500 mt-1">За On-Premise пакети - секция с опции за внедряване</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technical Details (English) - Optional
                      </label>
                      <textarea
                        value={pkg.technical_details_en || ''}
                        onChange={(e) => updatePackage(pkg.id, 'technical_details_en', e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="• Full data sovereignty...&#10;• Integration with SSO...&#10;• Custom security..."
                      />
                      <p className="text-xs text-gray-500 mt-1">For On-Premise packages - technical details section</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technical Details (Bulgarian) - Optional
                      </label>
                      <textarea
                        value={pkg.technical_details_bg || ''}
                        onChange={(e) => updatePackage(pkg.id, 'technical_details_bg', e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="• Пълен контрол над данните...&#10;• Интеграция с SSO...&#10;• Специализирани политики..."
                      />
                      <p className="text-xs text-gray-500 mt-1">За On-Premise пакети - секция с технически детайли</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternative CTA Label (English) - Optional
                      </label>
                      <input
                        type="text"
                        value={pkg.cta_label_en || ''}
                        onChange={(e) => updatePackage(pkg.id, 'cta_label_en', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Request On-Premise Quote"
                      />
                      <p className="text-xs text-gray-500 mt-1">Overrides CTA text if provided (for On-Premise packages)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternative CTA Label (Bulgarian) - Optional
                      </label>
                      <input
                        type="text"
                        value={pkg.cta_label_bg || ''}
                        onChange={(e) => updatePackage(pkg.id, 'cta_label_bg', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="напр., Изпрати запитване"
                      />
                      <p className="text-xs text-gray-500 mt-1">Замества CTA текста, ако е попълнено (за On-Premise пакети)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pricing Note (English) - Optional
                      </label>
                      <input
                        type="text"
                        value={pkg.pricing_note_en || ''}
                        onChange={(e) => updatePackage(pkg.id, 'pricing_note_en', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Price available only upon request"
                      />
                      <p className="text-xs text-gray-500 mt-1">Small note under price (for On-Premise packages)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pricing Note (Bulgarian) - Optional
                      </label>
                      <input
                        type="text"
                        value={pkg.pricing_note_bg || ''}
                        onChange={(e) => updatePackage(pkg.id, 'pricing_note_bg', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="напр., Предлага се само по запитване"
                      />
                      <p className="text-xs text-gray-500 mt-1">Малка бележка под цената (за On-Premise пакети)</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Pop-up Modal (Optional)</h4>

                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id={`popup_enabled_${pkg.id}`}
                      checked={pkg.popup_enabled || false}
                      onChange={(e) => updatePackage(pkg.id, 'popup_enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`popup_enabled_${pkg.id}`} className="text-sm font-medium text-gray-700">
                      Enable Pop-up Modal
                    </label>
                  </div>

                  {pkg.popup_enabled && (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pop-up Title (English)
                        </label>
                        <input
                          type="text"
                          value={pkg.popup_title_en || ''}
                          onChange={(e) => updatePackage(pkg.id, 'popup_title_en', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter title..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pop-up Title (Bulgarian)
                        </label>
                        <input
                          type="text"
                          value={pkg.popup_title_bg || ''}
                          onChange={(e) => updatePackage(pkg.id, 'popup_title_bg', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Въведете заглавие..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pop-up Content (English) - HTML supported
                      </label>
                      <textarea
                        value={pkg.popup_content_en || ''}
                        onChange={(e) => updatePackage(pkg.id, 'popup_content_en', e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="<p>Enter HTML content...</p>"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pop-up Content (Bulgarian) - HTML supported
                      </label>
                      <textarea
                        value={pkg.popup_content_bg || ''}
                        onChange={(e) => updatePackage(pkg.id, 'popup_content_bg', e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="<p>Въведете HTML съдържание...</p>"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pop-up CTA Label (English) - Optional
                        </label>
                        <input
                          type="text"
                          value={pkg.popup_cta_label_en || ''}
                          onChange={(e) => updatePackage(pkg.id, 'popup_cta_label_en', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Request Quote"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pop-up CTA Label (Bulgarian) - Optional
                        </label>
                        <input
                          type="text"
                          value={pkg.popup_cta_label_bg || ''}
                          onChange={(e) => updatePackage(pkg.id, 'popup_cta_label_bg', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="напр., Изпрати запитване"
                        />
                      </div>
                    </div>
                  </>
                )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => handleSave(pkg)}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving...' : 'Save Package'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-2">Package Editing Instructions:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Package Content:</strong> Edit all main package fields (name, description, features, pricing, CTA button)</li>
          <li><strong>On-Premise Fields:</strong> Deployment options, technical details, alternative CTA, and pricing note are optional and mainly for On-Premise packages</li>
          <li><strong>Features:</strong> Enter one feature per line - they will be displayed as a bulleted list</li>
          <li><strong>Featured Package:</strong> Only one package can be featured at a time (appears highlighted with POPULAR badge)</li>
          <li><strong>Pop-up Modal:</strong> Optional - enable to show "View more options" link with additional details. Content supports HTML.</li>
          <li><strong>All changes require clicking "Save Package"</strong> to persist to the database</li>
        </ul>
      </div>
    </div>
  );
}
