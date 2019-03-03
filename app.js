var express = require('express');
var app = express();
app.set('view engine', 'jade');
app.set('views', './views'); //안써도 기본값임
app.use(express.static('public'));
app.get('/template', function(req,res){
    res.render('temp', {time:Date(), tit:'Jade'});
})
app.get('/', function(req, res){
    res.send('hello home page');
}); //사용자가 접속한 방식 get
app.get('/dynamic',function(req,res){
    var lis = '';
    var time = Date();
    for(var i=0; i<5; i++){
        lis = lis + '<li>coding</li>';
    }
    var output = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>hello. static</h1>
    <ul>
        ${lis}
    </ul>
    <p>${time}</p>sdfsdf
</body>
</html>`
    res.send(output)

})
app.get('/login',function(req, res){
    res.send('login please aadfdf')
})
app.listen(3001, function(){
    console.log('conneted 3001 port')
});
