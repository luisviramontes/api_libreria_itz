const jwt = require('jsonwebtoken');
//Middelware de auntenticación utilizando JWT
const authenticateJWT = (req,res,next)=>{
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({error:'Acceso no autorizado token requerido'});
    jwt.verify(token,'tu-palabra-secreta',(err,user)=>{
        console.log(user);
        if(err) return res.status(403).json({error:'Token inválido'});
        req.user = user;
        next();
    })
}

module.exports = authenticateJWT;