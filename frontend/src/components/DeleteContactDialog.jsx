import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RiLoader5Line } from "react-icons/ri";
import axios from "axios";
import { useContactContext } from "../context/ContactContext";

const DeleteContactDialog = ({ open, onClose, contact, onDeleted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const { fetchContacts } = useContactContext();

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setApiError("");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/contact/deleteContact/${contact.uniqueId}`, {
        withCredentials: true,
      });

      await fetchContacts();
      onClose();
      if (onDeleted) {
        onDeleted();
      }
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.msg || "Failed to delete contact.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-destructive">Delete Contact</DialogTitle>
          <DialogDescription className="text-slate-600 mb-4">
            Are you sure you want to delete <span className="font-semibold text-slate-800">{contact?.name}</span>? 
            This will permanently remove your chat history with them. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <p className="text-destructive text-xs mb-3 font-medium text-center bg-destructive/10 p-2 rounded-md">
            {apiError}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 mt-4">
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-white rounded-xl font-medium transition-colors flex items-center justify-center min-w-[90px] disabled:opacity-50"
          >
            {isSubmitting ? <RiLoader5Line className="animate-spin" size={20} /> : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteContactDialog;
