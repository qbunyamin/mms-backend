const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    projectCode: { type: String, required: true },       // NB001, NB002 vs.
    type: { type: String, enum: ['Arajman', 'Hesap', 'Diagram', 'Elektirik', 'Teçhiz', 'Çelik', 'Plan', 'Prosüdür', 'Rapor'] },
    documentNo: { type: String, required: true, unique: true },
    title: { type: String, required: true },              // Konu
    contractDate: { type: Date },
    currentRevision: { type: Number, default: 1 },
    status: { type: String, enum: ['Data Girilmiş', 'Yayınlanmış'] },
    approvalStatus: { type: String, enum: ['Bayrak Onaylı', 'Klass Onaylı', 'Onayda', 'Onaylanmadı'] },
    description: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
