import HttpCodesEnum from '../enum/httpCodes.js'
import { createError } from '../error.js';
import Video from '../models/Video.js'
import User from '../models/User.js'
import { verifyOwner } from '../verifyToken.js';
class VideoController {

    static async addVideo(req, res, next) {

        try {

            const video = new Video({ userId: req.user.id, ...req.body });  //en userId guarda el usuario que esta logeado (el que sube el video) y coloca el resto

            await video.save();

            res.status(HttpCodesEnum.OK).json(video)

        } catch (err) {

            return next(err)

        }

    }

    static async updateVideoById(req, res, next) {

        try {

            const video = await Video.findById(req.params.id)

            if (!video) {
                return next(createError(HttpCodesEnum.NOT_FOUND, 'Video not found'))
            }

            if (verifyOwner(video.userId, req.user.id)) {

                const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, { new: true })

                return res.status(HttpCodesEnum.OK).json(updatedVideo)

            } else {
                return next(createError(HttpCodesEnum.FORBBIDEN, 'You can only update your videos'))
            }

        } catch (err) {
            return next(err);
        }

    }
    static async deleteVideoById(req, res, next) {

        try {

            const video = await Video.findById(req.params.id)

            if (!video) {
                return next(createError(HttpCodesEnum.NOT_FOUND, 'Video not found'))
            }

            if (verifyOwner(video.userId, req.user.id)) {

                await Video.findByIdAndDelete(req.params.id)

                return res.status(HttpCodesEnum.OK).json('Video deleted')

            } else {
                return next(createError(HttpCodesEnum.FORBBIDEN, 'You can only delete your videos'))
            }

        } catch (err) {
            return next(err);
        }

    }
    static async getVideoById(req, res, next) {

        try {

            const video = await Video.findById(req.params.id)

            return res.status(HttpCodesEnum.OK).json(video)

        } catch (err) {

            return next(err);

        }

    }

    static async addView(req, res, next) {

        try {

            await Video.findByIdAndUpdate(req.params.id, {
                $inc: { views: 1 }
            })

            return res.status(HttpCodesEnum.OK).json('Views increased')

        } catch (err) {

            return next(err);

        }

    }

    static async random(req, res, next) {

        try {

            const videos = await Video.aggregate([{ $sample: { size: 40 } }])

            return res.status(HttpCodesEnum.OK).json(videos)

        } catch (err) {

            return next(err);

        }

    }

    static async trend(req, res, next) {

        try {

            const videos = await Video.find().sort({ views: -1 })   //con 1 me da los de menos visitas, -1 los de mas visitas

            return res.status(HttpCodesEnum.OK).json(videos)

        } catch (err) {

            return next(err);

        }

    }

    static async sub(req, res, next) {

        try {

            const user = await User.findById(req.user.id)

            const subscribedChannels = user.subscribedUsers

            const list = await Promise.all(
                subscribedChannels.map(channelId => {
                    return Video.find({ userId: channelId })
                })
            )


            return res.status(HttpCodesEnum.OK).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))

        } catch (err) {

            return next(err);

        }

    }

    static async getByTag(req, res, next) {

        try {

            const tags = req.query.tags.split(',')

            const videos = await Video.find({
                tags: { $in: tags }
            }).limit(20)

        } catch (err) {

            return next(err);

        }

    }

    static async search(req, res, next) {

        try {

            const query = req.query.q

            const videos = await Video.find({ title: { $regex: query, $options: 'i' } }).limit(40);  //la "i" es que no importa que sea mayuscula o minuscula

        } catch (err) {

            return next(err);

        }

    }

}


export default VideoController;