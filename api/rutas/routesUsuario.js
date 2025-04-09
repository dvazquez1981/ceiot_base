import {Router} from 'express'
import {sanitizeMiddlewareInput,sanitizeMiddlewareOutput} from '../utils/sanitize.js'

/*
import {  
    ensureToken,
    chequeoToken,
    chequeoGrupoUsuario,
    } from '../controllers/UserController.js';

*/
import {  
    getAll,
    getOne,
    crearUser,
    deleteUser,
    updateUser
    } from '../controllers/UserController.js';

/** Rutas */
const router = Router();

/** Controladores */

/** Obtener devices*/
router.get('/usuario', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAll,sanitizeMiddlewareOutput);

router.get('/usuario/:user_id',sanitizeMiddlewareInput, /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getOne,sanitizeMiddlewareOutput);

router.post('/usuario',sanitizeMiddlewareInput, crearUser,sanitizeMiddlewareOutput);

router.delete('/usuario/:user_id',sanitizeMiddlewareInput,deleteUser,sanitizeMiddlewareOutput);

router.patch('/usuario/:user_id', sanitizeMiddlewareInput,updateUser,sanitizeMiddlewareOutput);

export default router;