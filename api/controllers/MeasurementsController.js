import Measurement from '../models/Measurements.js';
import Device from '../models/Device.js'
import  render from "../render.js";
import {sanitize} from '../utils/sanitize.js'


//const { ObjectId } = mongoose.Types;
/** Obtener todos los MeasurementS */

export async function getAllApi(req, res) {
    try {

        console.log('Obtengo todas las mediciones')
        const measurements = await Measurement.find(); 
       
        if (measurements.length > 0) {
            const sanitizedMeasurements = measurements.map(m => sanitize(JSON.parse(JSON.stringify(m))))

 
            res.status(200).json(sanitizedMeasurements);
        } else {

        console.log('No se encontraron mediciones.')
            res.status(404).json({ message: 'No se encontraron mediciones.' });
        }
    } catch (error) {
        console.error(error.message )
        res.status(500).json({ error: error.message });
    }
}




/** Crear un nuevo measurement */
/*validando los valores del body*/
export async function createMeasurementApi(req, res) {

  // Si los datos vienen en formato JSON o vienen en formato URL-encoded es indistito.
    const { id, t, h,p } = req.body;


    console.log("Ingreso: device_id: " + id + " temp: " + t + " hum: " + h+ " pres: " + p);	


 
    // Validar que todos los campos requeridos están presentes
    if (!id || isNaN(t) || isNaN(h)|| isNaN(p))  {

    console.log('Device_id, t, h, p son obligatorios, t, h, p deben ser numeros')
        return res.status(400).json({ message: 'Device_id, t, h, p son obligatorios, t, h, p deben ser numeros ',
            status: 0 });
    }

    
    try {

        
   //Validar que temperatura y humedad sean números, incluso si son strings que representan números
   if (Number.isNaN(Number(t)) || Number.isNaN(Number(h))|| Number.isNaN(Number(p))) {
    console.log('Temperatura, humedad  y presion deben ser números.')
    return res.status(422).json({
      message: 'Temperatura, humedad  y presion deben ser números.',
      status: 0,
    });
    }

    //-50 a 100 grados
    let temperatura=Number(t)
    if (temperatura < -50 || temperatura > 100) { 
        console.log('La temperatura (t) debe estar entre -50 y 100 grados.')

        return res.status(422).json({
            message: 'La temperatura (t) debe estar entre -50 y 100 grados.',
            status: 0,
        });
    }

   //0 a 100 
   let humedad=Number(h)

  // Validar que h esté en un rango de humedad válido, por ejemplo, entre 0 y 100
   if (humedad<0  || humedad > 100) {
    console.log('La humedad (h) debe estar entre 0 y 100%')
    return res.status(422).json({
      message: 'La humedad (h) debe estar entre 0 y 100%.',
      status: 0,
    });
  }
    
  let presion=Number(p)
  // Validar que h esté en un rango de presion válido, por ejemplo, entre 30000 y 110000
  if (presion<30000 || presion > 110000) {
    console.log('La presion (p) debe estar entre 30000 y 110000')
    return res.status(422).json({
      message: 'La presion (p) debe estar entre 30000 y 110000',
      status: 0,
    });
  }

    const DeviceFound = await Device.findOne({
        where: {
            device_id: id
        }
      });


     if (!DeviceFound)
     {    console.log('El device_id no es correcto.')
        return res.status(422).json(
            { message: 'El device_id no es correcto.',
            status: 0
           
     });

     }
        // Crear el nuevo dispositivo
        const newMeasurement = new Measurement({ id, t, h, p});
        await newMeasurement.save();
        const insertedId = newMeasurement._id;
        console.log('Medicion creado con éxito id:'+insertedId )
        //return { insertedId };
        return res.status(201).json(
            
            { message: 'Medicion creado con éxito.',  status: 1, id_inserted:insertedId });
            
    } catch (error) {
        console.error('Error al crear la medicion:', error);
        return res.status(500).json({ message: 'Ocurrió un error inesperado', error: error.message });
    }
}

/** Obtener por id */

export async function getOneHtml(req,res)
{
    
    var {id,t,h,p}  = req.params;
    console.log("Get: device_id: " + id + " temp: " + t + " hum: " + h+ " pres: " + p);	
    // Validar que todos los campos requeridos están presentes
    if (!id || !t || !h || !p)  {
        console.log('Device_id, t, h,p son obligatorios')
        return res.status(400).json({ message: 'Device_id, t, h,p son obligatorios',
            status: 0 });
        
    }

   
                var template = "<html>"+
                "<head>Sensor id: <title>Sensor {{id}}</title></head>" +
                "<body>" +
           "<h1>{{ id }}</h1>"+
           "temperatura: {{ t}}<br/>" +
           "humedad: {{ h }}<br/>" +
           "presion: {{ p }}" +
                "</body>" +
           "</html>";


    try {
             // Verificar si el ID es válido
   

        const m = await Measurement.findOne( {id: id, 
            t: t, 
            h: h , 
            p: p 
        });
          
        
        if(m){

            const sanitizedM=  sanitize(JSON.parse(JSON.stringify(m)))
            console.log('Se obtuvo la medicion')
            res.send(render(template,{id: sanitizedM.id, t: sanitizedM.t, h: sanitizedM.h, p: sanitizedM.p}));




        }else{
            console.log('No se obtuvo la medicion')
            res.status(404).json({
                message: 'No se encuentra la medicion.'      
            })
        }
        
    } catch (error) {

        console.error('Algo salio mal',error)
        res.status(500).json({
            message:'Algo salio mal',
            data:{error}
        });
    }
        
}

export async function getAllHtml(req,res)
{
   
        // Obtener todos los dispositivos
        try {
            console.log('Obtengo todas las mediciones')
            const Measurements = await Measurement.find(); 
            if (Measurements.length > 0) {
              
             
                    const sanitizedMeasurements = Measurements.map(m => sanitize(JSON.parse(JSON.stringify(m))))
    
                    console.log('Se encontraron mediciones.' )  
    
              
                // Crear el HTML para cada medida usando map
        var  measurementsRows = sanitizedMeasurements.map(function(m) {
           
           // // Ver el dispositivo en la consola
            return '<tr><td><a href="/web/measurement/'  + m.id + '/' + m.t + '/' + m.h + '/' + m.p +'">' + m.id + '</a></td>' +
            '<td>'  + m.t +'</td>' +
            '<td>'  + m.h +'</td>' +
            '<td>' +  m.p + '</td></tr>';
            return '<td>' + m.id + '</td> <a href="/web/measurement/' + m.id + '/' + m.t + '/' + m.h +  '/' + m.p +'">' + m._id + '</a>' +
    
            '<td>' + m.t + '</td>' +
            '<td>' + m.h + '</td>' +

            '<td>' + m.p + '</td></tr>';
     }).join('');
    // para combinar los elementos del array en un solo string

        // Enviar el HTML de la respuesta
        res.send("<html>" +
                 "<head><title>Mediciones </title></head>" +
                 "<body>" +
                    "<table border=\"1\">" +
                       "<tr><th>Sensor id </th><th>temperatura </th><th>humedad </th><th>presion </th></tr>" +
                       measurementsRows+ // Usamos el HTML generado dinámicamente
                    "</table>" +
                 "</body>" +
             "</html>");

              





            } else {
                console.log('No se encontraron mediciones.')
                res.status(404).json({ message: 'No se encontraron mediciones.' });
            }
        } catch (error) {
            console.log(error.message )
            res.status(500).json({ error: error.message });
        }


    }

export async function getAllByIdDeviceApi(req,res)
    {
     var {id}  = req.params;
     console.log('Obtengo todas las mediciones del device_id: '+id)
        try {
    
            const DeviceFound = await Device.findOne({
                where: {
                    device_id:id
                }
            });
    
            if(!DeviceFound){
              
                console.log("Device id: " + id +  " no encontrado ")
                return res.status(404).json({
                    message: 'No se encuentra el Device.'      
                   
                });
             
            }

            console.log("Device id: " + id + " encontrado ")

            const me = await Measurement.find( {id: id });
            if (me.length > 0) {
                const sanitizedMeasurements = me.map(m => sanitize(JSON.parse(JSON.stringify(m))))

                console.log('Se encontraron mediciones.' )  

                res.status(200).json( sanitizedMeasurements );
            }
            else {
                console.log('No se encontraron mediciones.' )
            res.status(404).json({ message: 'No se encontraron mediciones.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log( error.message)
    
    }
 }

 export async function getAllByIdDeviceWeb(req,res)
    {
     var {id}  = req.params;
     console.log('Obtengo todas las mediciones del device_id: '+id)
            
        try {
    
            const DeviceFound = await Device.findOne({
                where: {
                    device_id:id
                }
            });
    
            if(!DeviceFound){
              
                console.log("Device id: " + id +  " no encontrado ")
                return res.status(404).send({
                    message: 'No se encuentra el Device.'      
                   
                });
             
            }

            console.log("Device id: " + id + " encontrado ")

            const me = await Measurement.find( {id: id });
            if (me.length > 0) {
                const sanitizedMeasurements = me.map(m => sanitize(JSON.parse(JSON.stringify(m))))

                console.log('Se encontraron mediciones.' )  

                    res.render('Measurements', { measurements:sanitizedMeasurements });
                
             
            }
            else {
                console.log('No se encontraron mediciones.') 
                return res.redirect('/views/DevicesMeasurements?msg=No+tiene+mediciones');
        }
    } catch (error) {
        console.error(error);
        return res.redirect('/views/DevicesMeasurements?msg=algo+salio+mal');
    }
 }