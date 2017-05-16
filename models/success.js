var mongoose = require('mongoose');
var Success = mongoose.model('Success', 
                { 
                 result:String
                }); 
module.exports = Success;