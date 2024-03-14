//incluimos Mongoose y abrimos una conexión
var mongoose = require('mongoose')
var MONGO_URL = process.env.MONGO_URL || 'mongodb://luisvr:zacatecas.8@docdb-2024-03-14-01-10-20.cluster-ctmucmi66m25.us-east-2.docdb.amazonaws.com:27017/db_liberia?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'
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
