const express = require('express');
const app = express();
const cors = require('cors');
const cEmployeeController = require('./controller/cEmployeeContoller');
const departmentController = require('./controller/departmentController');
const positionController = require('./controller/positionController');
const notificationController = require('./controller/notificationController');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

//Employee Route
app.get('/api/getAll', cEmployeeController.getAll);
app.get('/api/getManagerId/:id', cEmployeeController.getManager);
app.post('/api/addNew', cEmployeeController.addNew);
app.put('/api/updateInfo/:id', cEmployeeController.updateEmployeeInfo);
app.put('/api/terminate/:id', cEmployeeController.updateTerminate);
app.delete('/api/delete/:id', cEmployeeController.delete);

//Department Route
app.get(
  '/api/allDepartmentNumInfo',
  departmentController.getAllDepartmentMemberNum
);
app.post('/api/addDepartment', departmentController.insertDpartment);

//Position Route
app.post('/api/addPosition', positionController.insertPosition);

//Notification Route
app.get('/api/getNotification', notificationController.getAllNotification);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
