import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  contact: {
    type: String, 
    required: true,
  },
  nickname: {
    type: String,
  }
}, { timestamps: true });

const Contact = mongoose.model("contacts", contactSchema);

export default Contact;
