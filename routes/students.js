const express = require('express')
const router = express.Router()
const studentsController = require('../controllers/students')

const accepted_extensions = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "text/csv",
  ];
  var multer = require("multer");
  var fs = require("fs");
  var randomstring = require("randomstring");
  var storage = multer.diskStorage({
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    destination: function (req, file, cb) {
      if (accepted_extensions.indexOf(file.mimetype) > -1) {
        var path = '/';
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        cb(null, path);
      } else {
        return cb(new Error("Invalid image format"));
      }
    },
    filename: function (req, file, cb) {
      var extension = file.originalname.split(".").pop();
      // generating unique filename with extension
      var uuid = randomstring.generate(10) + "_" + Date.now() + "." + extension;
      cb(null, uuid);
    },
  });
  
  var upload = multer({ storage: storage });

router.get('/', studentsController.list);
router.post('/', [studentsController.validate('validateStudent'),upload.array("image", 1)], studentsController.create);
router.get('/:id', studentsController.details);
router.put('/:id', [studentsController.validate('validateUpdateStudent'),upload.array("image", 1)], studentsController.edit);
router.delete('/:id', studentsController.deleteStudent);

module.exports.router = router
module.exports = router;



 