const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const slugify = require('slugify');
const mongoosePlugins = require('../../helpers/MongoosePlugins');

const UserSchema = new Schema({
    disableOfflineWarning: {type: Boolean, default: false},
    coins: {
        balance: {type: Number, required: true, default: 0},
        transactions: [{
            category: { type: String, enum: ['load', 'award', 'transfer', 'tip', 'gift'], required: true },
            amount: {type: Number, required: true},
            creatdAt: {type: Date, required: true, default: Date.now()},
            details: {type: String}
        }]
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    isLoggedIn: {
      type: Boolean,
      required: true,
      default: false
    },
    loginToken: {
        expires: String,
        deviceID: String,
        token: String
    },
    logins: [],
    logouts: [],
    password: {
        type: String
    },
    roles: {
        type: [String],
        default: ['user'],
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    twofactor: {
        secret: String,
        tempSecret: String,
        dataURL: String,
        otpURL: String
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    usernameLower:  {
        type: String,
        unique: true
    },
    xp: {
        type: Number,
        default: 0,
        min: 0
    }
},{
    timestamps: true
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('username') || this.isNew) {
        this.slug = slugify(this.username, {lower: true})
        this.usernameLower = this.username.toLowerCase()
    }
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                return next();
            });
        });
    } else {
        return next();
    }
});
UserSchema.virtual('createInfo').get(function() { return {
    username: this.username,
    slug: this.slug,
    roles: this.roles,
    status: this.status,
    isLoggedIn: this.isLoggedIn,
    xp: this.xp,
    coins: this.coins.balance,
    disableOfflineWarning: this.disableOfflineWarning
}});
UserSchema.virtual('loginInfo').get(function() { return {
    username: this.username,
    slug: this.slug,
    roles: this.roles,
    status: this.status,
    isLoggedIn: this.isLoggedIn,
    xp: this.xp,
    coins: this.coins.balance,
    disableOfflineWarning: this.disableOfflineWarning
}});

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongoosePlugins.errorOnNoRecords);


module.exports = mongoose.model('User', UserSchema);
