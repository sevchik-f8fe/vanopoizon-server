import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: {
        spuId: String,
        price: Number,
        photoUrl: String,
        unique: true,
        required: true
    },
});

export default mongoose.model('Cart', CartSchema)
