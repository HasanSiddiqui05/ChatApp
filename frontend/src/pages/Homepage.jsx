import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Landing from "../components/Landing";
import Chat from "../components/Chat";
import MainHeader from "../components/MainHeader";
import { useContactContext } from "../context/ContactContext";

const Homepage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const { contacts } = useContactContext();
  
  const selectedChat = contacts.find(c => c.uniqueId === selectedChatId) || null;

  return (
    <div className="flex w-full h-[100dvh] bg-gradient-to-br from-primary/10 via-white to-primary/5 overflow-hidden">
      {/* Sidebar Section */}
      <div
        className={`
          w-full md:w-2/5 lg:w-1/3 xl:w-1/4
          bg-white border-r border-slate-200 shadow-sm z-10
          ${selectedChat && "hidden md:block"}
        `}
      >
        <Sidebar onSelectContact={(c) => setSelectedChatId(c.uniqueId)} />
      </div>

      {/* Chat Section */}
      <div
        className={`
          hidden md:flex flex-col items-center justify-center
          md:w-3/5 lg:w-2/3 xl:w-3/4
          ${selectedChat ? "flex md:flex" : "hidden md:flex"}
        `}
      >
        <div className="w-[98%] max-w-6xl mt-1 md:mt-0 flex flex-col gap-2 h-full py-4">
          <MainHeader />
          {selectedChat ? (
            <Chat contact={selectedChat} onBack={() => setSelectedChatId(null)} />
          ) : (
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center">
              <Landing />
            </div>
          )}
        </div>
      </div>

      {/* Chat for Mobile */}
      {selectedChat && (
        <div className="flex md:hidden w-full h-[100dvh] bg-white overflow-hidden">
          <Chat contact={selectedChat} onBack={() => setSelectedChatId(null)} />
        </div>
      )}
    </div>
  );
};

export default Homepage;



// import React , {useState} from "react";
// import { Routes, Route } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Landing from "../components/Landing";
// import Chat from "../components/Chat";
// import MainHeader from "../components/MainHeader";

// const Homepage = () => {
//   const [selectedChat, setSelectedChat] = useState(null);

//   return (
//     <div className="flex">
//       <div className="xl:w-1/4 lg:w-1/3 md:w-2/5 w-full">
//         {selectedChat? <Sidebar onSelectContact={setSelectedChat}/> : <></>}
//       </div>
//       <div className="hidden xl:w-3/4 lg:w-2/3 md:w-3/5 md:flex flex-col items-center justify-center">
//         <div className="w-[97%] mt-1 md:mt-0 flex flex-col gap-2">
//           <MainHeader />
//           {selectedChat? <Chat contact={selectedChat}/> : <Landing/>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Homepage;
