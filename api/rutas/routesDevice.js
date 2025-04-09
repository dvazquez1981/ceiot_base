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
    getAllApi,
    getAllWeb,
    getAllDevicesMeasurements,
    getOneApi,
    getAllHtml,
    getOneHtml,
    getOneTerm,
    crearDeviceApi,
    crearDeviceWeb,
    deleteDeviceApi,
    deleteDeviceWeb,
    updateDeviceApi,
    updateDeviceWeb
    } from '../controllers/DeviceController.js';

/** Rutas */
const router = Router();

/** rutas */

/** anteriores */
router.get('/web/device/:id', sanitizeMiddlewareInput,getOneHtml,sanitizeMiddlewareOutput);

router.get('/web/device', sanitizeMiddlewareInput,getAllHtml,sanitizeMiddlewareOutput,sanitizeMiddlewareOutput);

router.get('/term/device/:id',sanitizeMiddlewareInput,getOneTerm,sanitizeMiddlewareOutput);


/** apis*/
router.get('/device', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAllApi/*,sanitizeMiddlewareOutput*/);

router.get('/device/:id',sanitizeMiddlewareInput, /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getOneApi,sanitizeMiddlewareOutput);

router.post('/device',sanitizeMiddlewareInput, crearDeviceApi,sanitizeMiddlewareOutput);

router.delete('/device/:id',sanitizeMiddlewareInput,deleteDeviceApi,sanitizeMiddlewareOutput);

router.patch('/device/:id', sanitizeMiddlewareInput,updateDeviceApi,sanitizeMiddlewareOutput);



/** html*/

router.post('/html/device',sanitizeMiddlewareInput, crearDeviceWeb,sanitizeMiddlewareOutput);

router.delete('/html/device/:id',sanitizeMiddlewareInput,deleteDeviceWeb,sanitizeMiddlewareOutput);

router.patch('/html/device/:id', sanitizeMiddlewareInput,updateDeviceWeb,sanitizeMiddlewareOutput);


/** vistas */

router.get('/views/DevicesMeasurements',  getAllDevicesMeasurements);

router.get('/views/Devices',getAllWeb);

/** Exporto */
export default router;
