import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

dotenv.config();

async function generateOTP(){
    return await crypto.randomInt(111111,999999).toString();
}

const transpoter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "hasansiddiqui17098@gmail.com",
      pass: "vbhj lqew trkc drci",
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
    socketTimeout: 10000,     // 10 seconds
})

async function sendEmail(receiverEmail, verificationToken){
    const mailOtions = {
        from: 'hasansiddiqui17098@gmail.com',
        to: receiverEmail,
        subject: 'Verify Account Chat-App',
        text: `Your six digit verification code is : ${verificationToken} \n This code will expire in 10 minutes`
    }
    await transpoter.sendMail(mailOtions)
}

function setAccess(user){
    return jwt.sign({
        _id: user._id,
        email: user.email
    },
    process.env.ACCESS_KEY, {expiresIn: '1h'})
}

function setRefresh(user){
    return jwt.sign({
        _id: user._id,
        email: user.email
    },
    process.env.REFRESH_KEY, {expiresIn: '7d'})
}

function getAccessUser(token){
    if (!token) return null
    try{
        const user = jwt.verify(token, process.env.ACCESS_KEY)
        return user
    }catch(err){
        console.log('Token verification failed: ', err.message)
        return null
    }
}

function getRefreshUser(token){
    if (!token) return null
    try{
        const user = jwt.verify(token, process.env.REFRESH_KEY)
        return user
    }catch(err){
        console.log('Token verification failed: ', err.message)
        return null
    }
}

export {sendEmail, generateOTP, getAccessUser, getRefreshUser, setAccess, setRefresh}