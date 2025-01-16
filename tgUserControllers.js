import crypto from "crypto";
import mongoose from "mongoose";
import User from "./schemas/User.js";

export const isValidInitData = (req, res, next) => {
    const token = 'TG_TOKEN';

    const params = new URLSearchParams(req.body.tg);
    const hash = params.get('hash');
    params.delete('hash');
    params.sort();

    let checkString = '';

    for (const [key, value] of params.entries()) {
        if (key != 'hash') checkString += `${key}=${value}\n`;
    }
    checkString = checkString.slice(0, -1);

    const secret_key = crypto.createHmac('sha256', 'WebAppData')
        .update(token)
        .digest();

    const calcHash = crypto.createHmac('sha256', secret_key)
        .update(checkString)
        .digest('hex');

    if (hash === calcHash) {
        next();
    } else {
        return res.status(403).json({ message: 'Ошибка авторизации' });
    }
}

export const userTgAuth = async (req, res) => {
    try {
        const params = new URLSearchParams(req.body.tg);
        const userData = JSON.parse(params.get('user'));

        const currentUser = await User.findOne({ userId: userData.id });

        if (currentUser) {
            return res.json({ user: currentUser })
            //            res.json({ userName: currentUser.userName, fullName: currentUser.fullName, pointCount: currentUser.pointCount, orders: currentUser.orders, phone: currentUser.phone, city: cur>
        } else {
            const doc = new User({
                userId: userData.id,
                userName: userData.username,
                pointCount: 0
            });

            const user = await doc.save();
            res.json({ user: user })
        }
    } catch (err) {
        res.status(403).json({ message: "Ошибка получения" });
    }
}

export const saveDeliveryData = async (req, res) => {
    try {
        const phone = req.body.phone;
        const fullName = req.body.fullName;
        const deliveryType = req.body.deliveryType;
        const city = req.body?.city;
        const pvz = req.body?.pvz;
        const fullAddress = req.body?.fullAddress;

        const userId = req.body?.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(403).json({ message: 'Ошибка авторизации' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { delivery: { phone, fullName, deliveryType, city, pvz, fullAddress } }, { new: true });

        if (!updatedUser) {
            return res.status(403).json({ user: 'Ошибка авторизации' });
        }

        res.json({ user: updatedUser });
    } catch (err) {
        res.status(403).json({ message: 'Ошибка авторизации' });
    }
}