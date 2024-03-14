const express = require('express');
const router = express.Router();

module.exports = function(port) {
    // Rutas de tu aplicación
    router.get('/', (req, res) => {
        res.send(`El puerto de esta aplicación es: ${port}`);
    });

    return router;
};