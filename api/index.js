const express = require('express');

const app = express();
const router = express.Router();

app.use(express.json());

// Example route
router.get('/test', (req, res) => {
    res.json({ message: 'Welcome to CryptoPilot API!' });
});

// Add more routes here

app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});