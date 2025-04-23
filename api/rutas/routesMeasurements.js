import {sanitizeMiddlewareInput} from '../utils/sanitize.js'
import {Router} from 'express'
/*
import {  
    ensureToken,
    chequeoToken,
    chequeoGrupoUsuario,
    } from '../controllers/UserController.js';

*/
import {  
    getOneHtml,
    getAllHtml,
     getAllApi,
     createMeasurementApi,
     getAllByIdDeviceApi,
     getAllByIdDeviceWeb
    
    } from '../controllers/MeasurementsController.js';

/** Rutas */
const router = Router();

/*anteriores*/

router.get('/web/measurement/:id/:t/:h/:p',sanitizeMiddlewareInput, getOneHtml);

router.get('/web/measurement', sanitizeMiddlewareInput,getAllHtml);


/** api*/
router.get('/measurement', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAllApi/*,sanitizeMiddlewareOutput*/);

router.post('/measurement', sanitizeMiddlewareInput,createMeasurementApi);

router.get('/measurement/device/:id',sanitizeMiddlewareInput,getAllByIdDeviceApi);

/*views*/
router.get('/views/measurement/device/:id',  getAllByIdDeviceWeb);
/** Exporto */
export default router;