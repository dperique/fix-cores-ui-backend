const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 7007;

// Configure CORS options
const corsOptions = {
    origin: '*', // Allow all origins (adjust this in a production environment)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware to serve static files from 'public' directory
app.use(express.static('public'));

// Backend endpoint to get users
app.get('/api/users', (req, res) => {
    res.json([
        { name: 'dennis' },
        { name: 'jule' }
    ]);
});

// Start the server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

