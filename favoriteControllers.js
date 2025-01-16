import mongoose from "mongoose";
import Favorite from "./schemas/Favorite.js";

export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.body;
        const favorites = await Favorite.find({ userId });

        res.json({ favorites: favorites.products });
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения данных" })
    }
}

export const addToFavorites = async (req, res) => {
    try {
        const { userId, spuId } = req.body;

        const favorite = findOne({ userId, spuId });

        if (favorite) {
            res.json({ favorite });
        } else {
            const doc = new Favorite({ userId, spuId });
            const favorite = await doc.save();

            res.json({ favorite });
        }
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения данных" });
    }
}

export const removeFromFavorites = async (req, res) => {
    try {
        const { userId, spuId } = req.body;

        await Favorite.findOneAndDelete({ userId, spuId });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения данных" });
    }
}
