import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const getProfileResponse = (user) => ({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    age: user.age ?? "",
    gender: user.gender || "",
})

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase()

        const user = await userModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;
        const normalizedName = name?.trim()
        const normalizedEmail = email?.trim().toLowerCase()

        // checking user already exists or not
        const exists = await userModel.findOne({ email: normalizedEmail });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format
        if (!normalizedName) {
            return res.json({ success: false, message: "Please enter your name" })
        }
        if (!validator.isEmail(normalizedEmail)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (!password) {
            return res.json({ success: false, message: "Please enter a password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user profile data
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId).select("name email phone age gender")

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        res.json({ success: true, profile: getProfileResponse(user) })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for updating user profile data
const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, email, phone, age, gender } = req.body

        const trimmedName = name?.trim()
        const trimmedEmail = email?.trim().toLowerCase()
        const trimmedPhone = phone?.trim() || ""
        const trimmedGender = gender?.trim() || ""

        if (!trimmedName) {
            return res.json({ success: false, message: "Please enter your name" })
        }

        if (!trimmedEmail || !validator.isEmail(trimmedEmail)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        const existingUser = await userModel.findOne({ email: trimmedEmail, _id: { $ne: userId } })
        if (existingUser) {
            return res.json({ success: false, message: "Email already in use" })
        }

        let normalizedAge = null

        if (age !== "" && age !== undefined && age !== null) {
            normalizedAge = Number(age)

            if (!Number.isInteger(normalizedAge) || normalizedAge < 1 || normalizedAge > 120) {
                return res.json({ success: false, message: "Please enter a valid age" })
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                name: trimmedName,
                email: trimmedEmail,
                phone: trimmedPhone,
                age: normalizedAge,
                gender: trimmedGender,
            },
            { new: true, runValidators: true }
        ).select("name email phone age gender")

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" })
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            profile: getProfileResponse(updatedUser),
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user wishlist data
const getWishlist = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId).select("wishlistData")

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        res.json({ success: true, wishlistData: user.wishlistData || [] })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for adding/removing a product in the user wishlist
const toggleWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body

        if (!itemId) {
            return res.json({ success: false, message: "Product id is required" })
        }

        const user = await userModel.findById(userId).select("wishlistData")

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const itemIdText = itemId.toString()
        const currentWishlist = Array.isArray(user.wishlistData)
            ? user.wishlistData.map((id) => id.toString())
            : []

        let wishlistData
        let message

        if (currentWishlist.includes(itemIdText)) {
            wishlistData = currentWishlist.filter((id) => id !== itemIdText)
            message = "Removed from wishlist"
        } else {
            wishlistData = [...currentWishlist, itemIdText]
            message = "Added to wishlist"
        }

        await userModel.findByIdAndUpdate(userId, { wishlistData })

        res.json({ success: true, message, wishlistData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, getWishlist, toggleWishlist }
