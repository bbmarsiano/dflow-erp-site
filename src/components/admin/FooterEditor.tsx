import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, GripVertical, ExternalLink } from 'lucide-react';

interface FooterSection {
  id: string;
  title_en: string;
  title_bg: string;
  section_order: number;
}

interface FooterLink {
  id: string;
  section_id: string;
  label_en: string;
  label_bg: string;
  url: string;
  link_order: number;
  is_external: boolean;
}

interface FooterEditorProps {
  onSave: () => void;
}

export default function FooterEditor({ onSave }: FooterEditorProps) {
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [footerDescriptionEn, setFooterDescriptionEn] = useState('');
  const [footerDescriptionBg, setFooterDescriptionBg] = useState('');
  const [footerCopyrightEn, setFooterCopyrightEn] = useState('');
  const [footerCopyrightBg, setFooterCopyrightBg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFooterContent();
  }, []);

  const loadFooterContent = async () => {
    try {
      const [sectionsResult, linksResult, settingsResult] = await Promise.all([
        supabase.from('footer_sections').select('*').order('section_order'),
        supabase.from('footer_links').select('*').order('link_order'),
        supabase.from('site_settings').select('footer_description_en, footer_description_bg, footer_copyright_en, footer_copyright_bg').single(),
      ]);

      if (sectionsResult.data) setSections(sectionsResult.data);
      if (linksResult.data) setLinks(linksResult.data);
      if (settingsResult.data) {
        setFooterDescriptionEn(settingsResult.data.footer_description_en || '');
        setFooterDescriptionBg(settingsResult.data.footer_description_bg || '');
        setFooterCopyrightEn(settingsResult.data.footer_copyright_en || '');
        setFooterCopyrightBg(settingsResult.data.footer_copyright_bg || '');
      }
    } catch (error) {
      console.error('Error loading footer content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          footer_description_en: footerDescriptionEn,
          footer_description_bg: footerDescriptionBg,
          footer_copyright_en: footerCopyrightEn,
          footer_copyright_bg: footerCopyrightBg,
        })
        .eq('id', (await supabase.from('site_settings').select('id').single()).data?.id);

      if (error) throw error;
      onSave();
    } catch (error) {
      console.error('Error saving footer settings:', error);
      alert('Failed to save footer settings');
    }
  };

  const addSection = async () => {
    try {
      const maxOrder = Math.max(...sections.map(s => s.section_order), 0);
      const { data, error } = await supabase
        .from('footer_sections')
        .insert({
          title_en: 'New Section',
          title_bg: 'Нова секция',
          section_order: maxOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setSections([...sections, data]);
    } catch (error) {
      console.error('Error adding section:', error);
      alert('Failed to add section');
    }
  };

  const updateSection = async (id: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('footer_sections')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
      setSections(sections.map(s => (s.id === id ? { ...s, [field]: value } : s)));
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const deleteSection = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all links in this section.')) return;

    try {
      const { error } = await supabase.from('footer_sections').delete().eq('id', id);
      if (error) throw error;
      setSections(sections.filter(s => s.id !== id));
      setLinks(links.filter(l => l.section_id !== id));
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const addLink = async (sectionId: string) => {
    try {
      const sectionLinks = links.filter(l => l.section_id === sectionId);
      const maxOrder = Math.max(...sectionLinks.map(l => l.link_order), 0);

      const { data, error } = await supabase
        .from('footer_links')
        .insert({
          section_id: sectionId,
          label_en: 'New Link',
          label_bg: 'Нов линк',
          url: '#',
          link_order: maxOrder + 1,
          is_external: false,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setLinks([...links, data]);
    } catch (error) {
      console.error('Error adding link:', error);
      alert('Failed to add link');
    }
  };

  const updateLink = async (id: string, field: string, value: string | boolean) => {
    try {
      const { error } = await supabase
        .from('footer_links')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
      setLinks(links.map(l => (l.id === id ? { ...l, [field]: value } : l)));
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const { error } = await supabase.from('footer_links').delete().eq('id', id);
      if (error) throw error;
      setLinks(links.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link');
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
        <h3 className="text-lg font-semibold text-gray-900">Footer Settings</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English)
            </label>
            <textarea
              value={footerDescriptionEn}
              onChange={(e) => setFooterDescriptionEn(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Bulgarian)
            </label>
            <textarea
              value={footerDescriptionBg}
              onChange={(e) => setFooterDescriptionBg(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Copyright (English)
            </label>
            <input
              type="text"
              value={footerCopyrightEn}
              onChange={(e) => setFooterCopyrightEn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Copyright (Bulgarian)
            </label>
            <input
              type="text"
              value={footerCopyrightBg}
              onChange={(e) => setFooterCopyrightBg(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Footer Settings
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Footer Sections</h3>
          <button
            onClick={addSection}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Section</span>
          </button>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-5 w-5 text-gray-400" />
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title (English)
                    </label>
                    <input
                      type="text"
                      value={section.title_en}
                      onChange={(e) => updateSection(section.id, 'title_en', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title (Bulgarian)
                    </label>
                    <input
                      type="text"
                      value={section.title_bg}
                      onChange={(e) => updateSection(section.id, 'title_bg', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteSection(section.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="ml-7 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700">Links</h4>
                <button
                  onClick={() => addLink(section.id)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Link</span>
                </button>
              </div>

              {links
                .filter(link => link.section_id === section.id)
                .map(link => (
                  <div key={link.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <input
                        type="text"
                        value={link.label_en}
                        onChange={(e) => updateLink(link.id, 'label_en', e.target.value)}
                        placeholder="Label (English)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={link.label_bg}
                        onChange={(e) => updateLink(link.id, 'label_bg', e.target.value)}
                        placeholder="Label (Bulgarian)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        placeholder="URL"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={link.is_external}
                          onChange={(e) => updateLink(link.id, 'is_external', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <ExternalLink className="h-4 w-4" />
                        <span>External Link</span>
                      </label>
                    </div>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
