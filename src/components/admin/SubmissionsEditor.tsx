import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Phone, Building, MessageSquare, X, Check, Clock, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  viewed: boolean;
  viewed_at: string | null;
  created_at: string;
  email_sent: boolean;
  email_sent_at: string | null;
  email_error: string | null;
}

type SortField = 'viewed' | 'name' | 'email' | 'company' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function SubmissionsEditor() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [filter, setFilter] = useState<'all' | 'unviewed'>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    loadSubmissions();
  }, [filter, sortField, sortDirection]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (filter === 'unviewed') {
        query = query.eq('viewed', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      alert('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = async (submission: ContactSubmission) => {
    if (submission.viewed) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('contact_submissions')
        .update({
          viewed: true,
          viewed_at: new Date().toISOString(),
          viewed_by: user?.id || null,
        })
        .eq('id', submission.id);

      if (error) {
        console.error('Error marking as viewed:', error);
        throw error;
      }

      const updatedSubmission = {
        ...submission,
        viewed: true,
        viewed_at: new Date().toISOString()
      };

      setSubmissions(prev =>
        prev.map(s =>
          s.id === submission.id ? updatedSubmission : s
        )
      );

      if (selectedSubmission?.id === submission.id) {
        setSelectedSubmission(updatedSubmission);
      }

      await loadSubmissions();
    } catch (error) {
      console.error('Error marking as viewed:', error);
      alert('Failed to mark as viewed. Please try again.');
    }
  };

  const openSubmission = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    await markAsViewed(submission);
  };

  const toggleViewed = async (submission: ContactSubmission) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const newViewedState = !submission.viewed;
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          viewed: newViewedState,
          viewed_at: newViewedState ? new Date().toISOString() : null,
          viewed_by: newViewedState ? (user?.id || null) : null,
        })
        .eq('id', submission.id);

      if (error) throw error;

      setSubmissions(prev =>
        prev.map(s =>
          s.id === submission.id
            ? {
                ...s,
                viewed: newViewedState,
                viewed_at: newViewedState ? new Date().toISOString() : null,
              }
            : s
        )
      );
    } catch (error) {
      console.error('Error toggling viewed status:', error);
      alert('Failed to update submission status');
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => prev.filter(s => s.id !== id));
      setSelectedSubmission(null);
      await loadSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unviewedCount = submissions.filter(s => !s.viewed).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Submissions</h2>
          <p className="text-gray-600 mt-1">
            {unviewedCount > 0 && (
              <span className="text-red-600 font-semibold">
                {unviewedCount} unread {unviewedCount === 1 ? 'message' : 'messages'}
              </span>
            )}
            {unviewedCount === 0 && <span>All caught up!</span>}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unviewed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unviewed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread ({unviewedCount})
          </button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No submissions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('viewed')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Status</span>
                    {getSortIcon('viewed')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Name</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Email</span>
                    {getSortIcon('email')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('company')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Company</span>
                    {getSortIcon('company')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('created_at')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Date</span>
                    {getSortIcon('created_at')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className={`${
                    !submission.viewed ? 'bg-blue-50' : 'hover:bg-gray-50'
                  } transition-colors cursor-pointer`}
                  onClick={() => openSubmission(submission)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.viewed ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {submission.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{submission.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {submission.company || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {formatDate(submission.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.email_sent ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Sent
                      </span>
                    ) : submission.email_error ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSubmission(submission.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Contact Submission</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="flex items-center text-gray-900">
                  <MessageSquare className="h-4 w-4 mr-2 text-gray-400" />
                  {selectedSubmission.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center text-gray-900">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
              </div>

              {selectedSubmission.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <div className="flex items-center text-gray-900">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedSubmission.phone}
                    </a>
                  </div>
                </div>
              )}

              {selectedSubmission.company && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <div className="flex items-center text-gray-900">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedSubmission.company}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submitted
                </label>
                <div className="text-gray-900">
                  {formatDate(selectedSubmission.created_at)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Status
                </label>
                <div>
                  {selectedSubmission.email_sent ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Sent {selectedSubmission.email_sent_at && `at ${formatDate(selectedSubmission.email_sent_at)}`}
                    </span>
                  ) : selectedSubmission.email_error ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Failed: {selectedSubmission.email_error}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-900 whitespace-pre-wrap">
                {selectedSubmission.message}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={() => {
                  deleteSubmission(selectedSubmission.id);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
