import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('')
  const [AuthState, setAuthState] = useState({
    isLoggedIn: false,
    isVerified: false,
    user: null,
  });

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/user`,
    withCredentials: true,
  });

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.post("/refresh-token");
        setAuthState({
          isLoggedIn: true,
          isVerified: true,
          user: res.data.user,
        });
        scheduleTokenRefresh();
      } catch {
        setAuthState({
          isLoggedIn: false,
          isVerified: false,
          user: null,
        });
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/refresh-token");
      setAuthState({
        isLoggedIn: true,
        isVerified: true,
        user: res.data.user,
      });
      scheduleTokenRefresh();
    } catch (err) {
      console.log("Refresh failed:", err.response?.data || err.message);
      setAuthState({
        isLoggedIn: false,
        isVerified: false,
        user: null,
      });
    }
  };

  const scheduleTokenRefresh = () => {
    setTimeout(() => {
      refreshAccessToken();
    }, 55 * 60 * 1000); // refresh 5 mins before expiry
  };

  const requestOtp = async (email) => {
    setEmail(email)
    return await api.post("/request-otp", { email });
  };

  const verifyOtp = async (otp) => {
    const res = await api.post("/verify-otp", { email, otp });
    setAuthState({
      isLoggedIn: true,
      isVerified: true,
      user: res.data.user,
    });
    scheduleTokenRefresh();
    return res.data;
  };

  const completeProfile = async (formData) => {
    const res = await api.post("/complete-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setAuthState({
      isLoggedIn: true,
      isVerified: true,
      user: res.data.user,
    });
    return res.data;
  };

  const logout = async () => {
    await api.post("/logout");
    setAuthState({
      isLoggedIn: false,
      isVerified: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{ AuthState, loading, email, setEmail, requestOtp, verifyOtp, completeProfile, logout, }} >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);































// import { createContext, useContext, useState,useEffect } from "react";
// import axios from "axios";
// import {toast} from 'react-hot-toast';

// export const AuthContext = createContext()

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3000", 
//   withCredentials: true,
// });

// export const AuthProvider = ({children}) => {
//     const [user, setUser] = useState(null)
//     const [loading, setLoading] = useState(true)
    
//     useEffect(()=> {
//         const fetchUser = async () => {
//             try{
//                 const {data} = await axios.get('/api/user/me', {withCredentials: true})
//                 setUser(data.user)
//             }catch(err){
//                 setUser(err)
//             }finally{
//                 setLoading(false)
//             }
//         }
//         fetchUser();
//     }, [])

//     const login = async(email) => {
//         const res = await axios.post('/api/user/send-otp', {email}, {withCredentials: true})
//         setUser(res.data.user)
//         return res.data
//     }

//     const verifyOtp = async (email, otp) => {
//         const res = await axios.post("/api/user/verify-otp", { email, otp }, { withCredentials: true });
//         setUser(res.data.user); 
//         return res.data;
//     }
    
//     const logout = async () => {
//         await axios.post("/api/user/logout", {}, { withCredentials: true });
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider value={{ user, loading, login, verifyOtp, logout }}>
//         {children}
//         </AuthContext.Provider>
//     );
// }
