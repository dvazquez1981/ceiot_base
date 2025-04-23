import {Router} from 'express'
import {sanitizeMiddlewareInput} from '../utils/sanitize.js'

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


router.get('/usuario', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAll);

router.get('/usuario/:user_id',sanitizeMiddlewareInput, /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getOne);

router.post('/usuario',sanitizeMiddlewareInput, crearUser);

router.delete('/usuario/:user_id',sanitizeMiddlewareInput,deleteUser);

router.patch('/usuario/:user_id', sanitizeMiddlewareInput,updateUser);

export default router;