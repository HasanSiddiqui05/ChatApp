import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "../components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { RiLoader5Line } from "react-icons/ri";

const schema = z.object({
  name: z.string().min(2, "Name should be greater than 2 characters"),
  img: z.any().optional(),
});

const DetailsInput = () => {
  const [openDialog, setOpenDialog] = useState(true);
  const { completeProfile } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({ resolver: zodResolver(schema), });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (file) {
        formData.append("img", file);
      }

      await completeProfile(formData);
      navigate("/home");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <Dialog open={ openDialog} >
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create Account</DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            Complete Profile
          </DialogDescription>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <input placeholder="Name" {...register("name")} className="w-full p-2.5 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl" />
              {errors.name && ( <p className="text-destructive text-xs mt-1 font-medium">{errors.name.message}</p>)}
            </div>

            <div>
              <p className="text-sm text-slate-500 font-medium mb-1.5 pl-1">
                Add Image (Optional)
              </p>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm font-medium p-2 border border-slate-200 rounded-xl file:bg-primary/10 file:text-primary file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:text-sm file:font-semibold hover:file:bg-primary/20 transition-all cursor-pointer"/>
            </div>

            <button type="submit" className="w-full px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-sm transition-all active:scale-95 flex justify-center items-center gap-2 mt-2 disabled:opacity-50" disabled={isSubmitting} >
              {isSubmitting ? (
                <RiLoader5Line className="animate-spin" size={20} />) : ("Complete"
              )}
            </button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsInput;
