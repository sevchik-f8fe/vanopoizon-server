import mongoose from "mongoose";
import User from "./schemas/User.js"

export const addToFavorites = async (req, res) => {
    try {
        const { userId, spuId, photoUrl, title } = req.body;
        const product = { spuId, photoUrl, title };

        const newUser = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { favorites: product } }, { new: true });
        res.json({ user: newUser });
    } catch (err) {
        res.status(500).json({ error: "Ошибка" });
    }
}

export const removeFromFavorites = async (req, res) => {
    try {
        const { userId, spuId } = req.body;

        const newUser = await User.findOneAndUpdate({ _id: userId }, { $pull: { favorites: { spuId: spuId } } }, { new: true });
        res.json({ user: newUser });
    } catch (err) {
        res.status(500).json({ error: "Ошибка" });
    }
}
