import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, unique: true, required: true },
        orderId: { type: String, unique: true, required: true },
        spuId: { type: String, unique: true, required: true },
        photoUrl: { type: String, required: true },
        price: { type: Number, required: true },
        count: { type: Number, required: true },
        status: { type: String, required: true },
        isFavorite: { type: Boolean, required: true },
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Order', OrderSchema)
