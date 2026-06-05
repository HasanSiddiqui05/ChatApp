import React from 'react'

const Message = ({ text, time, sender }) => {
  const isMe = sender === "me";
  
  return (
    <div className={`flex w-full mb-3 ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div 
        className={`relative w-fit max-w-[85%] md:max-w-[75%] px-4 py-2.5 text-[15px] shadow-sm flex flex-col gap-1 ${
          isMe 
            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" 
            : "bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-100"
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word' }}>{text}</p>
        <div className={`text-[10px] self-end flex items-center gap-1 mt-0.5 shrink-0 ${isMe ? "text-primary-foreground/70" : "text-slate-400"}`}>
          <span>{time}</span>
          {isMe && (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message
