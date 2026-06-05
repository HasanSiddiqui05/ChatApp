import React, { useState, useEffect } from "react";
import ContactList from "./ContactList";
import Logo from "../assets/Logo.png";
import AddContact from "./AddContact";
import MainHeader from "./MainHeader";
import { useContactContext } from "../context/ContactContext";

const Sidebar = ({onSelectContact}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { contacts } = useContactContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.uniqueId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col h-full">

      {/* Logo + Search + Add Contact */}
      <div className="w-full flex flex-col px-4 md:py-6 pb-4 border-b border-slate-100">
        <div className="flex justify-center items-center mb-6">
          <img src={Logo} alt="Logo" className="w-28 drop-shadow-sm" />
        </div>
        <div className="flex w-full items-center gap-3">
          <div className="relative flex-1">
            <input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
            />
          </div>
          <AddContact open={openDialog} onClose={() => setOpenDialog(false)} />
        </div>
      </div>

      {/* Contacts List */}
      <ContactList contacts={filteredContacts} onSelectContact={onSelectContact} />

      {/* Mobile Header (Bottom) */}
      <div className="md:hidden w-full border-t border-slate-100 bg-slate-50/50 p-2 mt-auto">
        <MainHeader />
      </div>
    </div>
  );
};

export default Sidebar;
