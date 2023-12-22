const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const Photo = require('./models/Photo');

const app = express();

//Connect Database
mongoose.connect('mongodb://localhost/pcat-test-db', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
});

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //req.body > html catch
app.use(express.json()); //read with json > res.redirect('/');
app.use(fileUpload()); // Saved as fileupload middlewares.

//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  res.render('index', {
    photos,
  });
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});

//POST
app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    //Is there an upload file?
    fs.mkdirSync(uploadDir); // if not, create uploadDir(uploads) file
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
    res.redirect('/');
  });
});

//Single Photo Page
app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} Portunda Başlatildi.`);
});
