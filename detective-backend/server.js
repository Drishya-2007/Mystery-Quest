const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const SCORES_FILE = 'scores.json';

// Make sure the file exists
if (!fs.existsSync(SCORES_FILE)) {
    fs.writeFileSync(SCORES_FILE, JSON.stringify([]));
}

// Get scoreboard
app.get('/score', (req, res) => {
    const scores = JSON.parse(fs.readFileSync(SCORES_FILE));
    // Sort by score descending
    scores.sort((a,b) => b.score - a.score);
    res.json(scores);
});

// Submit score
app.post('/score', (req, res) => {
    const { name, score } = req.body;
    if (!name || score == null) return res.status(400).json({ error: 'Name and score required' });

    const scores = JSON.parse(fs.readFileSync(SCORES_FILE));
    scores.push({ player: name, score, date: new Date().toISOString() });
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));

    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
