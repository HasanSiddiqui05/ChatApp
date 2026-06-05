import User from "../Model/userModel.js";
import { nanoid } from "nanoid";
import { setAccess, setRefresh, sendEmail, generateOTP , getRefreshUser} from "../Service/Auth.js";

export const checkEmail = async (req, res) => {
  const { email } = req.body;
  
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const otp = await generateOTP()
    const expiry = Date.now() + 10 * 60 * 1000;

    const existing = await User.findOne({ email });

    if (!existing) {
      const uniqueId = nanoid(10)
      await User.create({ email, verificationToken: otp, verificationTokenExpiresAt: expiry, uniqueId });
    }

    if(existing){
      existing.verificationToken = otp;
      existing.verificationTokenExpiresAt = expiry;
      await existing.save();
    }
    
    await sendEmail(email, otp) 
    
    return res.status(200).json({ msg: "OTP sent" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp)
  if (!email || !otp) return res.status(400).json({ message: "Missing fields" });

  try {
    const user = await User.findOne({ email });

    if ( !user || user.verificationToken !== otp || Date.now() > user.verificationTokenExpiresAt ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const accToken = setAccess(user)
    const refToken = setRefresh(user)

    user.isVerified = true;
    user.refreshToken = refToken;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    
    await user.save();

    const options = {
        httpOnly: true,
        secure: true
    }

    const id = user.uniqueId

    return res
    .status(200)
    .cookie('accessToken', accToken, options)
    .cookie('refreshToken', refToken, options)
    .cookie('uid', id)
    .json({
        success: true,
        message: "Account Verification Complete",
        user: {
            _id: user._id,
            email: user.email,
            uniqueId: user.uniqueId,
            name: user.name,
            img: user.img,
            isVerified: user.isVerified,
            accessToken: accToken,
            refreshToken: refToken,
        },
    });
    
    
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // get user injected by verifyJWT middleware
    const user = req.user;  

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    if (req.file) {
      user.img = `/Images/${req.file.filename}`;
    }

    user.name = name;
    await user.save();

    return res.status(200).json({ message: "Account created", user });
  } catch (err) {
    console.error("Error in completeProfile:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const logoutUser = async(req, res)=> {
    await User.findByIdAndUpdate(
        req.user._id,{
            $set: {
                refreshToken: undefined,
                isVerified: false
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .clearCookie('uid', options)
    .json({
        success: true,
        message: 'User logged out Successfully'
    })
} 

export const refreshAccessToken = async(req, res)=> {
  const incomingRefToken = req.cookies.refreshToken

  if(!incomingRefToken)
    return res.status(401).json({message: 'Unauthorized Request'})

  const decodeUser = getRefreshUser(incomingRefToken)

  const user = await User.findById(decodeUser?._id)

  if(!user)
    return res.status(401).json({message: 'Invalid refresh token'})

  if(incomingRefToken != user?.refreshToken)
    return res.status(401).json({message: 'refresh token is used'})

  const accToken = setAccess(user)
  const refToken = setRefresh(user)
    
  const options = {
    httpOnly: true,
    secure: true
  }

  user.refreshToken = refToken;
  await user.save();

  const id = user.uniqueId;

  return res
  .status(200)
  .cookie('accessToken', accToken, options)
  .cookie('refreshToken', refToken, options)
  .cookie('uid', id)
  .json({
      success: true,
      message: "Access Token refreshed",
      user: {
          _id: user._id,
          email: user.email,
          uniqueId: user.uniqueId,
          name: user.name,
          img: user.img,
          isVerified: user.isVerified,
          accessToken: accToken,
          refreshToken: refToken
      },
  });
}