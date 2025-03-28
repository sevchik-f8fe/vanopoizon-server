import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        userName: { type: String, required: true },
        pointCount: { type: Number, required: true },
        refferalCode: { type: String, required: true, unique: true },
        refferedBy: { type: String },
        orders: [{ orderId: String }],
        favorites: [{ spuId: { type: String, required: true }, photoUrl: { type: String, required: true }, title: { type: String, required: true } }],
        cart: [{ spuId: { type: String, required: true }, color: { type: String }, size: { type: String }, count: { type: Number, required: true } }],
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
