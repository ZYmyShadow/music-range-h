var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

class MusicList {
    toMap() {
        return {
            upName: this.upName,
            musicListName: this.musicListName,
            musicList: this.musicList
        }
  }
}

router.post('/data', (req, res) => {
  const dirPath = path.resolve('./music_name_data');
  let musicfileList = [];
  const dirs = fs.readdirSync(dirPath);
  dirs.forEach(upName => {
    const filepath = path.join(dirPath, upName);
    const files = fs.readdirSync(filepath);
    files.forEach(musicListName => {
      const musiclistpath = path.join(filepath, musicListName);
      const data = fs.readFileSync(musiclistpath, 'utf-8');
      const lines = data.split(/\r?\n/);
      const temMusic = new MusicList();
      temMusic.upName = upName;
      temMusic.musicListName = musicListName;
      temMusic.musicList = lines.sort((a, b) => { return a.length < b.length;});
      musicfileList.push(temMusic.toMap());
    });
  })
  // console.log(musicfileList);
  res.json({ data: musicfileList });
});

router.get('/data', (req, res) => {
  const dirPath = path.resolve('./music_name_data');
  let musicfileList = [];
  const dirs = fs.readdirSync(dirPath);
  dirs.forEach(upName => {
    const filepath = path.join(dirPath, upName);
    const files = fs.readdirSync(filepath);
    files.forEach(musicListName => {
      const musiclistpath = path.join(filepath, musicListName);
      const data = fs.readFileSync(musiclistpath, 'utf-8');
      const lines = data.split(/\r?\n/);
      const temMusic = new MusicList();
      temMusic.upName = upName;
      temMusic.musicListName = musicListName;
      temMusic.musicList = lines.sort((a, b) => { return a.length < b.length;});
      musicfileList.push(temMusic.toMap());
    });
  })
  // console.log(musicfileList);
  res.json({ data: musicfileList });
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
