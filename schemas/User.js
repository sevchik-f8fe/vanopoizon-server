import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        userName: { type: String, required: true },
        pointCount: { type: Number, required: true },
        orders: [{ orderId: String }],
        delivery: {
            deliveryType: { type: String, enum: ['courier', 'pickup'] },
            city: {
                name: String,
                code: String,
                coords: { type: [Number] }
            },
            pvz: {
                smallAddress: String,
                fullAddress: String,
            },
            fullAddress: String,
            fullName: String,
            phone: String,
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', UserSchema);

