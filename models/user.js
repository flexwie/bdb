const mongoose  = require('mongoose')
const bcrypt   = require('bcrypt')
const SALT = 10

const userSchema = new mongoose.Schema({
    name: String,
    mail: String,
    password: String
})

userSchema.pre('save', function(next) {
    let user = this

    if (!user.isModified('password')) return next()

    bcrypt.genSalt(SALT, function(err, salt) {
        if(err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err)
            user.password = hash
            next()
        })
    })
})

userSchema.statics.comparePassword = function(toBeCompared, cb) {
    bcrypt.compare(toBeCompared, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

let User = mongoose.model('User', userSchema)
module.exports = User