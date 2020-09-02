const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/api', (req, res) => {
    res.send('test');
});

app.listen(port, () => console.log(`port is ${port}`));