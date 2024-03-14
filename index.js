const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit');
const {SwaggerTheme} = require('swagger-themes');
require('./db');
const routes = require('./routes');
const app = express();
const port = 3000;

//Motor de plantillas ejs
app.use(bodyParser.urlencoded({extended:true}));
const path = require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));//ajustar las rutas segun la estructura de neustra carpeta

//LIMITAR LAS CONEXION POR TIEMPO DETERMINADO
const limiter = rateLimit({
    windowMs: 1*60*1000, // corresponde a 5 minutos
    max: 20, // limitamos el número de solicitudes 
    message: 'Has realizado el limite permitido de solicitudes, por favor espera 5 minutos',
});
//https://www.npmjs.com/package/express-rate-limit
app.use(limiter);


//parseamos la solicitud y  limitamos el tamaño de las solicitudes
app.use(bodyParser.json({limit:'50kb'}));




// RUTAS PARA EL CRUD DE LIBROS
app.use(routes);



//configuramos nuestro tema de swagger
const theme = new SwaggerTheme();

//Configuración de swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Servicio REST de Libros ITZ',
            description: 'API REST para administrar libros',
            version: '1.0.0',
            contact:{
                name:'Luis Viramontes',
                email:'luis@tecnored.mx',
                url:'https://ejemplo.com/support,'
            },
            termsOfService:"http://ejemplo.com/terms",
        },
        securityDefinitions:{
            bearerAuth:{
                type:'apiKey',
                name:'Authorization',
                in:'header',
                description:'Añade tu token de seguridad en la cabecera de la solicitud.'
            }
        }
    },
    apis: ['doc.js'],
}

const options = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
}
//INICIAMOS LA DOCUMENTACION DE NUESTRO SERVICIO
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/libreria-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,options));


module.exports = app; 
//exportamos la aplicación para poder ser utilizada en otros archivos

/*
//INICIAR EL SERVIDOR
app.listen(port, () => {
    console.log('Servidor escuchando en el puerto:' + port);
});
*/

