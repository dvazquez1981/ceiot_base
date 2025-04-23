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
    getAllApi,
    getAllWeb,
    getAllDevicesMeasurementsWeb,
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
router.get('/web/device/:id', sanitizeMiddlewareInput,getOneHtml);

router.get('/web/device', sanitizeMiddlewareInput,getAllHtml);

router.get('/term/device/:id',sanitizeMiddlewareInput,getOneTerm);


/** apis*/
router.get('/device', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAllApi/*,sanitizeMiddlewareOutput*/);

router.get('/device/:id',sanitizeMiddlewareInput, /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getOneApi);

router.post('/device',sanitizeMiddlewareInput, crearDeviceApi)

router.delete('/device/:id',sanitizeMiddlewareInput,deleteDeviceApi);

router.patch('/device/:id', sanitizeMiddlewareInput,updateDeviceApi);



/** html*/

router.post('/html/device',sanitizeMiddlewareInput, crearDeviceWeb);

router.delete('/html/device/:id',sanitizeMiddlewareInput,deleteDeviceWeb);

router.patch('/html/device/:id', sanitizeMiddlewareInput,updateDeviceWeb);


/** vistas */

router.get('/views/DevicesMeasurements',  getAllDevicesMeasurementsWeb);

router.get('/views/Devices',getAllWeb);

/** Exporto */
export default router;
