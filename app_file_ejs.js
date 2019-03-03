var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12qwas',
  database : 'o2',
  multipleStatements : true
});
conn.connect();
var app = express();
app.use(bodyParser.urlencoded({extended: false})); //post로 들어오는 리퀘스트를 
app.locals.pretty = true;
app.set('views','./views_file'); //템플릿엔진의 파일들은 views , ./views_file 경로지정
app.set('view engine', 'ejs'); //npm jade install 후 --> jade 사용설정 구문
app.get('/topic/add', function(req,res){ //글 작성할때
    res.render('new');
})

app.get('/topic/',function(req,res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
      res.render('list',{topics:topics})  
    });
})

// 상세 old -- 상세만 출력 
// app.get(['/topic', '/topic/:id'],function(req,res){
//     var listId = req.params.id;
//     var sqlView = 'SELECT * FROM topic WHERE '+'id'+' IN ('+listId+')';
//     var sql = 'SELECT * FROM comment_table WHERE '+'boardCode'+' IN ('+listId+')';
//     conn.query(sqlView, function(err, topics, fields){
//       res.render('view',{topics:topics}); 
//     });
// })


// 상세 +  댓글 출력 중첩쿼리로 
// app.get(['/topic', '/topic/:id'],function(req,res){
//     var listId = req.params.id;
//     var sqlTopic = 'SELECT * FROM topic WHERE '+'id'+' IN ('+listId+')';
//     conn.query(sqlTopic, function(err, topics, fields){
//         if(err){
//             console.log(err);
//             res.status(500).send('interal server error');
//         }else{
//             var sqlCmt = 'SELECT * FROM comment_table WHERE '+'boardCode'+' IN ('+listId+')';
//             conn.query(sqlCmt, function(err, cmts, fields){
//                 if(err){
//                     console.log(err);
//                     res.status(500).send('interal server error');
//                 }else{
//                     res.render('view',{topics:topics, cmts:cmts}); 
//                 }
//             });
//         } 
//     });
// })



app.get(['/topic', '/topic/:id'],function(req,res){
    var listId = req.params.id;
    // var sqlTopic = 'SELECT * FROM topic WHERE '+'id'+' IN ('+listId+')';
    // var sqlCmt = 'SELECT * FROM comment_table WHERE '+'boardCode'+' IN ('+listId+')';
    conn.query('SELECT * FROM topic WHERE id = '+listId+';SELECT * FROM comment_table WHERE boardCode = '+listId+';', function(err, topics, fields){
        //if (error) throw error;
        res.render('view',{topics}); 
       
    });
        
})

// //댓글 페이지 분기 출력 
// app.get('/topic/:id/rp',function(req,res){
//     var listId = req.params.id;
//     var sql = 'SELECT * FROM comment_table WHERE '+'boardCode'+' IN ('+listId+')';
//     conn.query(sql,sql function(err, cmts, fields){
//       res.render('rplist',{cmts:cmts})
//     });
// })


// 게시글 작성
// app.post('/topic', function(req, res){
//     var name = req.body.name;
//     var title = req.body.title;
//     var description = req.body.description;
//     fs.writeFile('data/'+title, description, function(err){
//         if(err){
//             console.log(err);
//             res.status(500).send('interal server error');
//         }
//         res.send('success');
//     });
// });


app.listen(3000, function(){ 
    console.log('connected 3000 port')
})