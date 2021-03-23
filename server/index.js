const express = require('express');
const app = express();
const cors = require('cors');
const cEmployeeController = require('./controller/cEmployeeContoller');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

//Route
app.get('/api/getAll', cEmployeeController.getAll);
app.get('/api/getManagerId/:id', cEmployeeController.getManager);
app.post('/api/addNew', cEmployeeController.addNew);
app.put('/api/updateInfo/:id', cEmployeeController.updateEmployeeInfo);
app.put('/api/terminate/:id', cEmployeeController.updateTerminate);
app.delete('/api/delete/:id', cEmployeeController.delete);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
