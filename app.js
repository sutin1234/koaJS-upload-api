const Koa = require('koa');
const Router = require('@koa/router');
const multer = require('@koa/multer');
const path = require('path');
const cors = require('@koa/cors');

let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads');
  },
  filename: function(req, file, callback) {
    callback(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
    // callback(null, file.originalname);
  }
});

const app = new Koa();
const router = new Router();
const upload = multer({ storage: storage }); // note you can pass `multer` options here

// add a route for uploading multiple files
router.post(
  '/upload-multiple-files',
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1
    },
    {
      name: 'boop',
      maxCount: 2
    }
  ]),
  ctx => {
    console.log('ctx.request.files', ctx.request.files);
    console.log('ctx.files', ctx.files);
    console.log('ctx.request.body', ctx.request.body);
    ctx.body = 'done';
  }
);

// add a route for uploading single files
router.post('/upload-single-file', upload.single('avatar'), ctx => {
  console.log('ctx.request.file', ctx.request.file);
  console.log('ctx.file', ctx.file);
  console.log('ctx.request.body', ctx.request.body);
  ctx.body = ctx.file;
});

// add the router to our app
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

// start the server
app.listen(3000);
