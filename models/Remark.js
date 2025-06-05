const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    role: { type: String, enum: ['Owner', 'Design', 'Class', 'Flag'], required: true },
    content: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Remark', remarkSchema);
