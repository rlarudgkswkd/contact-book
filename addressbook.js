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
app.set('views', __dirname + '/views'); 
app.use(express.static(path.join(__dirname, '/public')));

//bodyParser Setting
app.use(bodyParser.json()); //json 형식으로 데이터 받기
app.use(bodyParser.urlencoded({extended : true})); //urlencoded data를 extended 알고리즘을 사용해서 분석, req.body에서 form으로 입력받은 데이터를 사용할수있음.

//method override setting
app.use(methodOverride('_method'));

// DB Schema
let contactSchema = mongoose.Schema({
    name : {type:String, required: true, unique:true},
    email : {type:String},
    phone : {type:String}
});

//DB에 있는 'contact'라는 컬렉션을 Contact 변수에 연결 시켜주는 역할
let Contact = mongoose.model('contact',contactSchema);

//---------------------
// Route 세팅 시작
//---------------------

// Home
app.get('/',function(req,res){
    res.redirect('/contacts');
});

//Contacts - Index
//ERR 가 있으면 json 형태로 페이지에 표시하고, 에러가 없다면 render함(페이지를 Dynamic 하게 제작)
app.get('/contacts', function(req,res) {

    //모델.find(검색조건, callback_함수) -> {}로 보내면 모든 DATA조회 , {lastName:"Kim"}이면 Kim인 모델들을 찾음.
    //Callback 함수 는 err, contacts를 전달. contacts는 항상 array 형태
    Contact.find({}, function(err,contacts){
        if(err) return res.json(err);
        res.render('contacts/index',{contacts:contacts});
    });
});

//Contacts - New
app.get('/contacts/new',function(req,res){
    //2022-11-22 여기 경로 /contacts/test로 작성해서 경로 못찾는 오류 발생했었음. 주의
    res.render('contacts/new');
});

//Contacts - create
app.post('/contacts',function(req,res){
    Contact.create(req.body, function(err, contact){
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

//Contacts - show
// '/contacts/:id' 를 하게 되면 /contacts/abcd1234가 입력될때 route에서 해당 경로를 받아 req.params.id 에 'abcd1234'가 입력
app.get('/contacts/:id',function(req,res){
    //findOne 은 첫번째 params로 찾는 함수
    Contact.findOne({_id:req.params.id}, function (err, contact){
        if(err) return res.json(err);
        res.render('contacts/show', {contact:contact});
    });
});

//Contacts - edit
app.get('/contacts/:id/edit',function(req, res){
    Contact.findOne({_id:req.params.id}, function(err, contact){
        if(err) return res.json(err);
        res.render('contacts/edit',{contact:contact});
    });
});

//Contacts - update
app.put('/contacts/:id',function(req,res){
    //callback함수로 넘겨지는 값은 수정되기 전의 값입니다. 만약 업데이트 된 후의 값을 보고 싶다면 콜백 함수 전에 parameter로 {new:true}를 넣어주면 됩니다.
    Contact.findOneAndUpdate({_id:req.params.id}, req.body, {new:true} , function(err, contact){
        if(err) return res.json(err);
        res.redirect('/contacts/'+req.params.id);
    });
});

//Contacts - destroy
app.delete('/contacts/:id', function(req,res){ 
    Contact.deleteOne({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

//Port Setting
let port = 3000;
app.listen(port,function(){
    console.log('server on : localhost:'+port);
});