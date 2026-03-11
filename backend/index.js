const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});