import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
    {
        articleId: { type: String, required: true, unique: true },
        title: { type: String },
        link: { type: String, required: true },
        photoUrl: { type: String, required: true },
        type: { type: String, enum: ['small', 'big'], required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Article', ArticleSchema)