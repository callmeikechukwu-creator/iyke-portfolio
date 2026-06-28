"use client";

import { useEffect, useState } from "react";
import { 
  Mail, Trash2, CheckCircle2, Circle, AlertCircle, Loader2, Calendar, User, 
  MessageSquareQuote, MailOpen 
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError("Failed to load messages inbox");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching contact submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    setError("");
    const newRead = !msg.read;

    try {
      const response = await fetch(`/api/admin/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: newRead }),
      });

      if (response.ok) {
        const updated = await response.json();
        
        // Update local list
        setMessages(messages.map(m => m.id === msg.id ? updated : m));
        
        // Update selection if active
        if (selectedMessage && selectedMessage.id === msg.id) {
          setSelectedMessage(updated);
        }

        setSuccess(`Message marked as ${newRead ? "read" : "unread"}`);
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError("Failed to modify read status");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred updating the message status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message permanently?")) return;
    setError("");

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Message deleted successfully!");
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError("Failed to delete message");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting this message");
    }
  };

  const selectMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    // Auto-mark as read on click if it was unread
    if (!msg.read) {
      handleToggleRead(msg);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-body h-full">
      
      {/* 1. Header Toolbar */}
      <div className="flex justify-between items-center border-b border-ink/5 pb-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue" />
            Client Submissions Inbox
          </h2>
          <p className="text-xs text-muted">
            Read and manage contact messages received from the homepage form.
          </p>
        </div>
      </div>

      {/* Action status notification */}
      {error && (
        <div className="p-4 bg-orange/5 border border-orange/20 text-orange text-sm rounded-2xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-sm rounded-2xl flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 2. Inbox Workspace Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue" />
            <span className="text-sm text-muted">Opening secure inbox...</span>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-24 bg-cream/10 rounded-3xl border border-dashed border-ink/10 flex flex-col items-center gap-3">
          <MailOpen className="w-12 h-12 text-muted/30" />
          <p className="text-sm text-muted">Your inbox is empty. No messages submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full min-h-[500px]">
          
          {/* Messages List Column */}
          <div className="lg:col-span-5 flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => selectMessage(msg)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative flex flex-col gap-2
                  ${selectedMessage?.id === msg.id 
                    ? "bg-blue/5 border-blue/20 shadow-sm" 
                    : "bg-white border-ink/5 hover:bg-cream/10 hover:border-ink/10"
                  }`}
              >
                {/* Unread dot */}
                {!msg.read && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue animate-pulse" />
                )}

                <div className="flex justify-between items-start pr-4">
                  <strong className="text-sm text-ink truncate max-w-[180px]">{msg.name}</strong>
                  <span className="text-[10px] text-muted font-semibold font-mono">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <span className="text-xs text-muted truncate">{msg.email}</span>
                <p className="text-xs text-ink/70 line-clamp-2 mt-1 italic font-body">
                  "{msg.message}"
                </p>
              </div>
            ))}
          </div>

          {/* Message Details Preview Column */}
          <div className="lg:col-span-7 lg:sticky lg:top-8 bg-cream/20 p-6 rounded-3xl border border-ink/5 flex flex-col gap-6 min-h-[400px] justify-between">
            {selectedMessage ? (
              <div className="flex flex-col gap-6 h-full">
                
                {/* Header detail */}
                <div className="flex flex-col gap-3 border-b border-ink/5 pb-4">
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2 text-ink font-semibold">
                      <User className="w-4 h-4 text-blue" />
                      <span>{selectedMessage.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleRead(selectedMessage)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer
                          ${selectedMessage.read
                            ? "bg-cream text-muted border-ink/5 hover:bg-ink hover:text-cream"
                            : "bg-blue text-cream border-blue hover:bg-blue/80"
                          }`}
                      >
                        {selectedMessage.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="p-1.5 hover:bg-red-500/10 hover:text-red-500 text-muted transition-colors rounded-xl cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-muted font-mono">
                    <span>Email: <a href={`mailto:${selectedMessage.email}`} className="text-blue hover:underline">{selectedMessage.email}</a></span>
                    <span className="flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-muted/60" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>

                </div>

                {/* Message Body */}
                <div className="flex-1 bg-white p-5 rounded-2xl border border-ink/5 shadow-inner">
                  <div className="flex gap-2 items-start mb-2">
                    <MessageSquareQuote className="w-5 h-5 text-blue/30 flex-shrink-0" />
                    <span className="text-[10px] text-muted/75 font-semibold uppercase tracking-wider font-body">Message Body</span>
                  </div>
                  <p className="text-sm text-ink/90 leading-relaxed font-body whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Quick Reply Link */}
                <div className="mt-4 border-t border-ink/5 pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Inquiry`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ink text-cream hover:bg-blue hover:text-cream transition-colors duration-300 rounded-full font-semibold text-xs tracking-wider uppercase"
                  >
                    Reply via Email
                  </a>
                </div>

              </div>
            ) : (
              <div className="flex flex-col justify-center items-center text-center gap-3 my-auto py-16">
                <Mail className="w-8 h-8 text-muted/30" />
                <span className="text-sm text-muted">Select a message from the inbox to read.</span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
