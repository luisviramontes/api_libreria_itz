const http = require('http');
const httpProxy = require('http-proxy');

//Definimos una variable con las direcciones de las instancias de nuestra aplicacion

const appServers=[
    {host:'localhost',port:3001},
    {host:'localhost',port:3002},
    {host:'localhost',port:3003},
    {host:'localhost',port:3004},
    {host:'localhost',port:3005},
    {host:'localhost',port:3006},
]

//Crear un proxy
const proxy = httpProxy.createProxyServer({});

//Crear una comprobación d eestado

//funcion para comprobar el estado del servidor
function comprobarEstado(server){
    return new Promise((resolve,reject)=>{
        http.get('http://'+server.host+':'+server.port,(res)=>{
            if(res.statusCode === 200){
                resolve();
            }else{
                reject();
            }
        }).on('error',(err)=>{
            reject(err);
        })
    })
} 
//Funcion para eliminar una instancia de aplicación que no esta respondiendo
function eliminarInstancia(){
    appServers.forEach((server,index)=>{
        comprobarEstado(server).then(() =>{
            console.log('Servidor '+server.host+':'+server.port+ " en ejecución")
        })
        .catch(() =>{
            console.log('Eliminando el Servidor '+server.host+':'+server.port);
            appServers.splice(index,1);
        })
    })
}

//Comprobar el estado de las instancias por cada cierto intervalo
const intervalo = 5000; // 5 segundos
setInterval(eliminarInstancia,intervalo);
//Crear el servidor para balancer la carga
const server = http.createServer((req,resp)=>{
    //Establecemos la regla para el balanceo de carga y redirigir a la applicacion)
    //Elege aleatoriamente
    const target = appServers[Math.floor(Math.random() * appServers.length)];

    //Redirije la solicitud al servidor destino
    proxy.web(req,resp,{
        target:'http://'+target.host+":"+target.port
    });
})

//Manejo de errores del proxy
proxy.on('error',(err,req,resp)=>{
    console.log('Proxy error:'+err);
    resp.writeHead(500,{'Content-Type':'text/plain'});
    resp.end('Proxy error.');
})

//Iniciamos el servidor balanceador de carga en el puerto 8000
const port = 8000;
server.listen(port , () =>{
    console.log('Balanceador de carga escuchando en el puerto: '+port);
})
