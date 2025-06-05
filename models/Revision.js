const mongoose = require('mongoose');

const revisionSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    revisionNo: { type: Number, required: true },
    filePath: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    notes: { type: String }
});

module.exports = mongoose.model('Revision', revisionSchema);
