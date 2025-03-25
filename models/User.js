const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    favoriteColor: { type: String },
    birthday: { type: Date }
});

// Hide `password` and `__v` in JSON output
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password; 
        delete ret.__v;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
