const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Document = require('../models/Document');
const Revision = require('../models/Revision');
const multer = require('multer');
const path = require('path');
const Remark = require('../models/Remark');

// post
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const {
            projectCode, type, documentNo, title, contractDate,
            status, approvalStatus, description, createdBy
        } = req.body;

        const document = new Document({
            projectCode,
            type,
            documentNo,
            title,
            contractDate,
            status,
            approvalStatus,
            description,
            createdBy
        });

        await document.save();
        res.status(201).json({ message: 'Döküman kaydedildi', document });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

//get
router.get('/', async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 }); // Son eklenen en üstte
        res.status(200).json(documents);
    } catch (err) {
        console.error('Listeleme hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

//update
router.put('/:id', async (req, res) => {
    try {
        const updated = await Document.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        console.error('Güncelleme hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});


//get id
router.get('/:id', async (req, res) => {
    try {
        const docId = req.params.id;

        const document = await Document.findById(docId);
        const revisions = await Revision.find({ documentId: docId }).sort({ uploadedAt: -1 });

        res.json({ document, revisions });
    } catch (err) {
        console.error('Detay getirme hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// multer yapılandırması
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + file.originalname;
        cb(null, unique);
    },
});



router.post('/:id/revision', upload.single('file'), async (req, res) => {
    try {
        const { revisionNo, notes, uploadedBy } = req.body;
        const filePath = req.file.filename;
        const documentId = req.params.id;

        const newRev = new Revision({
            documentId,
            revisionNo,
            notes,
            uploadedBy,
            filePath
        });

        await newRev.save();
        res.status(201).json({ message: 'Revizyon başarıyla eklendi.' });
    } catch (err) {
        console.error('Revizyon ekleme hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});


//yorum liste
router.get('/:id/remarks', async (req, res) => {
    try {
        const remarks = await Remark.find({ documentId: req.params.id }).sort({ createdAt: -1 });
        res.json(remarks);
    } catch (err) {
        console.error('Yorum getirme hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// yorum ekle
router.post('/:id/remarks', async (req, res) => {
    try {
        const { role, content, createdBy } = req.body;
        const remark = new Remark({
            documentId: req.params.id,
            role,
            content,
            createdBy
        });
        await remark.save();
        res.status(201).json({ message: 'Yorum eklendi' });
    } catch (err) {
        console.error('Yorum ekleme hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;
