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
     getOneHtml,
     getAllHtml,
    } from '../controllers/MeasurementsController.js';

/** Rutas */
const router = Router();

/** Controladores */

/** Obtener mediciones*/
router.get('/measurement', /*ensureToken, chequeoToken, chequeoGrupoUsuario('admin'), */ getAll);

router.post('/measurement', createMeasurement);

router.get('/web/measurement/:id&:t&:h', getOneHtml);

router.get('/web/measurement', getAllHtml);


/** Exporto */
export default router;