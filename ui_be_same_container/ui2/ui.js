const express = require('express');
const app = express();
const port = 7007;

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

