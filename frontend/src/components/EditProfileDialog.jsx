import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { RiLoader5Line } from "react-icons/ri";

const schema = z.object({
  name: z.string().min(2, "Name should be greater than 2 characters"),
});

const EditProfileDialog = ({ open, onClose }) => {
  const { AuthState, completeProfile } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [apiError, setApiError] = useState("");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open && AuthState?.user) {
      setValue("name", AuthState.user.name || "");
      if (AuthState.user.img) {
        setPreviewUrl(`${import.meta.env.VITE_BACKEND_URL}${AuthState.user.img}`);
      } else {
        setPreviewUrl("/Images/default.jpg");
      }
      setFile(null);
      setApiError("");
    }
  }, [open, AuthState?.user, setValue]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (data) => {
    try {
      setApiError("");
      const formData = new FormData();
      formData.append("name", data.name);
      if (file) {
        formData.append("img", file);
      }

      await completeProfile(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      setApiError(error.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            Update your profile name and display picture.
          </DialogDescription>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Avatar Preview & Upload */}
            <div className="flex flex-col items-center gap-3 my-2">
              <div className="relative group">
                <img
                  className="h-24 w-24 rounded-full object-cover border-4 border-slate-100 shadow-md transition-all group-hover:opacity-95"
                  src={previewUrl || "/Images/default.jpg"}
                  alt="avatar preview"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm font-medium p-2 border border-slate-200 rounded-xl file:bg-primary/10 file:text-primary file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:text-sm file:font-semibold hover:file:bg-primary/20 transition-all cursor-pointer"
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="text-xs font-semibold text-slate-500 pl-1 mb-1 block">Name</label>
              <input
                placeholder="Name"
                {...register("name")}
                className="w-full p-2.5 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl"
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* API Error Message */}
            {apiError && (
              <p className="text-destructive text-xs my-1 font-medium text-center bg-destructive/10 p-2.5 rounded-xl">
                {apiError}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium transition-all active:scale-95 text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-sm transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <RiLoader5Line className="animate-spin" size={20} />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
