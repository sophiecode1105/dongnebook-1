import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
aws.config.loadFromPath(__dirname + "/awsconfig.json");
const s3 = new aws.S3();
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "practice0210",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + "." + file.originalname.split(".").pop());
    },
  }),
  limits: { fileSize: 1000 * 1000 * 10 },
});
