const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

router.get('/summary', async (req, res) => {
    try {
        const documents = await Document.find();

        const projectMap = {};

        documents.forEach(doc => {
            const p = doc.projectCode;
            if (!projectMap[p]) {
                projectMap[p] = {
                    dataGirilmis: 0,
                    yayinlanmis: 0,
                    klassOnayli: 0,
                    bayrakOnayli: 0,
                    onayda: 0,
                    gecikmis: 0,
                };
            }

            if (doc.status === 'Data Girilmiş') projectMap[p].dataGirilmis += 1;
            if (doc.status === 'Yayınlanmış') projectMap[p].yayinlanmis += 1;
            if (doc.approvalStatus === 'Klass Onaylı') projectMap[p].klassOnayli += 1;
            if (doc.approvalStatus === 'Bayrak Onaylı') projectMap[p].bayrakOnayli += 1;
            if (doc.approvalStatus === 'Onayda') projectMap[p].onayda += 1;
            if (doc.deadline && new Date(doc.deadline) < new Date()) {
                projectMap[p].gecikmis += 1;
            }
        });

        const result = Object.entries(projectMap).map(([projectCode, counts]) => ({
            projectCode,
            ...counts,
            toplam:
                counts.dataGirilmis +
                counts.yayinlanmis +
                counts.klassOnayli +
                counts.bayrakOnayli +
                counts.onayda +
                counts.gecikmis,
        }));

        res.json(result);
    } catch (err) {
        console.error('Proje özet hatası:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;
