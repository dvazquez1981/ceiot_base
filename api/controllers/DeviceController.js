import Device from '../models/Device.js'
import  render from "../render.js";
import {sanitize} from '../utils/sanitize.js'

export async function getAllApi(req,res){

    try {
        console.log('Obtengo todas los dispositivos ');
        const dv= await Device.findAll();        
        if(dv){

            res.status(200).json(sanitize(dv));
        }
     
  
      } catch (error) {
        console.error(error.message );
        res.status(500).json({ error: error.message });
      }
    }

    
export async function getAllWeb(req,res){

    try {
        console.log('Obtengo todos los dispotivos ');
        const dv= await Device.findAll();        
        if(dv){

            res.render('Devices', { devices: sanitize(dv), msg: req.query.msg, error: req.query.error });
        }
     
  
      } catch (error) {
        console.log('Error al obtener los dispositivos');
        return res.send('Error al obtener los dispositivos');
      }
    }


export async function getAllDevicesMeasurementsWeb(req, res) {

    console.log("Obtengo todos los dispositivos ");
    try {
        const dv= await Device.findAll();        
        if(dv){

            res.render('DevicesMeasurements',  { devices: sanitize(dv), msg: req.query.msg, error: req.query.error });
        }
     
  
      } catch (error) {
        return res.send('Error al obtener los dispositivos');
      }
    }
        

/** Obtener por id */
export async function getOneApi(req,res)
{
    
    var {id}  = req.params;
    console.log("Get device id: " + id);
        
    try {

        const DeviceFound = await Device.findOne({
            where: {
                device_id:id
            }
        });

        if( DeviceFound){
            console.log("Se encontro");
            res.status(200).json(sanitize(DeviceFound));

        }else{
            onsole.log("No se encontro");
            res.status(404).json({
                message: 'No se encuentra el Device.'      
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message:'Algo salio mal',
            data:{error}
        });
    }
}


/** Obtener por id */
export async function getOneHtml(req,res)
{
    
    var {id}  = req.params;
    console.log("get device id: " + id);
    var template = "<html>"+
                     "<head><title>Sensor {{name}}</title></head>" +
                     "<body>" +
		        "<h1>{{ name }}</h1>"+
		        "id  : {{ id }}<br/>" +
		        "Key : {{ key }}" +
                     "</body>" +
                "</html>";

    try {

        const DeviceFound = await Device.findOne({
            where: {
                device_id:id
            }
        });

        if( DeviceFound){
            DeviceFound=sanitize(DeviceFound)
            console.log("Se encontró");
            res.send(render(template,{id: DeviceFound.device_id, key: DeviceFound.key, name: DeviceFound.name}));




        }else{
            console.log("No se encontró");
            res.status(404).json({
                message: 'No se encuentra el Device.'      
            })
        }
        
    } catch (error) {
        console.log('Algo salio mal',error);
        res.status(500).json({
            message:'Algo salio mal',
            data:{error}
        });
    }
}

export async function getAllHtml(req,res){

    try {
        console.log("Obtengo todos los dispositivos ");
        // Obtener todos los dispositivos
        var devices = await Device.findAll();
        devices=sanitize(devices)
           
        // Crear el HTML para cada dispositivo usando map
        var deviceRows = devices.map(function(device) {
           // console.log(device); // Ver el dispositivo en la consola
            return '<tr><td><a href="/web/device/' + device.device_id + '">' + device.device_id + '</a></td>' +
                   '<td>' + device.name + '</td>' +
                   '<td>' + device.key + '</td></tr>';
        }).join(''); // .join('') para combinar los elementos del array en un solo string

        // Enviar el HTML de la respuesta
        res.send("<html>" +
                 "<head><title>Sensores</title></head>" +
                 "<body>" +
                    "<table border=\"1\">" +
                       "<tr><th>id</th><th>name</th><th>key</th></tr>" +
                       deviceRows + // Usamos el HTML generado dinámicamente
                    "</table>" +
                 "</body>" +
             "</html>");

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Algo salió mal', data: { error } });
    }
}



export async function getOneTerm(req,res)
{

    
    var {id}  = req.params;
    console.log("Get term device id: " + id);

    try {

        const DeviceFound = await Device.findOne({
            where: {
                device_id:id
            }
        });

    var red = "\x1b[31m";  // Cambiado de \33[31m a \x1b[31m
    var green = "\x1b[32m";  // Cambiado de \33[32m a \x1b[32m
    var blue = "\x1b[33m";  // Cambiado de \33[33m a \x1b[33m
    var reset = "\x1b[0m";  // Cambiado de \33[0m a \x1b[0m
    var template = "Device name " + red   + "   {{name}}" + reset + "\n" +
           "       id   " + green + "       {{ id }} " + reset +"\n" +
           "       key  " + blue  + "  {{ key }}" + reset +"\n";
          
    if( DeviceFound){
        DeviceFound=sanitize(DeviceFound)
        console.log("se encontró");
        res.send(render(template,{id: DeviceFound.device_id, key: DeviceFound.key, name: DeviceFound.name}));

          }else{
            console.log("no se encontró");
    res.status(404).json({
        message: 'No se encuentra el Device.'      
    })
}

} catch (error) {
    console.log("Algo salio mal ",error);
res.status(500).json({
    message:'Algo salio mal',
    data:{error}
});
}
}

//
/* crear Device */
export async function crearDeviceApi(req, res) 
 {
    const {id ,n, k} = req.body;

    console.log("Device id:" + id + " name:" +n + " key:" + k );
   
    // Validar que todos los campos requeridos están presentes
    if (!(id && n && k)){
        console.log('Id, name, key son obligatorios');
        return res.status(400).json({
            message: 'Id, name, key son obligatorios',
            status: 0,
        });
    }

    try {
        // Verificar si Device ya existe
        const existingDevice= await  Device.findOne({
            where: {
                device_id: id
            }
          });

        if (existingDevice) {

            console.log('El Device ya existe. Elige un device_id distinto.');
            return res.status(409).json({
                message: 'El Device ya existe. Elige un device_id distinto.',
                status: 0,
            });
        }

        // Crear un nuevo Device
        const newDevice= await Device.create({
            device_id:id,
            name: n,
            key:k
        });
        console.log('Device creado con éxito.');
        return res.status(201).json({
            message: 'Device creado con éxito.',
            status: 1,
            data:sanitize(newDevice)
        });
    } catch (error) {
        console.error('Error al crear el device:', error);
        return res.status(500).json({
            message: 'Ocurrió un error inesperado.',
            status: 0,
            error: error.message,
        });
    }
};


export async function crearDeviceWeb(req, res) 
 {
    const {id ,n, k} = req.body;

    console.log("Device id:" + id + " name:" +n + " key:" + k );
   
    // Validar que todos los campos requeridos están presentes
    if (!(id && n && k)){
        console.log('Id, name, key son obligatorios');
       return res.redirect('/views/devices?msg=faltan+campos+requeridos');
    }

    try {
        // Verificar si Device ya existe
        const existingDevice= await  Device.findOne({
            where: {
                device_id: id
            }
          });

        if (existingDevice) {
            console.log('El Device ya existe. Elige un device_id distinto.');
            return res.redirect('/views/devices?msg=ya+existe');
        }

        // Crear un nuevo Device
        const newDevice= await Device.create({
            device_id:id,
            name: n,
            key:k
        });
        console.log('Device creado con éxito.');
        return res.redirect('/views/devices?msg=device+creada+con+exito');
    } catch (error) {
        console.error('Error al crear el TipoVia:', error);
        return res.redirect('/views/devices?msg=hubo+un+error');
    }
};

/** borra Device*/
export async function deleteDeviceApi(req, res)
{

const {id}= req.params;
console.log("Device id: " + id + " para borrar");
 try {

  await Device.destroy({
        where: {
            device_id :id 
        }})
        .then(function (deletedRecord) {
            if(deletedRecord > 0)
            {
                console.log("Device id: " + id +  " se borro correctamente");
                res.status(200).json({message: "Se borro correctamente"});          
            }
            else
            {   console.log("Device id: " + id +  " no existe registo");
                res.status(404).json({message: " No existe registo"})
            }
        })

} catch (error) {
    console.error('Error al borrar: ', error);
    res.status(500).json({
        message:'Hubo un error',
        data:{error}
    });
}
}

/** borra Device*/
export async function deleteDeviceWeb(req, res)
{

const {id}= req.params;

console.log("Device id: " + id + " para borrar");

 try {

  await Device.destroy({
        where: {
            device_id :id 
        }})
        .then(function (deletedRecord) {
            if(deletedRecord > 0)
            {
            console.log("Device id: " + id +  " se borro correctamente");
            return res.redirect('/views/devices?msg=se+borro+correctamente');        
            }
            else
            {
             console.log("Device id: " + id +  " no existe registo"); 
            return res.redirect('/views/devices?msg=no+existe+registro');
            }
        })

} catch (error) {
    console.error('Error al borrar: ', error);
    res.status(500).json({
        message:'Hubo un error',
        data:{error}
    });
}
}

/** actualizar Device*/
export async function updateDeviceApi(req,res){

    var {id}  = req.params;
    const {n,k}= req.body;

    console.log("Device id: " + id + " name: " +n + " key: " + k );
    try {

           await Device.findOne({
            where: {
                device_id :id 
                   },
            attributes: [ 'device_id',
                'name',
                'key'
                    ]
          })
          .then( async dv=> {

               // Si dv es null, se responde con un error 404
                if (!dv) {
                    console.log("Device id: " + id + " no encontrado" );
                return res.status(404).json({
                    message: 'Device no encontrado.'
                     });
                 }



                 // Si device no es null, actualizamos  en la base de datos
                 await dv.update({  device_id:id,
                    name:n|| dv.name ||  null,
                    key:k || dv.key|| null
                 
                   });
                 // Si la actualización es exitosa, respondemos con éxito
                 console.log("Device id: " + id + " se actualizo correctamente" );
                res.status(200).json({
                message: 'Device actualizo correctamente.'
                });
          });
        
    } catch (error) {

        console.log(error)
        res.status(500).json({
            message:'Algo no funciono',
            data:{error}
        });
    }

    

}
/** actualizar Device*/
export async function updateDeviceWeb(req,res){

    var {id}  = req.params;
    const {n,k}= req.body;

    console.log("Device id: " + id + " name: " +n + " key: " + k );
    try {

           await Device.findOne({
            where: {
                device_id :id 
                   },
            attributes: [ 'device_id',
                'name',
                'key'
                    ]
          })
          .then( async dv=> {

               // Si dv es null, se responde con un error 404
                if (!dv) {
                    console.log("Device id: " + id + " no encontrado" );
                    return res.redirect('/views/devices?msg=no+existe+registro');
                 }


                 // Si device no es null, actualizamos  en la base de datos
                 await dv.update({  device_id:id,
                    name:n|| dv.name ||  null,
                    key:k || dv.key|| null
                 
                   });
                   console.log("Device id: " + id + " se actualizo correctamente" );
                 // Si la actualización es exitosa, respondemos con éxito
                 return res.redirect('/views/devices?msg=se+actualizo+correctamente');
          });
        
    } catch (error) {

        console.error(error)
        return res.redirect('/views/devices?msg=algo+salio+mal');
    }
}