import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";

// const upload = multer({ dest: "uploads" });

const s3 = new S3Client({
  credentials: {
    accessKeyId: "AKIAXSUUXBEOIN52JK4C", // store it in .env file to keep it safe
    secretAccessKey: "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",
  },
  region: "ap-south-1", // this is the region that you select in AWS account
});

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: "mynewfileshare", // change it as per your project requirement
  //acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
    console.log("FILEEEEEE ", file);
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    console.log("INside keyyyyy");
    const fileName =
      Date.now() + "_" + file.fieldname + "_" + file.originalname;
    cb(null, fileName);
  },
});

// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
  console.log("Inside sentatize file ", file);
  // Define the allowed extension
  const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

  // Check allowed extensions
  const isAllowedExt = fileExts.includes(
    path.extname(file.originalname.toLowerCase())
  );

  // Mime type must be an image
  const isAllowedMimeType = file.mimetype.startsWith("image/");

  console.log("isAllowedExt ", isAllowedExt);
  console.log("isAllowedMimeType ", isAllowedMimeType);
  if (isAllowedExt && isAllowedMimeType) {
    console.log("Inside if...");
    return cb(null, true); // no errors
  } else {
    // pass error msg to callback, which can be displaye in frontend
    cb("Error: File type not allowed!");
  }
}

// our middleware
const upload = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 20, // 20mb file size
  },
});

// module.exports = upload;

export default upload;
