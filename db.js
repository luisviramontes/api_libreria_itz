//incluimos Mongoose y abrimos una conexión
var mongoose = require('mongoose')
var MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/db_librerias'
mongoose.connect(MONGO_URL)

mongoose.connection.on('connected',function(){
    console.log('Conectado a la base de datos '+ MONGO_URL);
})

mongoose.connection.on('error',function(err){
    console.log('Error al conectar la base de datos: '+err);
})

mongoose.connection.on('disconnected',function(){
    console.log('Desconectado de la base de datos')
})
