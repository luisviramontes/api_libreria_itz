/**
 * @swagger
 * /libros:
 *   get:
 *     summary: Obtener todos los libros
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de libros
 *       
 */


/**
 * @swagger
 * /libros/{id}:
 *   get:
 *     summary: Obtener un libro por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del libro
 */


/**
 * @swagger
 * /libros:
 *   post:
 *     summary: Crear un nuevo libro
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: body
 *        required: true
 *        name: libro
 *        schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Nuevo Libro"
 *               autor:
 *                 type: string
 *                 example: "Nombre del autor"
 *               año:
 *                 type: number
 *                 example: 2024
 *     responses:
 *       201:
 *         description: Libro creado exitosamente
 */


/**
 * @swagger
 * /libros/{id}:
 *   put:
 *     summary: Crear un nuevo libro
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        required: true
 *        name: id
 *        schema:
 *        type: string
 *      - in: body
 *        required: true
 *        name: libro
 *        schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Titulo del Libro a actualizar"
 *               autor:
 *                 type: string
 *                 example: "Nombre del autor"
 *               año:
 *                 type: number
 *                 example: 2024
 *     responses:
 *       201:
 *         description: Libro actualizado exitosamente
 */


/**
 * @swagger
 * /libros/{id}:
 *   delete:
 *     summary: Eliminar un libro por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Libro eliminado con éxito
 *       404:
 *         description: Libro no encontrado
 */


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     parameters:
 *      - in: body
 *        required: true
 *        name: user
 *        schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "luis@prueba.com"
 *               password:
 *                 type: string
 *                 example: "qwerty1234"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */

/**
 * @swagger
 * /get-token:
 *   post:
 *     summary: Obtener un token de autenticación
 *     parameters:
 *      - in: body
 *        required: true
 *        name: token
 *        schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "luis@prueba.com"
 *               api_key:
 *                 type: string
 *                 example: "ReugbbHñowr4XS0"
 *     responses:
 *       201:
 *         description: Token generado exitosamente
 */