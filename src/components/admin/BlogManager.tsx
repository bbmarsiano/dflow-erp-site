import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { adminService } from '../../services/adminService';
import type { BlogPost, SiteSettings } from '../../types/cms';

interface BlogManagerProps {
  settings: SiteSettings | null;
  onUpdate: () => void;
}

function slugify(input: string): string {
  return input
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')    // remove invalid chars
    .trim()
    .replace(/\s+/g, '-')            // spaces to dashes
    .replace(/-+/g, '-');            // collapse multiple dashes
}

export function BlogManager({ settings, onUpdate }: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Blog settings state
  const [blogMenuEnabled, setBlogMenuEnabled] = useState<string>('true');
  const [blogMenuLabelBg, setBlogMenuLabelBg] = useState<string>('Блог');
  const [blogMenuLabelEn, setBlogMenuLabelEn] = useState<string>('Blog');
  const [blogHomeSectionEnabled, setBlogHomeSectionEnabled] = useState<string>('true');
  const [blogFooterLinksEnabled, setBlogFooterLinksEnabled] = useState<string>('true');

  useEffect(() => {
    loadPosts();
    loadSettings();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      alert('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    if (settings) {
      setBlogMenuEnabled(settings.blog_menu_enabled || 'true');
      setBlogMenuLabelBg(settings.blog_menu_label_bg || 'Блог');
      setBlogMenuLabelEn(settings.blog_menu_label_en || 'Blog');
      setBlogHomeSectionEnabled(settings.blog_home_section_enabled || 'true');
      setBlogFooterLinksEnabled(settings.blog_footer_links_enabled || 'true');
    }
  };

  const handleCreate = () => {
    const newPost: BlogPost = {
      id: '',
      slug: '',
      title_bg: '',
      title_en: '',
      excerpt_bg: '',
      excerpt_en: '',
      content_bg: '',
      content_en: '',
      client_name: null,
      client_industry: null,
      is_published: false,
      show_on_home: false,
      show_in_footer: false,
      published_at: null,
      created_at: '',
      updated_at: '',
    };
    setEditingPost(newPost);
    setIsCreating(true);
    setIsSlugManuallyEdited(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsCreating(false);
    // When editing existing post, mark slug as manually edited to prevent auto-overwrite
    setIsSlugManuallyEdited(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await adminService.deleteBlogPost(id);
      await loadPosts();
      setSaveMessage('Blog post deleted successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Failed to delete blog post');
    }
  };

  const handleSave = async () => {
    if (!editingPost) return;

    // Validation
    if (!editingPost.slug || !editingPost.title_bg || !editingPost.title_en) {
      alert('Please fill in slug and titles (both languages)');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      if (isCreating) {
        await adminService.createBlogPost(editingPost);
        setSuccessMessage('Промените бяха запазени успешно. / Changes saved successfully.');
      } else {
        await adminService.updateBlogPost(editingPost.id, editingPost);
        setSuccessMessage('Промените бяха запазени успешно. / Changes saved successfully.');
      }

      setEditingPost(null);
      setIsCreating(false);
      await loadPosts();
      onUpdate();
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      if (error?.message) {
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
      }
      if (error?.message?.includes('duplicate') || error?.message?.includes('unique')) {
        alert('A blog post with this slug already exists. Please use a different slug.');
      } else {
        const errorMsg = error?.message || error?.details || 'Unknown error';
        alert(`Failed to save blog post: ${errorMsg}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      await adminService.updateSiteSettings({
        id: settings.id,
        blog_menu_enabled: blogMenuEnabled,
        blog_menu_label_bg: blogMenuLabelBg,
        blog_menu_label_en: blogMenuLabelEn,
        blog_home_section_enabled: blogHomeSectionEnabled,
        blog_footer_links_enabled: blogFooterLinksEnabled,
      });
      setSuccessMessage('Промените бяха запазени успешно. / Changes saved successfully.');
      onUpdate();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving blog settings:', error);
      alert('Failed to save blog settings');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (editingPost) {
    return (
      <div className="space-y-6">
        {successMessage && (
          <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800">
            {successMessage}
          </div>
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isCreating ? 'Create Blog Post' : 'Edit Blog Post'}
          </h2>
          <button
            onClick={() => {
              setEditingPost(null);
              setIsCreating(false);
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) * <span className="text-xs text-gray-500">(e.g., "erp-implementation-case-study")</span>
            </label>
            <input
              type="text"
              value={editingPost.slug}
              onChange={(e) => {
                setEditingPost({ ...editingPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') });
                setIsSlugManuallyEdited(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="blog-post-slug"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Bulgarian) *</label>
              <input
                type="text"
                value={editingPost.title_bg}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  // Auto-generate slug from title_bg only if title_en is empty and slug not manually edited
                  if (!isSlugManuallyEdited && !editingPost.title_en.trim() && newTitle.trim()) {
                    setEditingPost({ ...editingPost, title_bg: newTitle, slug: slugify(newTitle) });
                  } else {
                    setEditingPost({ ...editingPost, title_bg: newTitle });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (English) *</label>
              <input
                type="text"
                value={editingPost.title_en}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  // Auto-generate slug from title_en if not manually edited
                  if (!isSlugManuallyEdited) {
                    if (newTitle.trim()) {
                      setEditingPost({ ...editingPost, title_en: newTitle, slug: slugify(newTitle) });
                    } else if (editingPost.title_bg.trim()) {
                      // Fallback to title_bg if title_en is empty
                      setEditingPost({ ...editingPost, title_en: newTitle, slug: slugify(editingPost.title_bg) });
                    } else {
                      setEditingPost({ ...editingPost, title_en: newTitle, slug: '' });
                    }
                  } else {
                    setEditingPost({ ...editingPost, title_en: newTitle });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (Bulgarian) *</label>
              <textarea
                value={editingPost.excerpt_bg}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt_bg: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (English) *</label>
              <textarea
                value={editingPost.excerpt_en}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt_en: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (Bulgarian) *</label>
              <div className="border border-gray-300 rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={editingPost.content_bg}
                  onChange={(value) => setEditingPost({ ...editingPost, content_bg: value })}
                  style={{ minHeight: '200px' }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (English) *</label>
              <div className="border border-gray-300 rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={editingPost.content_en}
                  onChange={(value) => setEditingPost({ ...editingPost, content_en: value })}
                  style={{ minHeight: '200px' }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name (Optional)</label>
              <input
                type="text"
                value={editingPost.client_name || ''}
                onChange={(e) => setEditingPost({ ...editingPost, client_name: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Industry (Optional)</label>
              <input
                type="text"
                value={editingPost.client_industry || ''}
                onChange={(e) => setEditingPost({ ...editingPost, client_industry: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={editingPost.is_published}
                onChange={(e) => setEditingPost({ 
                  ...editingPost, 
                  is_published: e.target.checked,
                  published_at: e.target.checked && !editingPost.published_at ? new Date().toISOString() : editingPost.published_at,
                })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={editingPost.show_on_home}
                onChange={(e) => setEditingPost({ ...editingPost, show_on_home: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Show on Homepage</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={editingPost.show_in_footer}
                onChange={(e) => setEditingPost({ ...editingPost, show_in_footer: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Show in Footer Links</span>
            </label>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Saving...' : 'Save Post'}</span>
            </button>
            <button
              onClick={() => {
                setEditingPost(null);
                setIsCreating(false);
                setSuccessMessage(null);
                setIsSlugManuallyEdited(false);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800">
          {successMessage}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog / Use Cases</h2>
          <p className="text-gray-600 mt-1">Manage blog posts and use cases</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Blog Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Settings</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={blogMenuEnabled === 'true'}
              onChange={(e) => setBlogMenuEnabled(e.target.checked ? 'true' : 'false')}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Show Blog in Navigation Menu</span>
          </label>

          {blogMenuEnabled === 'true' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Menu Label (Bulgarian)</label>
                <input
                  type="text"
                  value={blogMenuLabelBg}
                  onChange={(e) => setBlogMenuLabelBg(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Menu Label (English)</label>
                <input
                  type="text"
                  value={blogMenuLabelEn}
                  onChange={(e) => setBlogMenuLabelEn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={blogHomeSectionEnabled === 'true'}
              onChange={(e) => setBlogHomeSectionEnabled(e.target.checked ? 'true' : 'false')}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Show Blog Section on Homepage</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={blogFooterLinksEnabled === 'true'}
              onChange={(e) => setBlogFooterLinksEnabled(e.target.checked ? 'true' : 'false')}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Show Blog Links in Footer</span>
          </label>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
          >
            Save Blog Settings
          </button>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No blog posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title_en || post.title_bg}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-mono">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {post.is_published && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      )}
                      {post.show_on_home && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Home
                        </span>
                      )}
                      {post.show_in_footer && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Footer
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{formatDate(post.published_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

