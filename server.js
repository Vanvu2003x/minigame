import fs from 'fs';
import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Adjust path depending on where server.js is run
const DATA_FILE = path.join(__dirname, 'public', 'data.json');

// Ensure file exists
if (!fs.existsSync(DATA_FILE)) {
    console.log("Creating default data.json");
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Read Error" });
        }
        res.header("Content-Type", 'application/json');
        res.send(data);
    });
});

app.post('/api/data', (req, res) => {
    const newData = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 4), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Write Error" });
        }
        res.send({ success: true });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});
