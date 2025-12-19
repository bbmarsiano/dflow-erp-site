import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';

interface NavItem {
  id: string;
  label_en: string;
  label_bg: string;
  section_id: string;
  item_order: number;
  is_visible: boolean;
}

interface HeaderEditorProps {
  onSave: () => void;
}

export default function HeaderEditor({ onSave }: HeaderEditorProps) {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [siteNameEn, setSiteNameEn] = useState('');
  const [siteNameBg, setSiteNameBg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeaderContent();
  }, []);

  const loadHeaderContent = async () => {
    try {
      const [navResult, settingsResult] = await Promise.all([
        supabase.from('header_nav_items').select('*').order('item_order'),
        supabase.from('site_settings').select('site_name_en, site_name_bg').single(),
      ]);

      if (navResult.data) setNavItems(navResult.data);
      if (settingsResult.data) {
        setSiteNameEn(settingsResult.data.site_name_en || '');
        setSiteNameBg(settingsResult.data.site_name_bg || '');
      }
    } catch (error) {
      console.error('Error loading header content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          site_name_en: siteNameEn,
          site_name_bg: siteNameBg,
        })
        .eq('id', (await supabase.from('site_settings').select('id').single()).data?.id);

      if (error) throw error;
      onSave();
    } catch (error) {
      console.error('Error saving header settings:', error);
      alert('Failed to save header settings');
    }
  };

  const addNavItem = async () => {
    try {
      const maxOrder = Math.max(...navItems.map(item => item.item_order), 0);
      const { data, error } = await supabase
        .from('header_nav_items')
        .insert({
          label_en: 'New Link',
          label_bg: 'Нов линк',
          section_id: 'home',
          item_order: maxOrder + 1,
          is_visible: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setNavItems([...navItems, data]);
    } catch (error) {
      console.error('Error adding nav item:', error);
      alert('Failed to add navigation item');
    }
  };

  const updateNavItem = async (id: string, field: string, value: string | boolean | number) => {
    try {
      const { error } = await supabase
        .from('header_nav_items')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
      setNavItems(navItems.map(item => (item.id === id ? { ...item, [field]: value } : item)));
    } catch (error) {
      console.error('Error updating nav item:', error);
    }
  };

  const deleteNavItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;

    try {
      const { error } = await supabase.from('header_nav_items').delete().eq('id', id);
      if (error) throw error;
      setNavItems(navItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting nav item:', error);
      alert('Failed to delete navigation item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Site Name</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name (English)
            </label>
            <input
              type="text"
              value={siteNameEn}
              onChange={(e) => setSiteNameEn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="DFlow ERP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name (Bulgarian)
            </label>
            <input
              type="text"
              value={siteNameBg}
              onChange={(e) => setSiteNameBg(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="DFlow ERP"
            />
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Site Name
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Navigation Items</h3>
            <p className="text-sm text-gray-600 mt-1">Manage header navigation menu links</p>
          </div>
          <button
            onClick={addNavItem}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Nav Item</span>
          </button>
        </div>

        <div className="space-y-3">
          {navItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start space-x-4">
                <GripVertical className="h-5 w-5 text-gray-400 mt-2" />

                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label (English)
                    </label>
                    <input
                      type="text"
                      value={item.label_en}
                      onChange={(e) => updateNavItem(item.id, 'label_en', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label (Bulgarian)
                    </label>
                    <input
                      type="text"
                      value={item.label_bg}
                      onChange={(e) => updateNavItem(item.id, 'label_bg', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section ID
                    </label>
                    <input
                      type="text"
                      value={item.section_id}
                      onChange={(e) => updateNavItem(item.id, 'section_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="home, packages, contact"
                    />
                    <p className="text-xs text-gray-500 mt-1">ID of the section to scroll to</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order
                    </label>
                    <input
                      type="number"
                      value={item.item_order}
                      onChange={(e) => updateNavItem(item.id, 'item_order', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-8">
                  <button
                    onClick={() => updateNavItem(item.id, 'is_visible', !item.is_visible)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.is_visible
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={item.is_visible ? 'Visible' : 'Hidden'}
                  >
                    {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => deleteNavItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
