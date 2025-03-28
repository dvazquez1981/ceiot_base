import {Router} from 'express'

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
router.get('/device', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAll);

router.get('/device/:id', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getOne);

router.get('/web/device/:id', getOneHtml);

router.get('/web/device', getAllHtml);

router.get('/term/device/:id',getOneTerm);

router.post('/device', crearDevice);

router.delete('/device/:id',  deleteDevice);

router.patch('/device/:id', updateDevice);



/** Exporto */
export default router;
