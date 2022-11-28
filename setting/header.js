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



let init = function(app,env){
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
}

module.exports.init = init;