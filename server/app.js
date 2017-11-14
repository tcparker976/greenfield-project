const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('gotta chat\'em up');
}); 

app.listen(process.env.PORT || 3000)