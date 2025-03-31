import  express from 'express';
import  bodyParser from "body-parser";
import  iotdb_2 from "./bd/iiot11_bd_2.js"
import  render from "./render.js"
import  addAdminEndpoint from "./admin.js";

//rutas
import rutasDevice from './rutas/routesDevice.js'
import rutasMeasurements from './rutas/routesMeasurements.js'

// API Server

const app = express();

//app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('spa/static'));

// Middleware para manejar application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar application/json
app.use(express.json());



//ruta
app.use(rutasDevice);
app.use(rutasMeasurements);

//rutas admin
addAdminEndpoint(app, render);


const PORT = 8080;



async function main(){
   
  

    app.listen(PORT, () => {
     console.log("El servidor está inicializado en el puerto: " + PORT);
    });
    }
    
    
main()
    
   
   
   