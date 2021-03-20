const express = require('express');
const app = express();
const employeeController = require('./controller/employeeController');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

//Route
app.get('/', (req, res) => {
  res.send('HR Back-end');
});

app.get('/test', employeeController.test);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
