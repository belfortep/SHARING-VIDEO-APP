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

        if (verifyOwner(req.params.id, req.user.id)) {

            try {

                await User.findByIdAndDeleten(req.params.id)

                return res.status(HttpCodesEnum.UPDATED).json({ message: 'user deleted' });

            } catch (err) {

                return next(createError(err.status, err.message));

            }

        } else {

            return next(createError(HttpCodesEnum.FORBBIDEN, 'You can only delete your account'))

        }

    }
    static async getUserById(req, res, next) {

        try {

            const user = await User.findById(req.params.id)

            res.status(HttpCodesEnum.OK).json(user);

        } catch (err) {

            next(err)

        }

    }
    static async subscribe(req, res, next) {

        try {

            await User.findByIdAndUpdate(req.user.id, {  //a la persona logeada (req.user.id), agregale en subscripciones la del otro usuario (pasada por params)
                $push: { subscribedUsers: req.params.id }
            })

        } catch (err) {

            return next(err)

        }

        try {

            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: 1 }
            });

            return res.status(HttpCodesEnum.OK).json({ message: 'Subscription succesful' })

        } catch (err) {

            return next(err)

        }

    }
    static async unsubscribe(req, res, next) {

        try {

            await User.findByIdAndUpdate(req.user.id, {
                $pull: { subscribedUsers: req.params.id }
            })

        } catch (err) {
            return next(err)
        }

        try {

            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: -1 }
            });

            return res.status(HttpCodesEnum.OK).json({ message: 'Unsubscription succesful' })

        } catch (err) {

            return next(err)

        }

    }
    static async like(req, res, next) {

        const id = req.user.id;

        const videoId = req.params.videoId;

        try {
            //addToSet, se fija que el id este solo una vez
            await Video.findByIdAndUpdate(videoId, {
                $addToSet: { likes: id },
                $pull: { dislikes: id }
            })

            return res.status(HttpCodesEnum.OK).json('Video liked')

        } catch (err) {

            next(err)

        }

    }
    static async dislike(req, res, next) {

        const id = req.user.id;

        const videoId = req.params.videoId;

        try {
           
            await Video.findByIdAndUpdate(videoId, {
                $addToSet: { dislikes: id },
                $pull: { likes: id }
            })

            return res.status(HttpCodesEnum.OK).json('Video disliked')

        } catch (err) {

            next(err)

        }


    }


}

export default UserController;