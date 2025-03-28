import mongoose from "mongoose";
import User from "./schemas/User.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, color, count, size, spuId } = req.body;

        const searchCriteria = { _id: userId, "cart.spuId": spuId };

        if (color) {
            searchCriteria["cart.color"] = color;
        }
        if (size) {
            searchCriteria["cart.size"] = size;
        }

        const updatedUser = await User.findOneAndUpdate(
            searchCriteria,
            {
                $set: { "cart.$.count": count }
            },
            { new: true }
        );

        if (!updatedUser) {
            const newProduct = { spuId, color: req.body?.color, size: req.body?.size, count };
            const updatedUserWithNewProduct = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { cart: newProduct } },
                { new: true }
            );

            return res.json({ user: updatedUserWithNewProduct });
        }

        res.json({ user: updatedUser });
    } catch (e) {
        res.status(500).json({ err: 'Ошибка' });
    }
}


export const removeFromCart = async (req, res) => {
    try {
        const { userId, spuId, color, size } = req.body;

        const newUser = await User.findOneAndUpdate({ _id: userId }, { $pull: { cart: { spuId, color, size } } }, { new: true });
        res.json({ user: newUser });
    } catch (e) {
        res.status(500).json({ err: 'Ошибка' });
    }
}