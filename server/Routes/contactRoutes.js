import { Router } from "express";
import { addContact, getChatList, editContact, deleteContact } from "../Controller/contactController.js";

const router = Router()

router.post('/addContact',  addContact)
router.get('/getAllChats', getChatList)
router.put('/editContact', editContact)
router.delete('/deleteContact/:cid', deleteContact)

export default router