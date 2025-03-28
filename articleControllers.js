import mongoose from "mongoose";
import Article from "./schemas/Article.js";

export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.json({ articles });
    } catch (err) {
        res.status(500).json({ message: "Ошибка" });
    }
}

export const addArticle = async (req, res) => {
    const { title, link, type, photoUrl, articleId } = req.body;

    try {
        const existingArticle = await Article.findOne({ articleId: articleId });

        if (existingArticle) {
            await Article.findOneAndUpdate({ articleId }, { title, link, type, photoUrl })
            return res.status(201).json({ is: 'ok ch' });
        } else {
            const newArticle = new Article({
                title: title,
                link: link,
                type: type,
                photoUrl: photoUrl,
                articleId: articleId
            });

            await newArticle.save();

            res.status(201).json({ is: 'ok add' });
        }
    } catch (err) {
        res.status(500).json({ message: "Ошибка" });
    }
}

export const removeArticle = async (req, res) => {
    try {
        const { articleId } = req.body;

        const deletedArticle = await Article.findOneAndDelete({ articleId: articleId });

        if (!deletedArticle) {
            return res.status(500).json({ message: "Ошибка" });
        }

        res.status(200);
    } catch (err) {
        res.status(500).json({ message: "Ошибка" });
    }
}
