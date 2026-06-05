import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "../components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "../components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { RiLoader5Line } from "react-icons/ri";

const schema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

const OtpInput = () => {
  const [backendError, setBackendError] = useState("");
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const { handleSubmit, setValue, formState: { errors, isSubmitting }, } = useForm({ resolver: zodResolver(schema), defaultValues: { otp: "" }, });

  const handleOtpSubmit = async (data) => {
    try {
      setBackendError("");
      await verifyOtp(data.otp); 
      navigate("/completeProfile");
    } catch (error) {
      setBackendError(
        error.response?.data?.message || "Failed to verify OTP. Try again."
      );
    }
  };

  return (
    <Dialog open>
      <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create Account</DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            Enter OTP
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleOtpSubmit)}>
          <div className="flex flex-col justify-center items-center gap-6">
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} onChange={(val) => setValue("otp", val, { shouldValidate: true })} >
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => ( <InputOTPSlot key={i} index={i} className="w-12 h-12 border border-slate-300 text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md transition-all" /> ))}
              </InputOTPGroup>
            </InputOTP>
            {errors.otp && ( <p className="text-destructive text-xs font-medium -mt-2">{errors.otp.message}</p> )}
            {backendError && ( <p className="text-destructive text-xs font-medium -mt-2 bg-destructive/10 p-2 rounded-md">{backendError}</p> )}
            <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-sm transition-all active:scale-95 flex justify-center disabled:opacity-50" >
              {isSubmitting ? ( <RiLoader5Line className="animate-spin" size={25} /> ) : (  "Confirm" )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpInput;
