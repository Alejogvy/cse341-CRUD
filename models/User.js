const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Por favor ingresa un email válido']
    },
    password: { type: String, required: true, select: false },
    favoriteColor: String,
    birthday: Date
});

// Hook to encrypt password before saving
userSchema.pre('save', async function (next) {
    // Si la contraseña no ha sido modificada, no hacemos nada
    if (!this.isModified('password')) return next();

    try {
        // We encrypt the password with bcrypt before saving it
        const salt = await bcrypt.genSalt(10); // We generate a salt
        this.password = await bcrypt.hash(this.password, salt); // We encrypt the password

        next();
    } catch (err) {
        next(err);
    }
});

// We set `toJSON` to hide the password and `__v` when returning the object
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
