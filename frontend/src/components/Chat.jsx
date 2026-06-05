import React, { useState, useRef, useEffect } from 'react'
import ChatBox from './ChatBox'
import EditContactDialog from './EditContactDialog'
import DeleteContactDialog from './DeleteContactDialog'
import AddContact from './AddContact'
import { Textarea } from "@/components/ui/textarea"
import { Send, Phone, Video, MoreVertical } from "lucide-react"
import axios from "axios";
import Cookies from "js-cookie";
import { useSocketContext } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/message/`;

const Chat = ({ contact, onBack }) => {
  const [text, setText] = useState("");
  const { socket, onlineUsers } = useSocketContext();
  const { AuthState } = useAuth();
  const isOnline = onlineUsers?.includes(contact.uniqueId);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [hidePopup, setHidePopup] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setHidePopup(false);
  }, [contact.uniqueId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;

    const user1 = Cookies.get('uid') || AuthState?.user?.uniqueId;
    const user2 = contact.uniqueId;

    // Create optimistic message object (optional, backend will return real one)
    const newMsg = {
      sender: user1,
      receiver: user2,
      content: text.trim(),
      messageType: "text",
    };

    setText(""); // Clear input early for better UX

    try {
      // 1. Emit via socket instantly
      if (socket) {
        socket.emit("sendMessage", newMsg);
      }

      // 2. Save to database
      await axios.post(API_URL, newMsg, { withCredentials: true });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      {/* Header */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between py-3 px-6 z-10">
        <div className="flex items-center gap-4">
          {/* Back button for mobile */}
          <button onClick={onBack} className="md:hidden p-2 -ml-2 rounded-full hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>

          <div className="relative">
            <img
              className="h-11 w-11 rounded-full object-cover shadow-sm border-2 border-white"
              src={contact.img ? `${import.meta.env.VITE_BACKEND_URL}${contact.img}` : "/Images/default.jpg"}
              alt="profile"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-[15px]">
              {contact.name} {!contact.isSaved && <span className="text-xs text-slate-400 font-normal ml-1">({contact.uniqueId})</span>}
            </p>
            <p className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-slate-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors hover:text-primary"><Phone size={20} /></button>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors hover:text-primary"><Video size={20} /></button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`p-2 rounded-full transition-colors ${showDropdown ? 'bg-slate-100 text-slate-800' : 'hover:bg-slate-50 hover:text-slate-600'}`}
            >
              <MoreVertical size={20} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                {!contact.isSaved ? (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowAddDialog(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-primary/10 font-medium transition-colors"
                  >
                    Add Contact
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowEditDialog(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary font-medium transition-colors"
                    >
                      Edit Contact
                    </button>
                    <div className="h-[1px] w-full bg-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowDeleteDialog(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 font-medium transition-colors"
                    >
                      Delete Contact
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unsaved Contact Popup */}
      {!contact.isSaved && !hidePopup && (
        <div className="absolute top-[80px] left-0 right-0 mx-auto w-11/12 max-w-sm bg-white border border-slate-200 shadow-md rounded-xl p-3 z-20 flex items-center justify-between animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Unsaved Contact</p>
              <p className="text-xs text-slate-500">Save them to your list?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowAddDialog(true);
                setHidePopup(true);
              }}
              className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setHidePopup(true)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden relative bg-slate-50/50">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <ChatBox contactId={contact.uniqueId} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 z-10">
        <div className="flex items-end gap-3 bg-slate-50 p-2 pl-4 rounded-3xl border border-slate-200 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
          <Textarea
            className="w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[44px] max-h-[120px] py-3 text-[15px] shadow-none"
            placeholder={`Message ${contact.name}...`}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-sm transition-transform active:scale-95 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>

      <EditContactDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        contact={contact}
      />

      <DeleteContactDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        contact={contact}
        onDeleted={() => {
          onBack();
        }}
      />

      <AddContact
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        prefilledCid={contact.uniqueId}
        prefilledName={contact.name}
      />
    </div>
  );
};


export default Chat
