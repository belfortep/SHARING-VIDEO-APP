import HttpCodesEnum from '../enum/httpCodes.js'
import User from '../models/User.js';
import bcrypt from 'bcryptjs'
import { createError } from '../error.js';
import jwt from 'jsonwebtoken';


class AuthController {

    static async signup(req, res, next) {

        const salt = bcrypt.genSaltSync(10);

        const hash = bcrypt.hashSync(req.body.password, salt);

        try {

            const user = new User({ ...req.body, password: hash });

            await user.save();

            res.status(HttpCodesEnum.CREATED).json({ message: 'User created' });

        } catch (err) {
            return next(createError(err));
        }
    }

    static async signin(req, res, next) {

        let user;

        try {

            user = await User.findOne({ name: req.body.name });

        } catch (err) {
            return next(createError(HttpCodesEnum.NOT_FOUND, 'User not found'));
        }

        try {

            const isCorrect = bcrypt.compare(req.body.password, user.password);

            if (!isCorrect) {
                return next(createError(HttpCodesEnum.BAD_REQUEST, 'Wrong credentials'));
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN)

            const { password, ...others } = user._doc

            res.cookie('access_token', token, {
                httpOnly: true
            }).status(HttpCodesEnum.OK).json(others);

        } catch (err) {
            return next(createError(err));
        }
    }

}


export default AuthController;