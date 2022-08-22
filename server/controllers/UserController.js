import HttpCodesEnum from '../enum/httpCodes.js'
import { createError } from '../error.js';
import { verifyOwner } from '../verifyToken.js';
import User from '../models/User.js'

class UserController {

    static async updateById(req, res, next) {

        if (verifyOwner(req.params.id, req.user.id)) {

            try {

                const user = await User.findByIdAndUpdate(req.params.id,
                    {
                        $set: res.body
                    },
                    {
                        new: true
                    })

                return res.status(HttpCodesEnum.UPDATED).json(user);

            } catch (err) {
                return next(createError(err.status, err.message));
            }

        } else {
            return next(createError(HttpCodesEnum.FORBBIDEN, 'You can only update your account'))
        }

    }
    static async deleteById(req, res, next) {

    }
    static async getUserById(req, res, next) {

    }
    static async subscribe(req, res, next) {

    }
    static async unsubscribe(req, res, next) {

    }
    static async like(req, res, next) {

    }
    static async dislike(req, res, next) {

    }


}

export default UserController;