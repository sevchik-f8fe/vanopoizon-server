import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Admin from "./schemas/Admin.js";

export const checkAuthMiddleware = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'JWT_TOKEN');
            req.body.userId = decodedToken._id;

            next();
        } catch (err) {
            return res.status(403).json({ message: 'Ошибка аутентификации' })
        }
    } else {
        return res.status(403).json({ message: 'Ошибка аутентификации' })
    }
}

export const checkAuth = async (req, res) => {
    try {
        const currentAdmin = await Admin.findById(req.body.userId);
        if (!currentAdmin) return res.status(403).json({ message: 'Ошибка аутентификации' });

        res.json({ success: true });
    } catch (err) {
        res.status(403).json({ message: 'Ошибка аутентификации' });
    }
}

export const auth = async (req, res) => {
    try {
        const currentAdmin = await Admin.findOne({ login: req.body.login });

        if (currentAdmin) {
            const compareResult = await bcrypt.compare(req.body.password, currentAdmin.passwordHash);

            if (!compareResult) {
                return res.status(400).json({ message: 'Неверный логин или пароль' })
            }
        } else {
            return res.status(400).json({ message: 'Неверный логин или пароль' })
        }

        const token = jwt.sign(
            {
                _id: currentAdmin._id,
            },
            'JWT_TOKEN',
            {
                expiresIn: '3h'
            }
        );

        res.json({ token })
    } catch (err) {
        console.log('Ошибка при получении данных:', err);
    }
}