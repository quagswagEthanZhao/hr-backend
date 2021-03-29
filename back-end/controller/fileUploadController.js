const multer = require('multer');
var upload = multer({ dest: 'uploads/' });

module.exports = {
  upload: (req, res) => {
    console.log(req.body.files);
    console.log(req.files);
    if (req.files === null) {
      return res.json({ error: true, message: 'No file selected !' });
    }
    const file = req.files.file;

    file.mv(`${__dirname}/hr/public/uploads/${file.name}`, (error) => {
      if (error) {
        console.error(error);
        return res.json({ error: true, message: error.message });
      }
      res.json({
        error: false,
        fileName: file.name,
        path: `/uploads/${file.name}`,
      });
    });
  },
};
