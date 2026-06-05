import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { LogOut, Edit } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import EditProfileDialog from './EditProfileDialog'

const MainHeader = () => {
  const {logout, AuthState} = useAuth()
  const uid = Cookies.get('uid') || AuthState?.user?.uniqueId
  const [showEditProfile, setShowEditProfile] = useState(false)
  
  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className={`w-full flex items-center p-3 sm:p-4 rounded-xl border border-slate-100 bg-white shadow-sm ${uid ? 'justify-between relative' : 'justify-center'}`}>
      
      {/* Left side: Edit Profile */}
      {uid && (
        <button
          type="button"
          onClick={() => setShowEditProfile(true)}
          className="flex items-center text-xs sm:text-sm font-semibold gap-1.5 cursor-pointer text-slate-600 hover:text-primary transition-colors hover:bg-slate-50 px-2.5 py-1.5 rounded-lg"
        >
          <Edit size={16}/> <span className="hidden xs:inline sm:inline">Edit Profile</span>
        </button>
      )}

      {/* Middle: Unique ID */}
      <p className={`text-xs sm:text-sm font-semibold text-slate-800 ${uid ? 'absolute left-1/2 transform -translate-x-1/2' : ''}`}>
        {uid ? (
          <span>Unique ID: <span className="text-primary font-bold">{uid}</span></span>
        ) : (
          <span>Login to Start Chatting</span>
        )}
      </p>

      {/* Right side: Logout */}
      {uid && (
        <button type='button' onClick={handleLogout} className="flex items-center text-xs sm:text-sm font-semibold gap-1.5 cursor-pointer text-destructive hover:bg-destructive/10 transition-colors px-2.5 py-1.5 rounded-lg">
          <span className="hidden xs:inline sm:inline">Log out</span> <LogOut size={16}/>
        </button>
      )}

      {/* Edit Profile Dialog */}
      <EditProfileDialog open={showEditProfile} onClose={() => setShowEditProfile(false)} />
    </div>
  )
}

export default MainHeader
