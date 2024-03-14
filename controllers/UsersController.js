var Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const blacklistedTokens = new Set();

//FUNCION PARA CREAR USUARIOS
exports.create = async function (req, resp) {

    if (Object.keys(req.query).length > 0) {
        var request = req.query
    } else if (Object.keys(req.body).length > 0) {
        var request = req.body;
    }
    console.log(request);

    //validar campos obligatorios
    if (!request.email || !request.password) {
        return resp.status(400).json({ message: 'Los campos de email y password son obligatorios' });
    }
    try {
        //verificar si el email ya existe en la base de datos
        const existingUser = await Users.findOne({ email: request.email });
        if (existingUser) {
            return resp.status(400).json({ message: 'El email ya está registrado en la base de datos' });
        }

        //procedemos con guardar el usuario
        const user = new Users(request);
        await user.save();
        return resp.json({ user, message: 'Usuario guardado correctamente' });

    } catch (error) {
        return resp.status(500).json({
            message: 'Error al guardar el usuario'
            , error: error.message
        });
    }

}

exports.authenticate = async function (email, api_key) {
    try {
        //buscar el usuario por email y api_key
        const user = await Users.findOne({ email, api_key });
        if (!user) {
            return { message: 'El email y la api_key no se encuentran' };
        }
        if (user.saldo <= 0) {
            return { message: 'El saldo se ha agotado, favor de realizar una recarga' };
        }
        //si el usuario es valido y tiene > 0 de saldo le generamos un token
        const token = jwt.sign({ email, api_key }, 'tu-palabra-secreta', { expiresIn: '1h' });
        return { token, message: 'Token generado correctamente, será válido por 1 hora' };
    } catch (error) {
        return resp.status(500).json({ message: 'Error en la autenticación: ' + error.message });
    }

}

exports.actualizarSaldoUsuario = async function (req) {
    try {
        const token = req.header('Authorization');

        const decodedToken = jwt.verify(token, 'tu-palabra-secreta');
        console.log(decodedToken);

        //obtener el id del usuario por medio de su api_key
        const usuario = await Users.findOne({ api_key: decodedToken.api_key });

        console.log(usuario);
        //verificar si el usuario existe
        if (!usuario) {
            console.log('Usuario no encontrado');
            return;
        }

        usuario.saldo = usuario.saldo - 1;
        await usuario.save();
        console.log('Saldo actualizado a -1 para el usaurio api_key:' + decodedToken.api_key);
    } catch (error) {
        console.log('Error al actualizar el saldo del usario api_key:' + decodedToken.api_key + ". Error:" + error.message);

    }

}

exports.validaSaldousuario = async function (req) {
    try {
        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token, 'tu-palabra-secreta');
        const usuario = await Users.findOne({ api_key: decodedToken.api_key });
        if (!usuario) {
            return false;
        }
        if (usuario.saldo > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return { error: error.message };
    }
}

exports.token_login = async function(req,resp){
    try {
        const secretKey = 'tu-palabra-secreta';
        const tokenContent = {description:'token_para_login'};

        const token = jwt.sign(tokenContent,secretKey,{expiresIn:'1h'});
        resp.render('login',{csrfToken:token, message:null});
    } catch (error) {
        resp.render('login',{csrfToken:null, message:error.message});
    }
}

exports.login = async function(req,resp){
    try {
        const token= req.body._csrf;
        if(blacklistedTokens.has(token)){
            resp.render('login',{csrfToken:token,message:'El Token ha expirado'});
        }
        if(!token){
            const secretKey = 'tu-palabra-secreta';
            const tokenContent = {description:'token_para_login'};
            const token = jwt.sign(tokenContent,secretKey,{expiresIn:'1h'});
            resp.render('login',{csrfToken:token, message:'El token es requerido'});
        }
        const decodedToken = jwt.verify(token,'tu-palabra-secreta');
        if(decodedToken){
            //si se encontro el token, ahora verificamos el email y contraseña
            const user = await Users.findOne({email:req.body.email,password:req.body.password});
            if(!user){
                resp.render('login',{csrfToken:token, message:'El email y la contraseña no coinciden'});
            }else{
                resp.render('welcome',{email:user.email, api_key:user.api_key,
                    saldo:user.saldo,token:token,message:null});
            }
        }else{
            const secretKey = 'tu-palabra-secreta';
            const tokenContent = {description:'token_para_login'};
            const token = jwt.sign(tokenContent,secretKey,{expiresIn:'1h'});
            resp.render('login',{csrfToken:token, message:'El token no es valido'});
        }
    } catch (error) {
        resp.render('login',{csrfToken:null, message:error.message});
    }

}

exports.actualizarModalSaldoUsuario= async function(req,resp){
    try {
        const token= req.body._csrf;
        if(blacklistedTokens.has(token)){
            resp.render('login',{csrfToken:token,message:'El Token ha expirado'});
        }
        const decodedToken = jwt.verify(token,'tu-palabra-secreta');
        if(decodedToken){
            const user= await Users.findOne({api_key:req.body.api_key, email:req.body.email});
            if(user){
                user.saldo=req.body.nuevoSaldo;
                await user.save();
                resp.render('welcome',{email:user.email, api_key:user.api_key,
                                       saldo:user.saldo, token:token, message:"Saldo actualizado correctamente"});

            }else{
                resp.render('welcome',{email:req.body.email, api_key:req.body.api_key,
                    saldo:req.body.saldo, token:token, message:"Saldo no actualizado, Usuario no encontrado"});
            }

        }else{
            resp.render('welcome',{email:req.body.email, api_key:req.body.api_key,
                saldo:req.body.saldo, token:token, message:"Token no valido"});
        }
    } catch (error) {
        resp.render('welcome',{email:req.body.email, api_key:req.body.api_key,
            saldo:req.body.saldo, token:token, message:error.message});
    }
}

exports.logout = async function(req, resp){
    try {
        const token= req.body._token;
        blacklistedTokens.add(token);
        const secretKey= 'tu-palabra-secreta';
        const tokenContent = {description:'token_para_login'};
        const csrfToken = jwt.sign(tokenContent,secretKey,{expiresIn:'1h'});
        resp.render('login',{csrfToken:csrfToken,message:'Sesión cerrada correctamente'});
    
    } catch (error) {
        resp.render('login',{csrfToken:null,message:error.message});
    }

}

