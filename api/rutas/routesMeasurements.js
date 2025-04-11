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
    getAll,
    
     createMeasurement,
     getAllByIdDevice,
     getAllByIdDeviceView,
     getOneHtml,
     getAllHtml,
    } from '../controllers/MeasurementsController.js';

/** Rutas */
const router = Router();

/** Controladores */

/** Obtener mediciones*/
router.get('/measurement', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAll,sanitizeMiddlewareOutput);

router.post('/measurement', sanitizeMiddlewareInput,createMeasurement,sanitizeMiddlewareOutput);

router.get('/web/measurement/:id/:t/:h/:p',sanitizeMiddlewareInput, getOneHtml,sanitizeMiddlewareOutput);

router.get('/web/measurement', sanitizeMiddlewareInput,getAllHtml,sanitizeMiddlewareOutput);

router.get('/measurement/device/:id',sanitizeMiddlewareInput,getAllByIdDevice,sanitizeMiddlewareOutput);

router.get('/views/measurement/device/:id',  getAllByIdDeviceView);
/** Exporto */
export default router;