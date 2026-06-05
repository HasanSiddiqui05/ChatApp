import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RiLoader5Line } from "react-icons/ri";
import axios from "axios";
import { useContactContext } from "../context/ContactContext";

const schema = z.object({
  name: z.string().min(2, "Name should be greater than 2 characters"),
});

const EditContactDialog = ({ open, onClose, contact }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const [apiError, setApiError] = useState("");
  const { fetchContacts } = useContactContext();

  useEffect(() => {
    if (contact && open) {
      setValue("name", contact.name || "");
      setApiError("");
    }
  }, [contact, open, setValue]);

  const onSubmit = async (data) => {
    try {
      setApiError("");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact/editContact`,
        { name: data.name, cid: contact.uniqueId },
        { withCredentials: true } 
      );

      reset(); 
      await fetchContacts();
      onClose();

    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.msg || "Failed to edit contact.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Contact</DialogTitle>
          <DialogDescription className="text-slate-600 mb-4">
            Update the contact's name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Name" {...register("name")} className="w-full p-2.5 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl mb-2"/>
          {errors.name && ( <p className="text-destructive text-xs mb-2 font-medium">{errors.name.message}</p> )}

          <input value={contact?.uniqueId || ""} disabled className="w-full p-2.5 border border-slate-200 bg-slate-50 text-slate-400 rounded-xl mb-2 cursor-not-allowed"/>
          <p className="text-xs text-slate-400 mb-3 ml-1">Unique ID cannot be changed.</p>
          
          {apiError && ( <p className="text-destructive text-xs mb-3 font-medium text-center bg-destructive/10 p-2 rounded-md">{apiError}</p> )}

          <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2.5 mt-2 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-sm transition-all text-center flex justify-center disabled:opacity-50">
            {isSubmitting ? ( <RiLoader5Line className="animate-spin" size={25} /> ) : ( "Save Changes" )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
