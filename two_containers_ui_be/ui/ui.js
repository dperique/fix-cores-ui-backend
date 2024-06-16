const express = require('express');
const axios = require('axios');
const app = express();
const port = 7007;

app.use(express.static('public'));

app.get('/api/users', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:7007/api/users');
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`UI listening at http://localhost:${port}`);
});

