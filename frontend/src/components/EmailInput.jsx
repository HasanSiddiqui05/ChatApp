import React, {useState} from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "../components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import { RiLoader5Line } from "react-icons/ri";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

const EmailInput = () => {
    const [openDialog, setOpenDialog] = useState(true);
    const {requestOtp} = useAuth()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async (data) => {
        if(!data) return;
        try{
            const res = await requestOtp(data.email)
            if (res.data?.otp) {
              console.log("OTP (SMTP Bypass):", res.data.otp)
              alert(`SMTP failed to send email. Since you are in testing/demo mode, your OTP is: ${res.data.otp}`);
            }
            navigate('/verifyOtp')
        }catch(error){
            console.log(error)
        }
    }

  return (
    <Dialog open={openDialog}>
    <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>Enter Email</DialogDescription>

            <input type="email" placeholder="Email" {...register("email")} 
            className="w-full p-2.5 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl" />
            {errors.email && (<p className="text-destructive text-xs mt-2 font-medium">{errors.email.message}</p>)}

            <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium shadow-sm transition-all active:scale-95 flex justify-center mt-4"> 
            {isSubmitting ? (<RiLoader5Line className="animate-spin" size={25}/>) : "Sign in"}
            </button>
        </DialogHeader>
        </form>
    </DialogContent>
    </Dialog>
  )
}

export default EmailInput
