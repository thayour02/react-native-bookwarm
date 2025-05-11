
import express from 'express'

const router = express.Router()

import  { Register,Login } from '../controller/auth.js'


router.post('/register', Register)
router.post('/login', Login)




export default router