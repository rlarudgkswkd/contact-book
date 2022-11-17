//addressbook.js

let express = require('express');
let mongoose = require('mongoose');
let app = express();

// DB setting
//환경변수 등록했을시에 사용 가능
//mongoose.connect(process.env.MONGO_DB);

//connect String 사용
mongoose.connect('mongodb+srv://test:test@cluster0.948icol.mongodb.net/?retryWrites=true&w=majority');
let db = mongoose.connection;

//DB 연결시 CONSOLE
db.once('open', function(){
    console.log('DB connected');
});

//DB 에러시 CONSOLE
db.on('error', function(err){
    console.log('DB ERROR : ', err);
});

//ETC Settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Port Setting
let port = 3000;
app.listen(port,function(){
    console.log('server on : localhost:'+port);
});