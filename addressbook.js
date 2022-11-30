//---------------------
// Import
//---------------------
let express = require('express');
let mongoose = require('mongoose');

//웹브라우저의 form으로 전송된 data를 서버에서 쉽게 사용하기 위해 body-parser 사용
let bodyParser = require('body-parser');

//query로 method 값을 받아서 request의 HTTP method를 바꿔주는 역할
let methodOverride = require('method-override');
let app = express();

//---------------------
// DB setting 시작
//---------------------
//환경변수 등록했을시에 사용 가능
//mongoose.connect(process.env.MONGO_DB);

//connect String 사용
mongoose.connect('mongodb+srv://root:root@cluster0.948icol.mongodb.net/?retryWrites=true&w=majority');
//mongoose.connect('mongodb://test:test@cluster0.948icol.mongodb.net/?retryWrites=true&w=majority');
let db = mongoose.connection;

//DB 연결시 CONSOLE
db.once('open', function(){
    console.log('DB connected');
});

//DB 에러시 CONSOLE
db.on('error', function(err){
    console.log('DB ERROR : ', err);
});

//---------------------
// DB setting 끝
//---------------------

//---------------------
//ETC Settings
//---------------------
app.set('view engine', 'ejs');

//정적 요소 경로 세팅
let path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');
app.set('views', __dirname + '/views'); 
app.use(express.static(path.join(__dirname, '/public')));

//bodyParser Setting
app.use(bodyParser.json()); //json 형식으로 데이터 받기
app.use(bodyParser.urlencoded({extended : true})); //urlencoded data를 extended 알고리즘을 사용해서 분석, req.body에서 form으로 입력받은 데이터를 사용할수있음.

//method override setting
app.use(methodOverride('_method'));

//---------------------
// Route 세팅 시작
//---------------------

//routes 관련 설정 별도 관리 하기 위해 설정
//app.use 는 해당 route에 요청이 오는 경우에만 콜백 함수를 호출함.
app.use('/', require('./routes/home'));

//router 들이 예를들어 destroy 경우 /contacts/:id 에서 /:id 로 바뀐 이유
//  '/contacts'로 들어와야 router가 작동함.
app.use('/contacts', require('./routes/contacts'));

//Port Setting
let port = 3000;
app.listen(port,function(){
    console.log('server on : localhost:'+port);
});