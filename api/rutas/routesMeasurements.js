import {sanitizeMiddlewareInput,sanitizeMiddlewareOutput} from '../utils/sanitize.js'
import {Router} from 'express'
/*
import {  
    ensureToken,
    chequeoToken,
    chequeoGrupoUsuario,
    } from '../controllers/UserController.js';

*/
import {  
     getAllApi,
    
     createMeasurementApi,
     getAllByIdDeviceApi,
     getAllByIdDeviceWeb,
     getOneHtml,
     getAllHtml,
    } from '../controllers/MeasurementsController.js';

/** Rutas */
const router = Router();

/*anteriores*/

router.get('/web/measurement/:id/:t/:h/:p',sanitizeMiddlewareInput, getOneHtml,sanitizeMiddlewareOutput);

router.get('/web/measurement', sanitizeMiddlewareInput,getAllHtml,sanitizeMiddlewareOutput);


/** api*/
router.get('/measurement', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAllApi/*,sanitizeMiddlewareOutput*/);

router.post('/measurement', sanitizeMiddlewareInput,createMeasurementApi,sanitizeMiddlewareOutput);

router.get('/measurement/device/:id',sanitizeMiddlewareInput,getAllByIdDeviceApi,sanitizeMiddlewareOutput);

/*views*/
router.get('/views/measurement/device/:id',  getAllByIdDeviceWeb);
/** Exporto */
export default router;