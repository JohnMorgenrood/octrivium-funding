'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Mail, 
  Send, 
  Archive, 
  Star, 
  Trash2, 
  Search, 
  Pencil, 
  Inbox,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Paperclip,
  ArrowLeft,
  Zap
} from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  htmlBody: string | null;
  textBody: string | null;
  attachments: any;
  isRead: boolean;
  isStarred: boolean;
  folder: string;
  sentAt: string;
  isSent: boolean;
}

export default function EmailDashboard() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState({ used: 0, limit: 50, plan: 'FREE' });

  useEffect(() => {
    fetchEmails();
    fetchQuotaInfo();
  }, [folder]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/emails?folder=${folder}`);
      const data = await res.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotaInfo = async () => {
    try {
      const res = await fetch('/api/emails/quota');
      const data = await res.json();
      setQuotaInfo(data);
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    }
  };

  const markAsRead = async (emailId: string) => {
    try {
      await fetch(`/api/emails/${emailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      fetchEmails();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const toggleStar = async (emailId: string, currentState: boolean) => {
    try {
      await fetch(`/api/emails/${emailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isStarred: !currentState }),
      });
      fetchEmails();
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  const deleteEmail = async (emailId: string) => {
    try {
      await fetch(`/api/emails/${emailId}`, {
        method: 'DELETE',
      });
      setSelectedEmail(null);
      fetchEmails();
    } catch (error) {
      console.error('Failed to delete email:', error);
    }
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      markAsRead(email.id);
    }
  };

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.fromEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (email.fromName && email.fromName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const unreadCount = emails.filter(e => !e.isRead && e.folder === 'inbox').length;
  const quotaPercentage = (quotaInfo.used / quotaInfo.limit) * 100;
  const isNearLimit = quotaPercentage >= 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Mail className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Email</h1>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quota Display */}
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                <Zap className={`w-4 h-4 ${isNearLimit ? 'text-amber-500' : 'text-purple-600'}`} />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {quotaInfo.used} / {quotaInfo.plan === 'BUSINESS' ? '∞' : quotaInfo.limit}
                  </div>
                  <div className="text-xs text-gray-500">{quotaInfo.plan} Plan</div>
                </div>
              </div>

              {/* Upgrade Button */}
              {quotaInfo.plan === 'FREE' && (
                <Link
                  href="/dashboard/emails/upgrade"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
                >
                  Upgrade Plan
                </Link>
              )}

              {/* Compose Button */}
              <button
                onClick={() => setShowCompose(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Compose
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setFolder('inbox')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    folder === 'inbox'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Inbox className="w-5 h-5" />
                  <span className="flex-1 text-left">Inbox</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setFolder('sent')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    folder === 'sent'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span className="flex-1 text-left">Sent</span>
                </button>

                <button
                  onClick={() => setFolder('drafts')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    folder === 'drafts'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="flex-1 text-left">Drafts</span>
                </button>

                <button
                  onClick={() => setFolder('starred')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    folder === 'starred'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Star className="w-5 h-5" />
                  <span className="flex-1 text-left">Starred</span>
                </button>

                <button
                  onClick={() => setFolder('trash')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    folder === 'trash'
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="flex-1 text-left">Trash</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Email List */}
          <div className="col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4">Loading emails...</p>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No emails in {folder}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => handleEmailClick(email)}
                      className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedEmail?.id === email.id ? 'bg-purple-50' : ''
                      } ${!email.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(email.id, email.isStarred);
                          }}
                          className="mt-1"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              email.isStarred
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                          />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`font-medium text-sm truncate ${
                                !email.isRead ? 'text-gray-900' : 'text-gray-600'
                              }`}
                            >
                              {email.isSent ? email.toEmail : (email.fromName || email.fromEmail)}
                            </span>
                            {!email.isRead && (
                              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            )}
                          </div>
                          <p
                            className={`text-sm truncate mb-1 ${
                              !email.isRead ? 'font-medium text-gray-900' : 'text-gray-600'
                            }`}
                          >
                            {email.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {email.textBody?.substring(0, 100)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(email.sentAt).toLocaleDateString('en-ZA', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {email.attachments && (
                              <Paperclip className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email Preview */}
          <div className="col-span-5">
            {selectedEmail ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Email Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="lg:hidden text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedEmail.subject}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">
                          {selectedEmail.isSent ? 'To:' : 'From:'}{' '}
                          {selectedEmail.isSent
                            ? selectedEmail.toEmail
                            : selectedEmail.fromName || selectedEmail.fromEmail}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(selectedEmail.sentAt).toLocaleString('en-ZA', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStar(selectedEmail.id, selectedEmail.isStarred)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedEmail.isStarred
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEmail(selectedEmail.id)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {selectedEmail.htmlBody ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }}
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedEmail.textBody}
                    </p>
                  )}

                  {/* Attachments */}
                  {selectedEmail.attachments && Array.isArray(selectedEmail.attachments) && selectedEmail.attachments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Attachments ({selectedEmail.attachments.length})
                      </h3>
                      <div className="space-y-2">
                        {selectedEmail.attachments.map((attachment: any, idx: number) => (
                          <a
                            key={idx}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Paperclip className="w-4 h-4 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {attachment.filename}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(attachment.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select an email to read</p>
                  <p className="text-sm mt-2">Choose an email from the list to view its contents</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSent={() => {
            setShowCompose(false);
            fetchEmails();
            fetchQuotaInfo();
          }}
        />
      )}
    </div>
  );
}

// Compose Modal Component
function ComposeModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!to || !subject || !body) {
      setError('Please fill in all fields');
      return;
    }

    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      onSent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">New Message</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
