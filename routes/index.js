var express = require("express");
var app = express();
var ifcConvert = require("ifc-convert");
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require("fs");
var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.post(
  "/fileupload",
  multer({ storage: storage }).single("ifc_file"),
  function (req, res) {
    res.json({ fileName: req.file.filename });
  }
);

router.post("/convert", function (req, res) {
  ifcConvert(
    `uploads/${req.body.fileName}`,
    `convert_file/${req.body.fileName.split(".")[0]}.obj`
  )
    .catch(function (e) {
      console.log(e);
    })
    .then(function () {
      console.log("done");
      res.json({
        filePath: `convert_file/${req.body.fileName.split(".")[0]}.obj`,
        fileName: `${req.body.fileName.split(".")[0]}`,
      });
    });
});

router.get("/myHouse/:fileName", function (req, res, next) {
  res.render("myHouse", { fileName: req.params.fileName });
});
module.exports = router;
