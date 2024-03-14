const cluster = require('cluster');
const os = require('os');
const app = require('./index');
const http = require('http');

//Vamos a obtener el número de CPUs de  nuestro equipo
const numCPUs = os.cpus().length;
console.log('Número de CPUs: '+numCPUs);

const numWorkers = 3;//definimos cuantas replicas queremos

//definimos nuestro Cluster Maestro
if(cluster.isMaster){
    console.log('Cluster Maestro '+process.pid+" esta en ejecución");

    //Definimos el número de replicas
    for(let i= 0; i < Math.min(numWorkers,numCPUs);i++){
        //Limitamos el número de workers al mínimo entre el número deseado
        // y el número de CPUS disponibbles
        cluster.fork();        
    }

    cluster.on('exit',(worker,code,signal)=>{
        console.log('Worker'+worker.process.pid+" ha fallado");
        //se reinicia el worker en caso de que falle
        cluster.fork();
    })

}else{
    //Código para iniciar la aplicación en cada worker
     const port = 3000+cluster.worker.id ;

     app.use('/',require('./prueba_rutas')(port));
     
     app.listen(port,()=>{
        console.log('Servidor escuchando en el puerto: '+port);
        console.log('Worker iniciado con el pid:'+ process.pid);
        console.log('Worker ID:'+ cluster.worker.id);
     })
}