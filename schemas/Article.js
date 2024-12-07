import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
    {
        articleId: { type: String, required: true, unique: true },
        title: { type: String, unique: true },
        link: { type: String, required: true },
        photoUrl: { type: String, required: true },
        isSmallArticle: { type: Boolean, required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Article', ArticleSchema)