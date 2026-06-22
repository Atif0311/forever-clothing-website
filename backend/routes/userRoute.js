import express from 'express';
import authUser from '../middleware/auth.js';
import { loginUser,registerUser,adminLogin, getUserProfile, updateUserProfile, getWishlist, toggleWishlist } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/profile',authUser,getUserProfile)
userRouter.post('/update-profile',authUser,updateUserProfile)
userRouter.post('/wishlist',authUser,getWishlist)
userRouter.post('/wishlist/toggle',authUser,toggleWishlist)

export default userRouter;
