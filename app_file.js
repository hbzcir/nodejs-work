var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12qwas',
    database: 'o2',
    multipleStatements: true
});

// var pool = mysql.createPool({
//     host    :'localhost',
//     user : 'root',
//     password : '12qwas',
//     database:'o2',
//     connectionLimit:20,
//     waitForConnections:false
// });

conn.connect();
var app = express();
app.use(bodyParser.urlencoded({ extended: false })); //post로 들어오는 리퀘스트를 
app.locals.pretty = true;
app.set('views', './views_file'); //템플릿엔진의 파일들은 views , ./views_file 경로지정
app.set('view engine', 'jade'); //npm jade install 후 --> jade 사용설정 구문

// board list - 게시판 목록
app.get('/topic/', function(req, res) {
    var sql = 'SELECT * FROM topic';
    var tit = req.body.title;
    conn.query(sql, function(err, topics, fields) {
        res.render('list', { topics: topics })
    });
});

//write - 새글쓰기.화면렌더
app.get('/topic/add', function(req, res) { // 새로운 글 등록 page render
    res.render('new');
});
//write - 새글쓰기 .action post
app.post('/topic/add', function(req, res) {
    var dbTit = req.body.ipTit;
    var dbDscr = req.body.ipDcr;
    var dbAuthor = req.body.ipAuthor;
    // var sql = 'INSERT INTO topic (title, description, author) VALUSE(? ,? ,? )';
    conn.query('insert into topic(title, description, author) values(?, ?, ?)', [dbTit, dbDscr, dbAuthor], function(err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('internal server error')
        } else {
            res.redirect('/topic/' + results.insertId);
        }
    })
});


// board view - 게시판 상세
app.get(['/topic', '/topic/:id'], function(req, res) {
    var listId = req.params.id;
    var tit = req.body.title;
    conn.query('SELECT * FROM topic WHERE id = ' + listId + ';SELECT * FROM comment_table WHERE boardCode = ' + listId + ';', function(err, topics, fields) {
        //if (error) throw error;
        res.render('view', { topics });
    });
});


// ****** write는 write고. write엑션 처리기가 있고. 답글과 글쓰기는 다른 렌더 . 이다. 
//:: 답글 > 키워드 계층형 게시판 알고리즘 

// 답글달기 get
app.get('/topic/add/:id', function(req, res) {
    var listId = req.params.id;
    var tit = req.body.title;
    conn.query('SELECT * FROM topic WHERE id = ' + listId, function(err, topics, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('internal server error')
        }
        res.render('write', { topics });
    });
});

// 답글달기 action
app.post('/topic/:id', function(req, res) {
    var listId = req.params.id;
    var dbTit = req.body.ipTit;
    var dbDscr = req.body.ipDcr;
    var dbAuthor = req.body.ipAuthor;
    conn.query('SELECT * FROM topic WHERE id = ' + listId + ';SELECT * FROM comment_table WHERE boardCode = ' + listId + ';insert into topic(title, description, author, depth) values(?, ?, ?, ?);', [dbTit, dbDscr, dbAuthor, '1'], function(err, topics, fields) {
        console.log(req.body.ipTit)
        if (err) {
            console.log('sdfsdfsd');
            res.status(500).send('internal server error')
        } else {
            var ids = '/topic/' + topics[2].insertId;
            res.redirect(ids);
        }
    });
});








/* 댓글 페이지 분기 출력 
app.get('/topic/:id/rp',function(req,res){
    var listId = req.params.id;
    var sql = 'SELECT * FROM comment_table WHERE '+'boardCode'+' IN ('+listId+')';
    conn.query(sql,sql function(err, cmts, fields){
      res.render('rplist',{cmts:cmts})
    });
})
*/

/* 상세 old - 상세만 출력 
app.get(['/topic', '/topic/:id'],function(req,res){
    var listId = req.params.id;
    var sqlView = 'SELECT * FROM topic WHERE '+'id'+' IN ('+listId+')';
    var sql = 'SELECT * FROM comment_table WHERE '+'boardCode'+' IN ('+listId+')';
    conn.query(sqlView, function(err, topics, fields){
      res.render('view',{topics:topics}); 
    });
})
*/

/* 상세 +  댓글 출력 중첩쿼리 방법으로 
app.get(['/topic', '/topic/:id'],function(req,res){
    var listId = req.params.id;
    var sqlTopic = 'SELECT * FROM topic WHERE '+'id'+' IN ('+listId+')';
    conn.query(sqlTopic, function(err, topics, fields){
        if(err){
            console.log(err);
            res.status(500).send('interal server error');
        }else{
            var sqlCmt = 'SELECT * FROM comment_table WHERE '+'boardCode'+' IN ('+listId+')';
            conn.query(sqlCmt, function(err, cmts, fields){
                if(err){
                    console.log(err);
                    res.status(500).send('interal server error');
                }else{
                    res.render('view',{topics:topics, cmts:cmts}); 
                }
            });
        } 
    });
})
*/

/* 게시글 작성
app.post('/topic', function(req, res){
    var name = req.body.name;
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title, description, function(err){
        if(err){
            console.log(err);
            res.status(500).send('interal server error');
        }
        res.send('success');
    });
});
*/

app.listen(3000, function() {
    console.log('connected 3000 port')
})