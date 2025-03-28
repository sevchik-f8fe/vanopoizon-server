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
        return res.status(500).json({ err: 'Ошибка' });
    }
}

const generateReferralCode = () => {
    const bytes = crypto.randomBytes(9);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referralCode = '';
    for (let i = 0; i < 12; i++) {
        referralCode += chars[bytes[i % bytes.length] % chars.length];
    }
    return referralCode;
};

export const userTgAuth = async (req, res) => {
    try {
        const params = new URLSearchParams(req.body.tg);
        const userData = JSON.parse(params.get('user'));

        const userId = userData.id;
        const userName = userData.username;

        const user = await User.findOneAndUpdate(
            { userId: userId },
            {
                userId: userId,
                userName: userName,
                $setOnInsert: {
                    pointCount: 0,
                    refferalCode: generateReferralCode(),
                }
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        res.json({ user: user });
    } catch (err) {
        res.status(500).json({ err: "Ошибка" });
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
            return res.status(403).json({ err: 'Ошибка' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { delivery: { phone, fullName, deliveryType, city, pvz, fullAddress } }, { new: true });

        if (!updatedUser) {
            return res.status(500).json({ err: 'Ошибка' });
        }

        res.json({ user: updatedUser });
    } catch (err) {
        res.status(500).json({ err: 'Ошибка' });
    }
}
