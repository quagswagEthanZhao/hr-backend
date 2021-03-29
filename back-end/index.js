const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cEmployeeController = require('./controller/cEmployeeContoller');
const departmentController = require('./controller/departmentController');
const positionController = require('./controller/positionController');
const notificationController = require('./controller/notificationController');
const fileUploadControllor = require('./controller/fileUploadController');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

//Employee Route
app.get('/api/getAll', cEmployeeController.getAll);
app.get('/api/getManagerId/:id', cEmployeeController.getManager);
app.get('/api/getAdminInfo', cEmployeeController.getAdminInfo);
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

//File Upload
app.post('/api/fileUpload', fileUploadControllor.upload);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
