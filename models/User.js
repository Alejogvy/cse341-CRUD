const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Ocultar por defecto
    favoriteColor: { type: String },
    birthday: { type: Date }
});

// Hook para encriptar password antes de guardar (opcional si usas bcrypt en el futuro)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Aquí puedes encriptar el password antes de guardarlo
    next();
});

// Configurar `toJSON` para ocultar `password` y `__v`
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
