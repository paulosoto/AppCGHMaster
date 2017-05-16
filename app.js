
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var session = require('express-session');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

var app = express();

var fs = require('fs');

var cookieParser = require('cookie-parser'); 

app.use(cookieParser());

app.use(session({secret:'hehe'}));

app.use(bodyParser());

//mongoose.connect('mongodb://172.16.21.70:27017/data');
mongoose.connect('mongodb://data:Josmell.2015@ds157459.mlab.com:57459/heroku_5tp70h1l');
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open ');
}); 
// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error' );
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});
// all environmentss
app.set('port', process.env.PORT ||80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride()); 
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



var ssn;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server =http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
}); 

app.get('/', function(req, res){ 
  //res.writeHead(200,{'content-type':'text/html'});
  fs.readFile('./public/index.html', null, function(error, data){
    if(error){
      res.writeHead(404);
      res.write('File not Found!');
    }else{
      res.writeHead(200,{'content-type':'text/html'});
      res.write(data);
    }
    res.end();
  });

});

app.post('/index2', function(req, res){ 
  //res.writeHead(200,{'content-type':'text/html'});
  fs.readFile('./public/index2.html', null, function(error, data){
    if(error){
      res.writeHead(404);
      res.write('File not Found!');
    }else{
      res.writeHead(200,{'content-type':'text/html'});
      res.write(data);
    }
    res.end();
  });

});

app.get('/publicacion/:id', function(req, res){
   
   Post.find({_id:req.params.id}, function (err, docs) {
        res.json(docs);
    });
});


app.put('/publicacion/:id', function(req, res){
  Post.findByIdAndUpdate({_id: req.params.id},
         {
          tv_titulo_post: req.body.f_titulo,
          tv_detalle_post: req.body.f_texto
         }, function(err, docs){
        if(err) res.json(err);
        else
        { 
           console.log(docs);
           //res.redirect('/user/'+req.params.id);
         }
       });
});

app.delete('/delete/:id', function(req, res){ 
  
  Post.findByIdAndRemove({_id:req.params.id}, function(err, docs) {
        if(err){
          console.log(err);
        }else{
          //res.redirect('/index2');
        }
    });

});

var Usuario = require('./models/usuarios');
var Post = require('./models/post');
var Success = require('./models/success');
app.get('/usuario', function(req, res){
   
   Usuario.find({}, function (err, docs) {
        res.json(docs);
    });
});

app.get('/sesion/:email/:pass', function(req, res){ 
  
  Usuario.find({usuario:req.params.email, contrasenia:req.params.pass}, function(err, docs) {
        if(err){
          console.log(err);
        }else{
          //app.use(session({secret:'XASDASDA'}));
          res.json(docs);
        }
    });
});

app.post('/login',function(req,res){
  ssn = req.session;
  ssn.s_nombre=req.body.s_nombre;
  ssn.s_id_user=req.body.s_id_user;
  ssn.s_photo=req.body.s_photo;
  res.end('done');
});

app.get('/session/iduser',function(req,res){
  ssn = req.session;
  res.end(ssn.s_id_user);
});

app.get('/session/nombre',function(req,res){
  ssn = req.session;
  res.end(ssn.s_nombre);
});

app.get('/session/photo',function(req,res){
  ssn = req.session;
  res.end(ssn.s_photo);
});

app.post('/logout',function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.get('/publicacion', function(req, res){
   
   Post.find({}, function (err, docs) {
        res.json(docs);
    }).sort({"_id":"desc"});
});

app.post('/publicacion', function(req, res){
  var _id_usuario    = req.body.id_usuario;
  var img_url_usuario= req.body.img_url_usuario;
  var tv_nombre_usuario= req.body.tv_nombre_usuario;
  var tv_titulo_post = req.body.tv_titulo_post;
  var tv_fecha_post  = req.body.tv_fecha_post;
  var tv_detalle_post= req.body.tv_detalle_post;
  var cant_goods     = req.body.cant_goods;
  var cant_post_comentarios = req.body.cant_post_comentarios;
  var btn_goods      = req.body.btn_goods;
  var btn_comentarios= req.body.btn_comentarios;
  var fecha_registro = req.body.fecha_registro;
  var estado         = req.body.estado;
  var tipo           = req.body.tipo;
  var img_url        = req.body.img_url;
  var postNew = new Post({ 
       _id_usuario    : _id_usuario,
       img_url_usuario: img_url_usuario,
       tv_nombre_usuario: tv_nombre_usuario,
       tv_titulo_post : tv_titulo_post,
       tv_fecha_post  : tv_fecha_post,
       tv_detalle_post: tv_detalle_post,
       cant_goods     : cant_goods,
       cant_post_comentarios : cant_post_comentarios,
       btn_goods      : btn_goods,
       btn_comentarios: btn_comentarios,
       fecha_registro : fecha_registro,
       estado         : estado,
       tipo           : tipo,
       img_url        : img_url
  });
  postNew.save(function(err) {
      if (err) throw err;
      Success = new Success({  result:'true' });
        res.json(Success);
  }); 


});
app.post('/usuario', function(req, res){
  var idSocial   = req.body.id_social;
  var tipoSocial = req.body.tipo_social;
  var usuario    = req.body.usuario;
  var contrasenia= req.body.contrasenia;
  var dni        = req.body.dni;
  var celular    = req.body.celular;
  var email      = req.body.email;
  var genero     = req.body.genero;
  var nombre     = req.body.nombre; 
  var apellido   = req.body.apellido; 
  var fechaNacimiento  = req.body.fecha_nacimiento; 
  var foto       = req.body.foto; 
  var codigoTrabajador = req.body.codigo_trabajador; 
  var fechaRegistro    = req.body.fecha_registro; 
  var estado     = req.body.estado;  
  var usuarioNew = new Usuario({  
                        id_social:idSocial,
                        tipo_social:tipoSocial,
                        usuario: usuario,
                        contrasenia:contrasenia, 
                        dni:dni, 
                        celular:celular, 
                        email:email, 
                        genero:genero,
                        nombre:nombre,
                        apellido:apellido,
                        fecha_nacimiento:fechaNacimiento,
                        foto:foto,
                        codigo_trabajador:codigoTrabajador, 
                        estado:estado  
                      });
  usuarioNew.save(function(err) {
      if (err) throw err;
      Success = new Success({  result:'true' });
        res.json(Success);
  }); 

});