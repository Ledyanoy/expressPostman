const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {authenticate} = require('./middlewares/auth')
const cookieParser = require('cookie-parser')
const app = express()

const mongoURL = 'mongodb+srv://admin:stars44@cluster0.7yid0.mongodb.net/authApp?retryWrites=true&w=majority'

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
//MiddleWare
app.use(bodyParser.json())
app.use(cookieParser())

//Models
const {User} = require('./models/user')
// Routes
app.post('/api/user', (req, res) => {
    const addUser = new User({
        email: req.body.email,
        password: req.body.password
    })
    addUser.save((err, doc) => {
        if (err) res.status(400).send(err)
        res.status(200).send(doc)
    })
})

app.post('/api/user/login', (req, res) => {
    User.findOne({'email': req.body.email}, (err, user) => {
        if (!user) res.json({message: 'user not found'})
        user.comparePasswords(req.body.password, (err, isMatch) => {
            if (err) throw err
            if (!isMatch) res.status(400).json({message: 'bad password'})
            user.generateToken((err, user)=>{
                if (err) throw res.status(400).send(err)
                res.cookie('x_auth', user.token).send('ok')
            })
        })

    })
})


app.get('/api/books', authenticate, (req, res)=> {
    res.status(200).send(req.email)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`started  on port ${port}`)
})
