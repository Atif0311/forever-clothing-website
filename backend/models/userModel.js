import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    age: { type: Number, default: null },
    gender: { type: String, default: "" },
    cartData: { type: Object, default: {} },
    wishlistData: { type: Array, default: [] }
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel
