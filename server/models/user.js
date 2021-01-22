const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SALT_I = 10

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token: {
        type: String,

    }
})

userSchema.pre('save', function (next) {

    if (this.isModified('password')) {
        bcrypt.genSalt(SALT_I, (err, salt) => {
            if (err) return next(err)
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) return next(err)
                this.password = hash
                next()
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePasswords = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
        if (error) cb(error)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb) {
   let token = jwt.sign(this._id.toHexString(), 'supersecretpassword')
    this.token = token
    this.save((err,user)=> {
        if(err) cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {

    jwt.verify(token, 'supersecretpassword', (err, decode)=> {
        this.findOne({'_id': decode, 'token': token}, (err, user) => {
            if(err) cb(err)
            cb(null, user)
        })
    })

}


const User = mongoose.model('User', userSchema)
module.exports = {User}
