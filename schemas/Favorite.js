import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
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

export default mongoose.model('Favorite', FavoriteSchema)