import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoutes from './routes/users.js'
import videoRoutes from './routes/videos.js'
import commentRoutes from './routes/comments.js'
import authRoutes from './routes/auth.js'
import HttpCodesEnum from './enum/httpCodes.js'
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

app.use(express.json())
app.use(cookieParser())

const connect = () => {

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('DB Connected')
        }).catch(err => { throw err })
}


app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    const status = err.status || HttpCodesEnum.SERVER_INTERNAL_ERROR
    const message = err.message || 'Something wrong'
    return res.status(status).json({ success: false, status, message })
})

app.set('port', process.env.PORT || 4000);



app.listen(app.get('port'), () => {
    connect();
    console.log('Server on port ' + app.get('port'));
})