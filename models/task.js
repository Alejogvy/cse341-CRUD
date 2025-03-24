const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update `updatedAt` on every save
taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Optionally, you could also define an index for the `userId` for better performance
taskSchema.index({ userId: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
