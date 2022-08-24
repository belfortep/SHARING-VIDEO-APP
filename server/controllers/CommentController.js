import HttpCodesEnum from '../enum/httpCodes.js'
import Comment from '../models/Comment.js'
import Video from '../models/Video.js'
import { createError } from '../error.js';
class CommentController {

    static async addComment(req, res, next) {
        try {

            const comment = new Comment({ ...req.body, userId: req.user.id })

            await comment.save()

            return res.status(HttpCodesEnum.CREATED).json(comment);

        } catch (err) {

            return next(err);

        }
    }

    static async deleteComment(req, res, next) {

        try {

            const comment = await Comment.findById(res.params.id)

            const video = await Video.findById(res.params.id)

            if (verifyOwner(comment.userId, req.user.id) || verifyOwner(req.user.id, video.userId)) {

                await Comment.findByIdAndDelete(req.params.id)

                return res.status(HttpCodesEnum.OK).json('Comment deleted')

            } else {

                return next(createError(HttpCodesEnum.FORBBIDEN, 'You can only delete your comments'))

            }

        } catch (err) {

            return next(err);

        }
    }

    static async getComments(req, res, next) {
        try {

            const comments = await Comment.find({ videoId: req.params.videoId })

            return res.status(HttpCodesEnum.OK).json(comments)

        } catch (err) {

            return next(err);

        }
    }

}


export default CommentController;