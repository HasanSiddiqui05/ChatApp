import React from "react";
import ContactItem from "./ContactItem";
import { UserPlus } from "lucide-react";

const ContactList = ({ contacts = [], onSelectContact }) => {
  return (
    <div className="flex flex-1 overflow-y-auto overflow-x-hidden flex-col px-5 py-2">
      {contacts.length > 0 ? (
        contacts.map((c) => <ContactItem key={c.uniqueId} {...c} onClick={() => onSelectContact(c)} />)
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2 mt-15">
          <UserPlus size={40} />
          <p className="lg:text-xl text-lg font-medium">
            Add contacts and start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactList;
