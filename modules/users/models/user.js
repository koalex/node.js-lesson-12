const mongoose = require('../../../lib/mongoose');
const crypto   = require('crypto');

const userSchema = new mongoose.Schema({
    active: { type: Boolean, default: false },
    activation_token: { type: String },
    password_reset_token: { type: String },
    name: { type: String },
    surname: { type: String },
    age: { type: Number },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: [
            {
                validator: function (value) {
                    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
                },
                message: 'Email невалидный'
            },
            {
                validator: function (value) {
                    return value !== 'test@gmail.com';
                },
                message: 'Email запрещен'
            }
        ]
    },
    skills: [{ type: String }],
    lang: { type: String, lowercase: true, enum: ['ru', 'en'] }, // ru en
    password_hash: { type: String },
    salt: { type: String },
    created_at: { type: Date, default: Date.now }
}, {
    versionKey: false,
    id: false,
    toJSON: { virtuals: false }
});


userSchema.virtual('fullName')
    .get(function () {
        return this.name + this.surname;
    });

userSchema.virtual('password')
    .set(function (password) {
        if (!password || String(password).trim() === '') {
            this.invalidate('password', 'пароль отсутствует');
            return;
        }
        this._password     = password;
        this.salt          = crypto.randomBytes(128).toString('base64');
        this.password_hash = crypto.pbkdf2Sync(password, this.salt, 12000, 128, 'sha512');
    })
    .get(function () { return this._password; });


userSchema.methods.checkPassword = function (password) {
    if (!password || !this.password_hash) return false;

    return String(crypto.pbkdf2Sync(password, this.salt, 12000, 128, 'sha512')) === this.password_hash;
};

userSchema.methods.toJSON = function (opts) {
    const data = this.toObject(opts);

    delete data.salt;
    delete data.password_hash;

    return data;
};

const User = mongoose.model('User', userSchema); // создаст коллекцию с именем `users`

module.exports = User;