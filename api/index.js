//logger
import morgan from 'morgan'
import logger from './utils/logger.js'; // Importación del logger

import  express from 'express';
import './utils/signals.js'; 

import  bodyParser from "body-parser";
import  render from "./render.js"
import  addAdminEndpoint from "./admin.js";

import methodOverride from 'method-override';




//rutas
import rutasDevice from './rutas/routesDevice.js'
import rutasMeasurements from './rutas/routesMeasurements.js'
import rutasUsuario from './rutas/routesUsuario.js'
// API Server

const app = express();

//app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('spa/static'));
app.use(express.static('public'));
app.use(methodOverride('_method'));




// Middleware para manejar application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar application/json
app.use(express.json());


//ruta
app.use(rutasDevice);
app.use(rutasMeasurements);
app.use(rutasUsuario)

app.set('view engine', 'ejs');
app.set('views', './views');



//rutas admin
addAdminEndpoint(app, render);



app.set('port', 8080);

async function main(){

    app.listen(app.get('port'), () => {
        console.log("El api está inicializado en el puerto: " + app.get('port'));
        });
        

}
    
    
main()
    
   
   
   