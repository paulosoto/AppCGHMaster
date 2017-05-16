var mongoose = require('mongoose');
var Post = mongoose.model('Post', 
                { 
                 _id_usuario:String,
                 img_url_usuario:String,
                 tv_nombre_usuario:String,
                 tv_titulo_post:String,
 		 tv_fecha_post: String,
                 tv_detalle_post:String,
                 img_url:String, 
                 cant_goods:String,
                 cant_post_comentarios:String, 
                 btn_goods:String,
                 btn_comentarios:String,  
                 fecha_registro:{ type: Date, default: Date.now },
                 estado:String,
                 tipo:String  
                }); 
module.exports = Post;