import React from "react";

const ContactItem = ({ uniqueId, name, img, lastMessage, lastMessageAt, isSaved, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer py-3 px-4 mb-2 items-center gap-3 hover:bg-slate-50 active:bg-slate-100 rounded-2xl transition-all border border-transparent hover:border-slate-100 group w-full overflow-hidden"
    >
      <div className="relative shrink-0">
        <img
          src={img ? `${import.meta.env.VITE_BACKEND_URL}${img}` : `${import.meta.env.VITE_BACKEND_URL}/Images/default.jpg`}
          className="rounded-full h-12 w-12 object-cover border-2 border-white shadow-sm group-hover:border-primary/20 transition-colors"
          alt="Profile"
        />
        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center w-full mb-0.5 gap-2 min-w-0">
          <p className="text-[15px] font-semibold text-slate-800 truncate flex-1 min-w-0">
            {name} {!isSaved && <span className="text-[11px] text-slate-400 font-normal ml-1">({uniqueId})</span>}
          </p>
          {lastMessageAt && (
            <p className="text-[11px] text-slate-400 font-medium shrink-0 whitespace-nowrap">
              {new Date(lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <p className="text-[13px] text-slate-500 truncate w-full">{lastMessage || "No messages yet"}</p>
      </div>
    </div>
  );
};

export default ContactItem;

