import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Admin from "./schemas/Admin.js";

export const checkAuthMiddleware = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'JWT');
            req.body.userId = decodedToken._id;

            next();
        } catch (err) {
            res.status(500).json({ err: 'Ошибка' });
        }
    } else {
        res.status(500).json({ err: 'Ошибка' });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const currentAdmin = await Admin.findById(req.body.userId);
        if (!currentAdmin) return res.status(500).json({ err: 'Ошибка' });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ err: 'Ошибка' });
    }
}

export const auth = async (req, res) => {
    try {
        const currentAdmin = await Admin.findOne({ login: req.body.login });

        if (currentAdmin) {
            const compareResult = await bcrypt.compare(req.body.password, currentAdmin.passwordHash);

            if (!compareResult) {
                res.status(500).json({ err: 'Ошибка' });
            }
        } else {
            res.status(500).json({ err: 'Ошибка' });
        }

        const token = jwt.sign(
            {
                _id: currentAdmin._id,
            },
            'JWT',
            {
                expiresIn: '3h'
            }
        );

        res.json({ token })
    } catch (err) {
        res.status(500).json({ err: 'Ошибка' });
    }
}