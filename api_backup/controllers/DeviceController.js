import Device from '../models/Device.js'
import  render from "../render.js";
/** Obtener todos los Devices*/
export async function getAll(req,res){

    try {
        const dv= await Device.findAll();        
        if(dv){

            res.status(200).json(dv);
        }
     
  
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }



export async function getAllView(req, res) {


    try {
        const dv= await Device.findAll();        
        if(dv){

            res.render('Devices', { devices: dv });
        }
     
  
      } catch (error) {
        return res.send('Error al obtener los dispositivos');
      }
    }
        

/** Obtener por id */
export async function getOne(req,res)
{
    
    var {id}  = req.params;
        
    try {

        const DeviceFound = await Device.findOne({
            where: {
                device_id:id
            }
        });

        if( DeviceFound){
            res.status(200).json(DeviceFound);

        }else{
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
         
            //console.log(DeviceFound);
            res.send(render(template,{id: DeviceFound.device_id, key: DeviceFound.key, name: DeviceFound.name}));




        }else{
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

export async function getAllHtml(req,res){

    try {
        // Obtener todos los dispositivos
        var devices = await Device.findAll();

        // Crear el HTML para cada dispositivo usando map
        var deviceRows = devices.map(function(device) {
            console.log(device); // Ver el dispositivo en la consola
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
         
       // console.log(DeviceFound);
        res.send(render(template,{id: DeviceFound.device_id, key: DeviceFound.key, name: DeviceFound.name}));

          }else{
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


/* crear Device */
export async function crearDevice(req, res) 
 {
    const {id ,n, k} = req.body;

    console.log("device id    : " + id + " name        : " +n + " key         : " + k );
   
    // Validar que todos los campos requeridos están presentes
    if (!(id && n && k)){
        return res.status(400).json({
            message: 'id, name, key son obligatorios',
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
            return res.status(409).json({
                message: 'el Device ya existe. Elige un device_id distinto.',
                status: 0,
            });
        }

        // Crear un nuevo Device
        const newDevice= await Device.create({
            device_id:id,
            name: n,
            key:k
        });

        return res.status(201).json({
            message: 'Device creado con éxito.',
            status: 1,
            data: newDevice
        });
    } catch (error) {
        console.error('Error al crear el TipoVia:', error);
        return res.status(500).json({
            message: 'Ocurrió un error inesperado.',
            status: 0,
            error: error.message,
        });
    }
};



/** borra Device*/
export async function deleteDevice(req, res)
{

const {id}= req.params;
 try {

  await Device.destroy({
        where: {
            device_id :id 
        }})
        .then(function (deletedRecord) {
            if(deletedRecord > 0)
            {
                res.status(200).json({message: "Se borro correctamente"});          
            }
            else
            {
                res.status(404).json({message: "no existe registo"})
            }
        })

} catch (error) {
    res.status(500).json({
        message:'Hubo un error',
        data:{error}
    });
}
}

/** actualizar Device*/
export async function updateDevice(req,res){

    var {id}  = req.params;
    const {n,k}= req.body;

    console.log("device id    : " + id + " name        : " +n + " key         : " + k );
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
                return res.status(404).json({
                    message: 'device no encontrado.'
                     });
                 }



                 // Si device no es null, actualizamos  en la base de datos
                 await dv.update({  device_id:id,
                    name:n|| dv.name ||  null,
                    key:k || dv.key|| null
                 
                   });
                 // Si la actualización es exitosa, respondemos con éxito
                res.status(200).json({
                message: 'device actualizo correctamente.'
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
