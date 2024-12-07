import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        userName: { type: String, required: true, unique: true },
        userHash: { type: String, required: true },
        pointCount: { type: Number, required: true },
        orders: [{ orderId: String }],
        phone: { type: String, unique: true },
        city: { type: String },
        fullAddress: { type: String }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', UserSchema)
