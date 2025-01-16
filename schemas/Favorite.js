import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    spuId: { type: String, required: true }
});

export default mongoose.model('Favorite', FavoriteSchema)
