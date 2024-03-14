var mongoose = require('mongoose');
var Schema = mongoose.Schema

//Funcion para generar una cadena aleatoria alfanumerica
const generaApiKey = ()=>{
    const characters="QWERTYUIOPASDFGHJKLÑZXCVBNMqwertyuiopadfghjklñzxbmmb1234567890";
    let apiKey='';
    for(let i = 0; i < 15; i++){
        apiKey +=characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return apiKey;
}

//definir el esquema de los usuarios
const userSchema = new Schema({
    email: {type:String, require:true, unique:true},
    password: {type:String, require:true},
    api_key: {type:String, require:true, unique:true,default:generaApiKey},
    saldo: {type:Number, default:5},
})

//Middleware para generar la api_key antes de guardar un nuevo usuario
userSchema.pre('save',function(next){
    if(!this.api_key){
        this.api_key= generaApiKey();
    }
    next();
});

//definimos el modelo del usuario
const User = mongoose.model('User',userSchema)
module.exports = User;