var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../public/javascripts/mysql.js');
var connection = mysql.createConnection(dbconfig);

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req,res,next){
  var topic;
  connection.query('SELECT * FROM board',(error, rows)=>{
    if(error) throw error;
    topic = rows;
    res.render('index.ejs', {topic : rows});
  });
  
})

router.get('/create', function(req,res,next){
  res.render('create.ejs'); 
});

router.post('/create_process',function(req,res,next){
  connection.query('insert into board (title, writer, content) values (?,?,?)'
  , [req.body.title, req.body.writer, req.body.content], (error, result)=>{
    if(error) throw error;
  });
  res.redirect(303, '/');
});

router.get('/detail/:id', function(req,res,next){
  connection.query('SELECT * FROM board WHERE id = ?', [req.params.id] ,(error, rows)=>{
    if(error) throw error;
    if(rows.length <= 0) return ;
    res.render('detail.ejs', {topic : rows[0]});
  });
});

router.post('/delete_process',function(req,res,next){
  connection.query('delete from board where id = ?', [req.body.id], (error, result)=>{
    if(error) throw error;
  });
  res.redirect(303, '/');
});

router.get('/update/:id', function(req,res,next){
  connection.query('SELECT * FROM board WHERE id = ?', [req.params.id] ,(error, rows)=>{
    if(error) throw error;
    if(rows.length <= 0) return ;
    res.render('update.ejs', {topic : rows[0]});
  });
})

router.post('/update_process',function(req,res,next){
  connection.query('update board set title = ?, content = ? where id = ?'
  , [req.body.title, req.body.content, req.body.id], (error, result)=>{
    if(error) throw error;
    res.redirect(303, '/detail/' + req.body.id);
  });
});



module.exports = router;
