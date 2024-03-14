var mongoose = require('mongoose');
var Schema = mongoose.Schema

//definir el esquema de nuestra libreria

const libroSchema = new Schema({
    titulo: String,
    autor: String,
    year: Number,
})

//definimos el modelo del libro
const Libro = mongoose.model('Libro',libroSchema)
module.exports = Libro;