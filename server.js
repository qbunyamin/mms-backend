const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Test endpoint
app.get('/', (req, res) => {
    res.send('MMS Backend is running');
});

// Port ve Mongo bağlantısı
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));

// route
const documentRoutes = require('./routes/documentRoutes');
app.use('/api/documents', documentRoutes);

//ptojetoute
const projectRoutes = require('./routes/projectRoutes.js');
app.use('/api/projects', projectRoutes);


app.use(express.urlencoded({ extended: true }));
