import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ExternalLink, Bold, Italic, List, Link as LinkIcon, Heading } from 'lucide-react';
import type { CustomPage } from '../../types/cms';
import { adminService } from '../../services/adminService';

interface CustomPagesEditorProps {
  pages: CustomPage[];
  onUpdate: () => void;
}

export function CustomPagesEditor({ pages, onUpdate }: CustomPagesEditorProps) {
  const [localPages, setLocalPages] = useState<CustomPage[]>(pages);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingContent, setEditingContent] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.log('CustomPagesEditor received pages:', pages.length);
    setLocalPages(pages);
  }, [pages]);

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSave = async (page: CustomPage) => {
    setIsSaving(true);
    try {
      await adminService.updateCustomPage(page.id, page);
      showMessage('Page saved successfully');
      onUpdate();
    } catch (error) {
      console.error('Error saving page:', error);
      showMessage('Error saving page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    setIsSaving(true);
    try {
      await adminService.deleteCustomPage(id);
      showMessage('Page deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting page:', error);
      showMessage('Error deleting page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async () => {
    const slug = `page-${Date.now()}`;
    const newPage = {
      slug,
      title_en: 'New Page',
      title_bg: 'Нова страница',
      content_en: '<h2>Welcome to your new page</h2><p>Start editing the content here...</p>',
      content_bg: '<h2>Добре дошли в новата страница</h2><p>Започнете да редактирате съдържанието тук...</p>',
      meta_title_en: 'New Page',
      meta_title_bg: 'Нова страница',
      meta_description_en: 'Page description',
      meta_description_bg: 'Описание на страницата',
      is_published: false,
      order_index: pages.length + 1,
      show_in_nav: false,
    };

    setIsSaving(true);
    try {
      await adminService.createCustomPage(newPage);
      showMessage('Page added successfully');
      onUpdate();
    } catch (error) {
      console.error('Error adding page:', error);
      showMessage('Error adding page');
    } finally {
      setIsSaving(false);
    }
  };

  const insertFormatting = (index: number, lang: 'en' | 'bg', tag: string, example: string = '') => {
    const field = lang === 'en' ? 'content_en' : 'content_bg';
    const currentContent = localPages[index][field];

    let newContent = '';
    if (tag === 'h2') {
      newContent = currentContent + `\n<h2>${example || 'Heading'}</h2>\n`;
    } else if (tag === 'p') {
      newContent = currentContent + `\n<p>${example || 'Paragraph text...'}</p>\n`;
    } else if (tag === 'ul') {
      newContent = currentContent + `\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n`;
    } else if (tag === 'a') {
      newContent = currentContent + `\n<a href="https://example.com" target="_blank">Link text</a>\n`;
    } else if (tag === 'strong') {
      newContent = currentContent + `\n<strong>${example || 'Bold text'}</strong>\n`;
    } else if (tag === 'em') {
      newContent = currentContent + `\n<em>${example || 'Italic text'}</em>\n`;
    }

    const updated = [...localPages];
    updated[index][field] = newContent;
    setLocalPages(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Custom Pages</h2>
          <p className="text-gray-600 mt-1">Create and manage custom pages with unique URLs</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Page</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
          {saveMessage}
        </div>
      )}

      {localPages.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No pages yet. Click "Add Page" to create your first custom page.</p>
        </div>
      )}

      {localPages.map((page, index) => (
        <div key={page.id} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{page.slug}</h3>
              <a
                href={`/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1 mt-1"
              >
                <span>/{page.slug}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <button
              onClick={() => handleDelete(page.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug (e.g., "about-us")
            </label>
            <input
              type="text"
              value={page.slug}
              onChange={(e) => {
                const updated = [...localPages];
                updated[index].slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                setLocalPages(updated);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="about-us"
            />
            <p className="text-xs text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title (English)
              </label>
              <input
                type="text"
                value={page.title_en}
                onChange={(e) => {
                  const updated = [...localPages];
                  updated[index].title_en = e.target.value;
                  setLocalPages(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title (Bulgarian)
              </label>
              <input
                type="text"
                value={page.title_bg}
                onChange={(e) => {
                  const updated = [...localPages];
                  updated[index].title_bg = e.target.value;
                  setLocalPages(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (English)
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'en', 'h2')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Heading"
                  >
                    <Heading className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'en', 'p')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Paragraph"
                  >
                    <span className="text-sm font-semibold">P</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'en', 'strong')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'en', 'em')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'en', 'ul')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'en', 'a')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={page.content_en}
                  onChange={(e) => {
                    const updated = [...localPages];
                    updated[index].content_en = e.target.value;
                    setLocalPages(updated);
                  }}
                  rows={12}
                  className="w-full px-4 py-2 focus:ring-2 focus:ring-blue-500 border-0 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (Bulgarian)
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'bg', 'h2')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Heading"
                  >
                    <Heading className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'bg', 'p')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Paragraph"
                  >
                    <span className="text-sm font-semibold">P</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'bg', 'strong')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'bg', 'em')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'bg', 'ul')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting(index, 'bg', 'a')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Add Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={page.content_bg}
                  onChange={(e) => {
                    const updated = [...localPages];
                    updated[index].content_bg = e.target.value;
                    setLocalPages(updated);
                  }}
                  rows={12}
                  className="w-full px-4 py-2 focus:ring-2 focus:ring-blue-500 border-0 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title (English)
              </label>
              <input
                type="text"
                value={page.meta_title_en}
                onChange={(e) => {
                  const updated = [...localPages];
                  updated[index].meta_title_en = e.target.value;
                  setLocalPages(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title (Bulgarian)
              </label>
              <input
                type="text"
                value={page.meta_title_bg}
                onChange={(e) => {
                  const updated = [...localPages];
                  updated[index].meta_title_bg = e.target.value;
                  setLocalPages(updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description (English)
              </label>
              <textarea
                value={page.meta_description_en}
                onChange={(e) => {
                  const updated = [...localPages];
                  updated[index].meta_description_en = e.target.value;
                  setLocalPages(updated);
                }}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description (Bulgarian)
              </label>
              <textarea
                value={page.meta_description_bg}
                onChange={(e) => {
                  const updated = [...localPages];
                  updated[index].meta_description_bg = e.target.value;
                  setLocalPages(updated);
                }}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={page.order_index}
                onChange={(e) => {
                  const updated = [...localPages];
                  updated[index].order_index = parseInt(e.target.value);
                  setLocalPages(updated);
                }}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-7">
              <input
                type="checkbox"
                id={`published-${page.id}`}
                checked={page.is_published}
                onChange={(e) => {
                  const updated = [...localPages];
                  updated[index].is_published = e.target.checked;
                  setLocalPages(updated);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`published-${page.id}`} className="text-sm font-medium text-gray-700">
                Published
              </label>
            </div>

            <div className="flex items-center space-x-2 pt-7">
              <input
                type="checkbox"
                id={`nav-${page.id}`}
                checked={page.show_in_nav}
                onChange={(e) => {
                  const updated = [...localPages];
                  updated[index].show_in_nav = e.target.checked;
                  setLocalPages(updated);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`nav-${page.id}`} className="text-sm font-medium text-gray-700">
                Show in Navigation
              </label>
            </div>
          </div>

          <button
            onClick={() => handleSave(page)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Page'}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
