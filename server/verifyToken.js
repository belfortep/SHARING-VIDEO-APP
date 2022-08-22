import jwt from 'jsonwebtoken'
import HttpCodesEnum from './enum/httpCodes.js';
import { createError } from './error.js';


export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return next(createError(HttpCodesEnum.UNAUTHORIZED, 'Not authenticated'))
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
            return next(createError(HttpCodesEnum.FORBBIDEN, 'Token not valid'))
        }

        req.user = user//asigno el usuario a este req.user, asi se puede usar en cualquier request a la api

        next()

    })
}


export const verifyOwner = (paramsId, requestId) => {
    if (paramsId === requestId) {
        return true;
    } else {
        return false;
    }
}