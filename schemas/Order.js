import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: {
            product: {
                spuId: { type: String, required: true },
                photoUrl: { type: String, required: true },
            },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
        },
        totalPrice: { type: Number, required: true },
        status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
        delivery: {
            deliveryType: { type: String, enum: ['courier', 'pickup'] },
            phone: { type: String, required: true },
            fullName: { type: String, required: true },
            fullAddress: { tpe: String, required: true },
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Order', OrderSchema)