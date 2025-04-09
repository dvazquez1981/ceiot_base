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
    getAllView ,
    getOne,
    getAllHtml,
    getOneHtml,
    getOneTerm,
    crearDevice,
    deleteDevice,
    updateDevice
    } from '../controllers/DeviceController.js';

/** Rutas */
const router = Router();

/** Controladores */

/** Obtener devices*/
router.get('/device', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAll,sanitizeMiddlewareOutput);

router.get('/device/:id',sanitizeMiddlewareInput, /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getOne,sanitizeMiddlewareOutput);

router.get('/web/device/:id', sanitizeMiddlewareInput,getOneHtml,sanitizeMiddlewareOutput);

router.get('/web/device', sanitizeMiddlewareInput,getAllHtml,sanitizeMiddlewareOutput,sanitizeMiddlewareOutput);

router.get('/term/device/:id',sanitizeMiddlewareInput,getOneTerm,sanitizeMiddlewareOutput);

router.post('/device',sanitizeMiddlewareInput, crearDevice,sanitizeMiddlewareOutput);

router.delete('/device/:id',sanitizeMiddlewareInput,deleteDevice,sanitizeMiddlewareOutput);

router.patch('/device/:id', sanitizeMiddlewareInput,updateDevice,sanitizeMiddlewareOutput);

router.get('/views/device',  getAllView );

/** Exporto */
export default router;
