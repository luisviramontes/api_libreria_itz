const express = require('express');
const librosController = require('./controllers/LibrosController');
const usersController = require('./controllers/UsersController');
const authenticateJWT = require('./authMiddleware');

const router = express.Router();



//RUTA PARA REGISTRAR USUARIOS
router.post('/users', async (req, resp) => {
    console.log(req.query);
    usersController.create(req, resp);
})
//Ruta para solicitar token de autenticacion
router.post('/get-token', async (req, res) => {
    if (Object.keys(req.query).length > 0) {
        var request = req.query;
    } else if (Object.keys(req.body).length > 0) {
        var request = req.body;
    }
    console.log(request);
    const { email, api_key } = request;
    try {
        const result = await usersController.authenticate(email, api_key);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
})
//rutas protegidas por un token
router.get('/libros', authenticateJWT, async (req, resp) => {
    librosController.list(req, resp);
});

router.get('/libros/:id', authenticateJWT, async (req, resp) => {
    librosController.show(req, resp);
});

router.post('/libros', authenticateJWT, async (req, resp) => {
    librosController.create(req, resp);
});
router.put('/libros/:id', authenticateJWT, async (req, resp) => {
    librosController.update(req, resp);
});

router.delete('/libros/:id', authenticateJWT, async (req, resp) => {
    librosController.delete(req, resp);
});

//rutas para el manejo de sesión
router.get('/login', async (req, resp) => {
    usersController.token_login(req, resp);
})

router.post('/login', async (req, resp) => {
    usersController.login(req, resp);
})

router.post('/agregarSaldo', async (req, resp) => {
    usersController.actualizarModalSaldoUsuario(req, resp)
});

router.post('/logout',async(req, resp) =>{
    usersController.logout(req,resp);
})

module.exports = router;