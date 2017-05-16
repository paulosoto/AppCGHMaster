var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario', 
                { 
                 id_social:String,
                 tipo_social:String,
 		 		 usuario: String,
                 contrasenia:String,
                 dni:String,
                 celular:String, 
                 email:String,
                 genero:String,
                 nombre:String,
                 apellido:String,
                 fecha_nacimiento:String,
                 foto:String,
                 codigo_trabajador:String,
                 fecha_registro:{ type: Date, default: Date.now },
                 estado:String 
                }); 
module.exports = Usuario;


