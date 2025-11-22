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
  Zap,
  Settings,
  Menu,
  Activity,
  RefreshCw
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState({ used: 0, limit: 50, plan: 'FREE' });
  const [syncing, setSyncing] = useState(false);

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

  const syncEmails = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/emails/sync', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok) {
        console.log('Sync complete:', data);
        fetchEmails();
      } else {
        console.error('Sync failed:', data.error);
      }
    } catch (error) {
      console.error('Failed to sync emails:', error);
    } finally {
      setSyncing(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="lg:hidden p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Email
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px] sm:max-w-none">{session?.user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quota Display - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm">
                <Zap className={`w-4 h-4 ${isNearLimit ? 'text-amber-500 dark:text-amber-400' : 'text-purple-600 dark:text-purple-400'}`} />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {quotaInfo.used} / {quotaInfo.plan === 'BUSINESS' ? '∞' : quotaInfo.limit}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{quotaInfo.plan} Plan</div>
                </div>
              </div>

              {/* Settings Button */}
              <button
                onClick={syncEmails}
                disabled={syncing}
                className="hidden sm:block p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sync Emails from Resend"
              >
                <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
              </button>

              <Link
                href="/dashboard/emails/diagnostics"
                className="hidden sm:block p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all hover:scale-105"
                title="Email Diagnostics"
              >
                <Activity className="w-5 h-5" />
              </Link>

              <Link
                href="/dashboard/emails/settings"
                className="hidden sm:block p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all hover:scale-105"
                title="Email Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Upgrade Button - Hidden on mobile */}
              {quotaInfo.plan === 'FREE' && (
                <Link
                  href="/dashboard/emails/upgrade"
                  className="hidden sm:inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all text-xs sm:text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
                >
                  Upgrade
                </Link>
              )}

              {/* Compose Button */}
              <button
                onClick={() => setShowCompose(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 font-semibold text-sm sm:text-base"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Compose</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Mobile Sidebar Overlay */}
          {showMobileSidebar && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
            w-72 lg:w-auto lg:col-span-3
            transform lg:transform-none transition-transform duration-300 ease-in-out
            ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="h-full lg:h-auto bg-white dark:bg-gray-900 lg:bg-white/80 lg:dark:bg-gray-900/80 backdrop-blur-xl lg:rounded-2xl shadow-lg border-r lg:border border-gray-200 dark:border-gray-800 p-4 pt-20 lg:pt-4">
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setFolder('inbox');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    folder === 'inbox'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Inbox className="w-5 h-5" />
                  <span className="flex-1 text-left">Inbox</span>
                  {unreadCount > 0 && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      folder === 'inbox' 
                        ? 'bg-white/30 text-white' 
                        : 'bg-purple-600 dark:bg-purple-500 text-white'
                    }`}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setFolder('sent');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    folder === 'sent'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span className="flex-1 text-left">Sent</span>
                </button>

                <button
                  onClick={() => {
                    setFolder('drafts');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    folder === 'drafts'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="flex-1 text-left">Drafts</span>
                </button>

                <button
                  onClick={() => {
                    setFolder('starred');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    folder === 'starred'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Star className="w-5 h-5" />
                  <span className="flex-1 text-left">Starred</span>
                </button>

                <button
                  onClick={() => {
                    setFolder('trash');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    folder === 'trash'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="flex-1 text-left">Trash</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Email List */}
          <div className={`lg:col-span-4 ${selectedEmail ? 'hidden lg:block' : ''}`}>
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
                  <p className="mt-4 font-medium">Loading emails...</p>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No emails in {folder}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => handleEmailClick(email)}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedEmail?.id === email.id 
                          ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-l-4 border-purple-600' 
                          : !email.isRead 
                          ? 'bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(email.id, email.isStarred);
                          }}
                          className="mt-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              email.isStarred
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-400 dark:text-gray-600 hover:text-yellow-500'
                            }`}
                          />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`font-semibold text-sm truncate ${
                                !email.isRead ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {email.isSent ? email.toEmail : (email.fromName || email.fromEmail)}
                            </span>
                            {!email.isRead && (
                              <span className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse"></span>
                            )}
                          </div>
                          <p
                            className={`text-sm truncate mb-1 ${
                              !email.isRead ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {email.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                            {email.textBody?.substring(0, 100)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                              {new Date(email.sentAt).toLocaleDateString('en-ZA', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {email.attachments && (
                              <Paperclip className="w-3 h-3 text-gray-400 dark:text-gray-500" />
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
          <div className={`lg:col-span-5 ${selectedEmail ? 'col-span-1' : 'hidden lg:block'}`}>
            {selectedEmail ? (
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Email Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <div className="flex items-start justify-between mb-4">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="lg:hidden mr-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {selectedEmail.subject}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">
                          {selectedEmail.isSent ? 'To:' : 'From:'}{' '}
                          {selectedEmail.isSent
                            ? selectedEmail.toEmail
                            : selectedEmail.fromName || selectedEmail.fromEmail}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
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
                      className={`p-2.5 rounded-xl transition-all hover:scale-105 ${
                        selectedEmail.isStarred
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 shadow-lg shadow-yellow-500/20'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEmail(selectedEmail.id)}
                      className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all hover:scale-105"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {selectedEmail.htmlBody ? (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {selectedEmail.textBody}
                    </p>
                  )}

                  {/* Attachments */}
                  {selectedEmail.attachments && Array.isArray(selectedEmail.attachments) && selectedEmail.attachments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        Attachments ({selectedEmail.attachments.length})
                      </h3>
                      <div className="space-y-2">
                        {selectedEmail.attachments.map((attachment: any, idx: number) => (
                          <a
                            key={idx}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all border border-purple-200 dark:border-purple-800 hover:scale-[1.02] hover:shadow-lg"
                          >
                            <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                              <Paperclip className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {attachment.filename}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
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
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 h-full flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="mb-4 p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl inline-block">
                    <Mail className="w-16 h-16 text-purple-600 dark:text-purple-400 opacity-50" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Select an email to read</p>
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
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 flex-shrink-0 rounded-t-2xl">
          <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            New Message
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400 text-sm shadow-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={8}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Footer - Always Visible */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0 rounded-b-2xl gap-2">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all font-medium hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 disabled:hover:scale-100"
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
