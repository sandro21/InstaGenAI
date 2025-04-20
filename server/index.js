const express = require('express');
const cors = require('cors');

const app = express(); 

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// /generate route
app.post('/generate', (req, res) => {
  const { niche } = req.body;

  if (!niche || niche.trim() === '') {
    return res.status(400).json({ error: 'Niche is required' });
  }

  const dummyUsernames = [
    `@${niche}_vibes`,
    `@daily_${niche}`,
    `@${niche}gram`,
    `@the${niche}spot`,
    `@${niche}hub`,
    `@${niche}_zone`,
    `@real${niche}`,
    `@${niche}_official`,
    `@allabout${niche}`,
    `@${niche}_daily`,
    `@top_${niche}`,
    `@${niche}central`,
    `@go${niche}`,
    `@${niche}_world`,
    `@${niche}_explore`
  ];

  res.json({ usernames: dummyUsernames });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
