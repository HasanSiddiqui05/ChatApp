import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String
        },
        img: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        uniqueId: {
            type: String,
            unique: true,
        },
        refreshToken: {
            type: String
        },
        verificationToken: String,
        verificationTokenExpiresAt: Date,
    },
    {timestamps: true}
)

const User = mongoose.model('users', userSchema)
export default User


