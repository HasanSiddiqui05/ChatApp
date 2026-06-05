import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RiLoader5Line } from "react-icons/ri";
import axios from "axios";
import { useContactContext } from "../context/ContactContext";

const schema = z.object({
  name: z.string().min(2, "Name should be greater than 2 characters"),
  cid: z.string().min(10, "Unique ID must be exactly 10 characters long").max(10, "Unique ID must be exactly 10 characters long"),
});

const AddContact = ({ open, onClose, prefilledCid, prefilledName }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({ 
    resolver: zodResolver(schema), 
    defaultValues: { name: prefilledName || "", cid: prefilledCid || "" }
  });
  const [apiError, setApiError] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);
  const { fetchContacts } = useContactContext();
  
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onClose ? onClose : setInternalOpen;

  const onSubmit = async (data) => {
    try {
      setApiError("");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact/addContact`,
        { name: data.name, cid: data.cid, },
        { withCredentials: true } 
      );

      console.log("Contact added:", res.data);
      reset(); 
      await fetchContacts(); 
      setIsOpen(false);

    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.msg || "Failed to add contact. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {open === undefined && (
        <DialogTrigger asChild>
          <button className="p-2.5 px-4 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-sm transition-all active:scale-95 text-sm cursor-pointer whitespace-nowrap">
            Add Contact
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add Contact</DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            Enter Details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Name" {...register("name")} className="w-full p-2.5 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg mb-2"/>
          {errors.name && ( <p className="text-destructive text-xs mb-2 font-medium">{errors.name.message}</p> )}

          <input 
            placeholder="Unique ID" 
            {...register("cid")}
            disabled={!!prefilledCid}
            className={`w-full p-2.5 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg mb-2 ${prefilledCid ? "bg-slate-100 text-slate-500" : ""}`}
          />
          {errors.cid && ( <p className="text-destructive text-xs mb-2 font-medium">{errors.cid.message}</p>)}
          
          {apiError && ( <p className="text-destructive text-xs mb-3 font-medium text-center bg-destructive/10 p-2 rounded-md">{apiError}</p> )}

          <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-sm transition-all text-center flex justify-center disabled:opacity-50">
            {isSubmitting ? ( <RiLoader5Line className="animate-spin" size={25} /> ) : ( "Confirm" )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContact;
