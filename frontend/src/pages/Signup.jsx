import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "../components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "../components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name should be greater than 2 characters"),
});

const Signup = () => {
  const [dialog, setDialogStep] = useState(1);
  const [otpValue, setOtpValue] = useState("");
  const { requestOtp, verifyOtp, completeProfile } = useAuth();
  const navigate = useNavigate()
  const { register, handleSubmit, getValues, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });

  const handleEmailSubmit = async () => {
    const email = getValues("email");
    if (!email) return;
    try {
      await requestOtp(email);
      setDialogStep(2);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleOtpSubmit = async () => {
    const email = getValues("email");
    try {
      await verifyOtp(email, otpValue);
      setDialogStep(3);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const email = getValues("email");
    const name = getValues("name");
    const file = e.target.img.files[0];

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    if (file) formData.append("img", file);

    try {
      await completeProfile(formData);
      navigate('/home')
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <form>
      <Dialog open={dialog > 0} onOpenChange={setDialogStep}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Create Account
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              {dialog === 1 && <>Enter Email</>}
              {dialog === 2 && <>Enter OTP</>}
              {dialog === 3 && <>Complete Profile Creation</>}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Email */}
          {dialog === 1 && (
            <>
              <input type="email" placeholder="Email" {...register("email")} className="w-full p-2 border border-gray-300 rounded-lg"/>
              {errors.email && ( <p className="text-red-500 text-sm mt-2"> {errors.email.message} </p> )}
              <button type="submit" onClick={handleSubmit(handleEmailSubmit)} className="w-full px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-700 mt-2"> Verify </button>
            </>
          )}

          {/* Step 2: OTP */}
          {dialog === 2 && (
            <div className="flex flex-col justify-center items-center gap-6">
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otpValue} onChange={(val) => setOtpValue(val)} >
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="w-10 h-10 border border-slate-800 text-lg focus:ring-8 focus:ring-blue-800" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <button type="button" onClick={handleSubmit(handleOtpSubmit)} className="w-full px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-700" > Confirm </button>
            </div>
          )}

          {/* Step 3: Complete profile */}
          {dialog === 3 && (
            <form onSubmit={handleSubmit(handleProfileSubmit)}>
              <input placeholder="Name" {...register("name")} className="w-full p-2 border border-gray-300 rounded-lg mb-4" />
              {errors.name && ( <p className="text-red-500 text-sm"> {errors.name.message} </p> )}
              <p className="text-sm text-muted-foreground"> Add Image (Optional) </p>
              <input type="file" name="img" className="w-full text-sm font-medium p-2 border border-gray-300 rounded-lg mb-4" />
              <button type="submit" className="w-full px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-700" > Complete </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default Signup;
