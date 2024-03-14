//const { request } = require('express');
var Libros = require('../models/Libros');
const usersController = require('./UsersController');

//CRUD DE OPERACIONES
//FUNCION PARA CREAR LIBROS
exports.create = async function (req, resp) {

    if (Object.keys(req.query).length > 0) {
         var request = req.query
    } else if (Object.keys(req.body).length > 0) {
        var request = req.body;
    }
    console.log(request);
    try {
        const saldo = await usersController.validaSaldousuario(request);
        if(!saldo){
          return resp.status(403).json({mensaje:'Usuario sin saldo suficiente para poder procesar la petición'})
        }
        var libro = new Libros(request);
        await libro.save();
        await usersController.actualizarSaldoUsuario(req);
        return resp.json({ libro, mensaje: 'Libro guadado correctamente' })
    } catch (error) {
        return resp.status(500).json({
            message: "Error al guardar el libro",
            error: error
        })
    }
}

//FUNCION PARA LISTAR TODOS LOS LIBROS
exports.list = async function (req, resp) {
    try {

        const saldo = await usersController.validaSaldousuario(req);
        if(!saldo){
          return resp.status(403).json({mensaje:'Usuario sin saldo suficiente para poder procesar la petición'})
        }
        const libros = await Libros.find();
        await usersController.actualizarSaldoUsuario(req);
        return resp.json(libros);
    } catch (error) {
        return resp.status(500).json({
            message: "Error al obtener todos los libros ",
            error: error.message
        })
    }
}

//FUNCION PARA ACTUALIZAR LOS LIBROS

exports.update = async function (req, resp) {
    if (Object.keys(req.query).length > 0) {
        var request = req.query;
    } else if (Object.keys(req.body).length > 0) {
        var request = req.body;
    }

    try {
        const saldo = await usersController.validaSaldousuario(request);
        if(!saldo){
          return resp.status(403).json({mensaje:'Usuario sin saldo suficiente para poder procesar la petición'})
        }
        const libroAct = await Libros.findByIdAndUpdate(
            req.params.id,
            request,
            { new: true }
        );
        if (!libroAct) {
            return resp.status(404).json({ error: 'Libro no econtrado' });
        } else {
            await usersController.actualizarSaldoUsuario(req);
            resp.status(200).json({ libroAct, msj: 'Libro actualizado correctamemte' })
        }
    } catch (error) {
        return resp.status(500).json({
            message: "Error al actualizar el libro",
            error: error
        })
    }
}
//FUNCION PARA ELIMINAR LIBROS
exports.delete = async function (req, resp) {
    try {
        const saldo = await usersController.validaSaldousuario(req);
        if(!saldo){
          return resp.status(403).json({mensaje:'Usuario sin saldo suficiente para poder procesar la petición'})
        }
        const eliminarLibro = await Libros.findByIdAndDelete(req.params.id);

        if (!eliminarLibro) {
            return resp.statrus(404).json({ error: 'Libro no econtrado' });
        } else {
            await usersController.actualizarSaldoUsuario(req);
            resp.status(202).json({ msj: 'Libro eliminado' });
        }

    } catch (error) {
        return resp.status(500).json({
            message: "Error al eliminar el libro",
            error: error
        })
    }
}

//FUNCION PARA BUSCAR UN LIBRO POR ID
exports.show = async function (req, resp) {
    try {
        const saldo = await usersController.validaSaldousuario(req);
        if(!saldo){
          return resp.status(403).json({mensaje:'Usuario sin saldo suficiente para poder procesar la petición'})
        }
        const libro = await Libros.findById(req.params.id);
        if (!libro) {
            return resp.status(404).json({ error: 'Libro no encontrado' });
        } else {
            await usersController.actualizarSaldoUsuario(req);
            return resp.status(200).json(libro)
        }
    } catch (error) {
        return resp.status(500).json({
            message: "Error al mostrar el libro",
            error: error
        })
    }
}