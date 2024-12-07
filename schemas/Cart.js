import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    products: [
        {
            spuId: String,
            price: Number,
            photoUrl: String,
            isFavorite: Boolean,
            unique: true
        }
    ],
});

export default mongoose.model('Cart', CartSchema)